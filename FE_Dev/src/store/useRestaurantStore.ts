import { create } from 'zustand';
import { Restaurant } from '../types';
import api from '../lib/axios';
import { socket } from '../lib/socket';

interface RestaurantState {
  restaurants: Restaurant[];
  loading: boolean;
  fetchRestaurants: () => Promise<void>;
  addRestaurant: (name: string, description: string) => Promise<void>;
  vote: (restaurantId: string) => Promise<void>;
  
  // 소켓 이벤트 핸들러
  handleSocketEvents: () => void;
  cleanupSocketEvents: () => void;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurants: [],
  loading: false,

  fetchRestaurants: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get<Restaurant[]>('/restaurants');
      set({ restaurants: data });
    } catch (error) {
      console.error('Failed to fetch', error);
    } finally {
      set({ loading: false });
    }
  },

  addRestaurant: async (name, description) => {
    // Optimistic UI 미적용: 서버 응답 및 소켓 브로드캐스트 대기
    await api.post('/restaurants', { name, description });
  },

  vote: async (restaurantId) => {
    // 투표 로직: 서버로 요청 -> 서버가 소켓으로 전체 클라이언트에 최신 상태 전송
    await api.post(`/restaurants/${restaurantId}/vote`);
  },

  handleSocketEvents: () => {
    if (!socket.connected) socket.connect();

    socket.on('restaurant_added', (newRestaurant) => {
      set((state) => ({
        restaurants: [...state.restaurants, newRestaurant],
      }));
    });

    socket.on('vote_updated', (updatedRestaurants) => {
      // 서버가 보내준 최신 리스트로 전체 교체 (Single Source of Truth)
      set({ restaurants: updatedRestaurants });
    });
  },

  cleanupSocketEvents: () => {
    socket.off('restaurant_added');
    socket.off('vote_updated');
    socket.disconnect();
  },
}));