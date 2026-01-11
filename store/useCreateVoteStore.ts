import { create } from 'zustand';
import { Restaurant } from '@/lib/mock-db';

interface CreateVoteState {
  selectedRestaurants: Restaurant[];
  toggleRestaurant: (restaurant: Restaurant) => void;
  clearSelection: () => void;
}

// 투표 생성 시 후보 식당을 담는 장바구니 상태
export const useCreateVoteStore = create<CreateVoteState>((set) => ({
  selectedRestaurants: [],
  toggleRestaurant: (restaurant) =>
    set((state) => {
      const exists = state.selectedRestaurants.find((r) => r.id === restaurant.id);
      if (exists) {
        return { selectedRestaurants: state.selectedRestaurants.filter((r) => r.id !== restaurant.id) };
      }
      return { selectedRestaurants: [...state.selectedRestaurants, restaurant] };
    }),
  clearSelection: () => set({ selectedRestaurants: [] }),
}));