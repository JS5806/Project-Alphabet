import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  // Method to broadcast vote updates to all clients
  broadcastVoteUpdate(data: any) {
    this.server.emit('voteUpdate', data);
  }
}