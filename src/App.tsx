import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import MenuAdminPage from './pages/MenuAdminPage';
import VotePage from './pages/VotePage';
import DashboardPage from './pages/DashboardPage';

const queryClient = new QueryClient();

// 인증 보호 라우트 컴포넌트
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex gap-6">
          <Link to="/" className="font-bold hover:text-gray-300">투표하기</Link>
          <Link to="/dashboard" className="hover:text-gray-300">결과보기</Link>
          <Link to="/admin" className="hover:text-gray-300">메뉴관리</Link>
        </div>
        <div className="flex items-center gap-4">
          <span>{user.name}님</span>
          <button onClick={logout} className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700">
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  );
};

const AppContent: React.FC = () => {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <VotePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <MenuAdminPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;