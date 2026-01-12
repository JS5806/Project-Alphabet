import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { VoteService } from './vote.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*', // 실제 운영 시에는 프론트엔드 도메인으로 제한
  },
  namespace: 'vote',
})
export class VoteGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly voteService: VoteService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // 연결 시 토큰 검증 (Query Param 또는 Header)
      const token = client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token);
      client.data.user = payload; // 소켓 인스턴스에 유저 정보 저장
      console.log(`Client connected: ${client.id}, User: ${payload.username}`);
      
      // 접속하자마자 현재 순위 전송
      const rankings = await this.voteService.getRealtimeRankings();
      client.emit('rankings_update', rankings);
    } catch (e) {
      console.log('Connection unauthorized');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('cast_vote')
  async handleCastVote(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { restaurantId: number },
  ) {
    try {
      const userId = client.data.user.userId;
      if (!userId || !data.restaurantId) return;

      // 투표 로직 실행 (Redis Lock 포함)
      await this.voteService.castVote(userId, data.restaurantId);

      // 성공 시 전체 클라이언트에게 최신 랭킹 브로드캐스트
      const rankings = await this.voteService.getRealtimeRankings();
      this.server.emit('rankings_update', rankings);
      
      // 투표한 사용자에게 성공 메시지
      client.emit('vote_success', { message: 'Vote accepted' });

    } catch (error) {
      client.emit('vote_error', { message: error.message });
    }
  }
}