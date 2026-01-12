import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { socket } from '../lib/socket';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // 모의 OAuth 로그인 로직
  const login = () => {
    // 실제로는 window.location.href = '/oauth/authorize...' 로 이동
    const mockUser: User = {
      id: 'emp_12345',
      name: '김개발',
      avatarUrl: 'https://via.placeholder.com/150',
      token: 'mock_oauth_token_xyz',
    };
    setUser(mockUser);
    localStorage.setItem('auth_token', mockUser.token);
    
    // 로그인 성공 시 소켓 연결
    socket.auth = { token: mockUser.token };
    socket.connect();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    socket.disconnect();
  };

  useEffect(() => {
    // 앱 초기화 시 토큰 확인 로직 (간소화)
    const token = localStorage.getItem('auth_token');
    if (token && !user) {
        // 토큰 유효성 검사 API 호출 필요
        login(); 
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};