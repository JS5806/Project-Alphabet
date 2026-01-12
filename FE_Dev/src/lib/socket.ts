import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../types';

const URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  autoConnect: false,
  transports: ['websocket'], // MVP 성능 최적화
});