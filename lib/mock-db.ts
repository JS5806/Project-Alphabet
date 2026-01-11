// 간단한 인메모리 DB 역할을 하는 Mock Data입니다.
// 서버 재시작 시 초기화됩니다.

export interface Restaurant {
  id: string;
  name: string;
  category: 'KR' | 'CN' | 'JP' | 'WS'; // 한식, 중식, 일식, 양식
  image: string;
}

export interface VoteSession {
  id: string;
  title: string;
  candidates: { restaurantId: string; votes: number }[];
  participants: string[]; // nickname list
}

// 초기 식당 데이터
export const restaurants: Restaurant[] = [
  { id: '1', name: '김치찌개 맛집', category: 'KR', image: 'https://placehold.co/400x300/orange/white?text=Kimchi' },
  { id: '2', name: '홍콩반점', category: 'CN', image: 'https://placehold.co/400x300/red/white?text=Jajang' },
  { id: '3', name: '스시 오마카세', category: 'JP', image: 'https://placehold.co/400x300/blue/white?text=Sushi' },
  { id: '4', name: '버거킹', category: 'WS', image: 'https://placehold.co/400x300/brown/white?text=Burger' },
  { id: '5', name: '전주 비빔밥', category: 'KR', image: 'https://placehold.co/400x300/green/white?text=Bibimbap' },
  { id: '6', name: '파스타 전문점', category: 'WS', image: 'https://placehold.co/400x300/yellow/black?text=Pasta' },
];

// 투표 세션 저장소
export const voteSessions: Record<string, VoteSession> = {};