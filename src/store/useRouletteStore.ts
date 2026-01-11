import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MenuItem, RouletteState } from '../types';

// 기본 메뉴 데이터
const DEFAULT_MENUS: MenuItem[] = [
  { id: '1', name: '김치찌개', color: '#FF6B6B' },
  { id: '2', name: '돈까스', color: '#4ECDC4' },
  { id: '3', name: '초밥', color: '#45B7D1' },
  { id: '4', name: '삼겹살', color: '#96CEB4' },
  { id: '5', name: '햄버거', color: '#FFEEAD' },
  { id: '6', name: '파스타', color: '#D4A5A5' },
  { id: '7', name: '떡볶이', color: '#FF9F1C' },
  { id: '8', name: '샐러드', color: '#2EC4B6' },
];

const FILTER_PERIOD_MS = 3 * 24 * 60 * 60 * 1000; // 3일

export const useRouletteStore = create<RouletteState>()(
  persist(
    (set, get) => ({
      menus: DEFAULT_MENUS,
      history: [],
      filteredMenus: DEFAULT_MENUS,
      isSpinning: false,
      winner: null,

      setSpinning: (isSpinning) => set({ isSpinning }),

      setWinner: (winner) => {
        set((state) => ({
          winner,
          history: [...state.history, { menuId: winner.id, timestamp: Date.now() }],
          isSpinning: false,
        }));
      },

      initializeCandidates: () => {
        const { menus, history } = get();
        const now = Date.now();

        // 3일 이내 먹은 메뉴 ID 추출
        const recentHistoryIds = history
          .filter((item) => now - item.timestamp < FILTER_PERIOD_MS)
          .map((item) => item.menuId);

        // 최근 기록에 없는 메뉴만 필터링
        let candidates = menus.filter((menu) => !recentHistoryIds.includes(menu.id));

        // 예외 처리: 만약 모든 메뉴를 다 먹어서 후보가 없다면 전체 메뉴 리셋
        if (candidates.length === 0) {
          candidates = menus;
        }

        set({ filteredMenus: candidates, winner: null });
      },

      resetHistory: () => set({ history: [], filteredMenus: DEFAULT_MENUS }),
    }),
    {
      name: 'lunch-roulette-storage', // LocalStorage Key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ history: state.history }), // history만 저장
    }
  )
);