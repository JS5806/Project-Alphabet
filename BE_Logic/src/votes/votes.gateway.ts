import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { VotesService } from './votes.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class VotesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private votesService: VotesService,
    private jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    try {
      // JWT 인증 확인 (MVP: Handshake Query or Auth Header)
      const token = client.handshake.auth.token || client.handshake.headers.authorization;
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token.replace('Bearer ', ''));
      client.data.username = payload.username;
      console.log(`Client connected: ${client.id}, User: ${payload.username}`);
    } catch (e) {
      console.log('Connection unauthorized');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinSession')
  async handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: number },
  ) {
    const roomName = `session_${data.sessionId}`;
    client.join(roomName);
    
    // 현재 세션 상태 전송
    const session = await this.votesService.getSession(data.sessionId);
    client.emit('sessionUpdate', session);
  }

  @SubscribeMessage('vote')
  async handleVote(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: number; optionId: number },
  ) {
    const username = client.data.username;
    try {
      // 투표 처리 (Transaction)
      const updatedSession = await this.votesService.castVote(
        username,
        data.sessionId,
        data.optionId,
      );

      // 룸에 있는 모든 인원에게 업데이트된 정보 브로드캐스트
      const roomName = `session_${data.sessionId}`;
      this.server.to(roomName).emit('sessionUpdate', updatedSession);
      
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }
}