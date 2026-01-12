import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import Button from './ui/Button';

const Layout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            VoteApp
          </Link>
          
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/" className="text-gray-600 hover:text-primary">투표 목록</Link>
                <Link to="/create" className="text-gray-600 hover:text-primary">투표 만들기</Link>
                <span className="text-sm font-medium text-gray-800 px-2">
                  {user?.username}님
                </span>
                <Button variant="secondary" onClick={handleLogout} className="text-sm py-1">
                  로그아웃
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="primary">로그인</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;