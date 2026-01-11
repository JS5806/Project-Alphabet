import axios from 'axios';

// --- Types ---
export interface User {
  id: string;
  username: string;
  token: string;
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  distance: number; // m 단위
  votes: number;
  description: string;
}

// --- Mock Data & Logic (Backend Simulation) ---
const STORAGE_KEY = 'mock_restaurants';
const initialRestaurants: Restaurant[] = [
  { id: '1', name: '김가네 김밥', category: '한식', distance: 150, votes: 5, description: '빠르고 간편한 분식' },
  { id: '2', name: '스시 로', category: '일식', distance: 300, votes: 12, description: '신선한 초밥 전문점' },
  { id: '3', name: '파스타 맘마', category: '양식', distance: 500, votes: 3, description: '가성비 좋은 파스타' },
  { id: '4', name: '불타는 짬뽕', category: '중식', distance: 120, votes: 8, description: '매운맛 챌린지 가능' },
];

// 로컬 스토리지에서 데이터 로드 또는 초기화
const getDB = (): Restaurant[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initialRestaurants;
};

const setDB = (data: Restaurant[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- API Functions ---

export const api = {
  // 1. Auth (Login Mock)
  login: async (username: string): Promise<User> => {
    await delay(500); // Network delay simulation
    if (!username) throw new Error('Username required');
    return { id: 'u1', username, token: 'mock-jwt-token-12345' };
  },

  // 2. Get Restaurants (Geolocation Simulation included)
  getRestaurants: async (): Promise<Restaurant[]> => {
    await delay(600);
    return getDB().sort((a, b) => b.votes - a.votes); // 투표순 정렬
  },

  // 3. Create
  createRestaurant: async (data: Omit<Restaurant, 'id' | 'votes'>): Promise<Restaurant> => {
    await delay(400);
    const db = getDB();
    const newRest: Restaurant = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      votes: 0,
    };
    setDB([...db, newRest]);
    return newRest;
  },

  // Update
  updateRestaurant: async (id: string, data: Partial<Restaurant>): Promise<void> => {
    await delay(400);
    const db = getDB();
    setDB(db.map(r => r.id === id ? { ...r, ...data } : r));
  },

  // Delete
  deleteRestaurant: async (id: string): Promise<void> => {
    await delay(400);
    const db = getDB();
    setDB(db.filter(r => r.id !== id));
  },

  // 4. Vote
  vote: async (id: string): Promise<void> => {
    await delay(200);
    const db = getDB();
    setDB(db.map(r => r.id === id ? { ...r, votes: r.votes + 1 } : r));
  },
};