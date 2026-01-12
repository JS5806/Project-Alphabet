import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">LunchVote 🍽️</Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-gray-300">Hello, {user.username}</span>
              <Link to="/restaurants" className="hover:text-blue-300">관리</Link>
              <Link to="/vote" className="hover:text-green-300">투표</Link>
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};