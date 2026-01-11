import { create } from 'zustand';

// 전역 UI 상태 관리 (예: Toast 알림 등)
// MVP에서는 복잡한 상태가 없으나 확장성을 위해 설정

interface UIState {
  isLoading: boolean;
  setLoading: (status: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  setLoading: (status) => set({ isLoading: status }),
}));