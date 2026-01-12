import { create } from 'zustand';
import { User } from '../types';
import api from '../lib/axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: (token, user) => {
    localStorage.setItem('token', token);
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      // 실제 구현시 /auth/me 엔드포인트 호출
      const { data } = await api.get<User>('/auth/me');
      set({ user: data, isAuthenticated: true });
    } catch (e) {
      localStorage.removeItem('token');
      set({ token: null, user: null, isAuthenticated: false });
    }
  },
}));