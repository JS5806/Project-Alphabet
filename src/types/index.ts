// 도메인 타입 정의

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  image?: string;
  description?: string;
}

export interface VoteRoom {
  id: string;
  title: string;
  candidateIds: string[]; // 후보 식당 ID 목록
  createdAt: number;
  isClosed: boolean;
}

export interface VoteRecord {
  roomId: string;
  restaurantId: string;
  voterName: string; // 익명 투표 시 'Guest' 등으로 처리 가능
  timestamp: number;
}

// API 응답 타입 (Result)
export interface VoteResult {
  restaurantId: string;
  restaurantName: string;
  count: number;
}