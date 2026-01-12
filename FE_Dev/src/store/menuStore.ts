import { create } from 'zustand';
import { Menu, Category, HistoryItem } from '../types/menu';
import { MENU_DATA } from '../data/mockData';

interface MenuState {
  // State
  selectedCategory: Category;
  selectedMenu: Menu | null;
  history: HistoryItem[];
  noCandidatesFound: boolean; // Empty State 감지용 플래그

  // Actions
  setCategory: (category: Category) => void;
  loadHistory: () => void;
  clearHistory: () => void;
  pickRandomMenu: () => void;
}

const STORAGE_KEY = 'lunch_history';

export const useMenuStore = create<MenuState>((set, get) => ({
  selectedCategory: '전체',
  selectedMenu: null,
  history: [],
  noCandidatesFound: false,

  setCategory: (category) => set({ selectedCategory: category, selectedMenu: null, noCandidatesFound: false }),

  loadHistory: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      set({ history: JSON.parse(stored) });
    }
  },

  clearHistory: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ history: [] });
  },

  pickRandomMenu: () => {
    const { selectedCategory, history } = get();

    // 1. 카테고리 필터링
    let candidates = MENU_DATA;
    if (selectedCategory !== '전체') {
      candidates = candidates.filter((menu) => menu.category === selectedCategory);
    }

    // 2. 최근 기록 제외 알고리즘 (History에 있는 ID는 후보에서 제외)
    // History는 최근 5개 정도만 유지한다고 가정하지만, 여기서는 저장된 전체 기록을 제외 조건으로 사용
    const recentMenuIds = new Set(history.map((item) => item.id));
    candidates = candidates.filter((menu) => !recentMenuIds.has(menu.id));

    // 3. Empty State 처리 (팀 코멘트 반영)
    if (candidates.length === 0) {
      set({ selectedMenu: null, noCandidatesFound: true });
      return;
    }

    // 4. 랜덤 추첨
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const picked = candidates[randomIndex];

    // 5. 결과 업데이트 및 히스토리 저장 (최대 5개 유지)
    const newHistoryItem: HistoryItem = { ...picked, eatenAt: Date.now() };
    const newHistory = [newHistoryItem, ...history].slice(0, 5); // 최근 5개만 유지

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));

    set({
      selectedMenu: picked,
      history: newHistory,
      noCandidatesFound: false,
    });
  },
}));