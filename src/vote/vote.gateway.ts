import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class VoteGateway {
  @WebSocketServer()
  server: Server;

  // 투표 현황 브로드캐스트 함수
  broadcastVoteUpdate(data: any) {
    this.server.emit('vote_update', data);
  }
}