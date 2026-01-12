import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// Socket 연결
const socket = io.connect("http://localhost:3001");

function App() {
  const [user, setUser] = useState(null);

  // 로컬 스토리지에서 유저 정보 확인 (간편 로그인 유지)
  useEffect(() => {
    const storedUser = localStorage.getItem('vote_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userInfo) => {
    localStorage.setItem('vote_user', JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem('vote_user');
    setUser(null);
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl relative overflow-hidden">
        {user ? (
          <Dashboard socket={socket} user={user} onLogout={handleLogout} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
}

export default App;