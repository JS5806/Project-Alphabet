import { apiClient } from './client';

// Types
export interface Restaurant {
  id: number;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
}

export interface VoteResult {
  restaurantId: number;
  restaurantName: string;
  count: number;
}

// --- MOCK DATA & SIMULATION (백엔드 없이 실행 가능하도록 구현) ---
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_RESTAURANTS: Restaurant[] = [
  { id: 1, name: '스시 오마카세', category: '일식', description: '신선한 초밥과 사시미', imageUrl: 'https://placehold.co/400x300?text=Sushi' },
  { id: 2, name: '불타는 짜장', category: '중식', description: '매운 쟁반짜장 전문점', imageUrl: 'https://placehold.co/400x300?text=Jajang' },
  { id: 3, name: '맘마미아 파스타', category: '양식', description: '정통 이탈리안 까르보나라', imageUrl: 'https://placehold.co/400x300?text=Pasta' },
  { id: 4, name: '할매 순대국', category: '한식', description: '70년 전통의 깊은 맛', imageUrl: 'https://placehold.co/400x300?text=Soup' },
  { id: 5, name: '버거 킹덤', category: '패스트푸드', description: '와퍼보다 큰 킹덤버거', imageUrl: 'https://placehold.co/400x300?text=Burger' },
];

let MOCK_VOTES: Record<number, number> = { 1: 5, 2: 3, 3: 8, 4: 2, 5: 4 };
// -------------------------------------------------------------

export const authApi = {
  login: async () => {
    await delay(1000); // Mock latency
    // 실제로는 OAuth 리다이렉트나 SSO 토큰 교환 로직
    return { accessToken: 'mock_jwt_token_xyz_123', user: { name: 'Dev User' } };
  },
};

export const restaurantApi = {
  getList: async (): Promise<Restaurant[]> => {
    await delay(800);
    // return apiClient.get('/restaurants').then(res => res.data);
    return MOCK_RESTAURANTS;
  },
};

export const voteApi = {
  submitVote: async (restaurantId: number) => {
    await delay(500);
    // return apiClient.post('/vote', { restaurantId });
    if (MOCK_VOTES[restaurantId]) MOCK_VOTES[restaurantId]++;
    else MOCK_VOTES[restaurantId] = 1;
    return { success: true };
  },
  
  getResults: async (): Promise<VoteResult[]> => {
    await delay(600);
    // return apiClient.get('/vote/results').then(res => res.data);
    return Object.keys(MOCK_VOTES).map(key => {
      const id = Number(key);
      const restaurant = MOCK_RESTAURANTS.find(r => r.id === id);
      return {
        restaurantId: id,
        restaurantName: restaurant?.name || 'Unknown',
        count: MOCK_VOTES[id]
      };
    }).sort((a, b) => b.count - a.count); // 득표수 내림차순 정렬
  }
};