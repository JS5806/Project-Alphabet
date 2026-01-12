export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  votes: number; // 실시간 집계된 투표 수
}

export interface AuthResponse {
  user: User;
  token: string;
}

// 소켓 이벤트 타입 정의
export interface ServerToClientEvents {
  restaurant_added: (data: Restaurant) => void;
  vote_updated: (data: Restaurant[]) => void;
}

export interface ClientToServerEvents {
  join_room: (room: string) => void;
}