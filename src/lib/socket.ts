import { io, Socket } from 'socket.io-client';

// 실제 환경에서는 환경변수(process.env.REACT_APP_SOCKET_URL) 사용
const SOCKET_URL = 'http://localhost:4000';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // 인증 후 수동 연결을 위해 false 설정
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket'], // 성능을 위해 websocket 우선 사용
});