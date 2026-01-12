import axios from 'axios';
import { Restaurant } from '../types';

// 실제 백엔드 연동 시 baseURL 변경 필요
const API_BASE_URL = 'http://localhost:4000/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Mock Data for MVP (백엔드 없이 UI 테스트 가능하도록 더미 데이터 반환 로직 포함)
let MOCK_RESTAURANTS: Restaurant[] = [
  { id: '1', name: '김밥천국', category: '한식', description: '가성비 좋은 분식' },
  { id: '2', name: '스시마이우', category: '일식', description: '회전초밥 맛집' },
  { id: '3', name: '맥도날드', category: '패스트푸드', description: '빠른 점심 해결' },
];

export const fetchRestaurants = async (): Promise<Restaurant[]> => {
  // 실제 API 호출: return (await api.get('/restaurants')).data;
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_RESTAURANTS), 500));
};

export const createRestaurant = async (newRest: Omit<Restaurant, 'id'>): Promise<Restaurant> => {
  // 실제 API 호출: return (await api.post('/restaurants', newRest)).data;
  const created = { ...newRest, id: Math.random().toString(36).substr(2, 9) };
  MOCK_RESTAURANTS.push(created);
  return new Promise((resolve) => setTimeout(() => resolve(created), 500));
};