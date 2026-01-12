import React, { useState, useEffect, useMemo } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './index.css';

// 차트 라이브러리 (결과 대시보드용)
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const API_URL = 'http://localhost:5000';
const SOCKET_URL = 'http://localhost:5000';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  
  // 로그인 성공 핸들러
  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <div className="app-container">
      {!token ? (
        <AuthScreen onLogin={handleLogin} />
      ) : (
        <MainDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

// 1. 인증 컴포넌트 (로그인/회원가입 토글)
function AuthScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/api/login`, {
          email: formData.email,
          password: formData.password
        });
        onLogin(res.data.token, { name: res.data.name, id: res.data.userId });
      } else {
        await axios.post(`${API_URL}/api/register`, formData);
        alert('가입 완료! 로그인해주세요.');
        setIsLogin(true);
      }
    } catch (err) {
      alert('오류가 발생했습니다. 입력을 확인해주세요.');
    }
  };

  return (
    <div className="auth-wrapper">
      <h1 style={{ textAlign: 'center', marginBottom: 40, color: 'var(--primary)' }}>
        오늘 점심<br/>뭐 먹지?
      </h1>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            className="input-field"
            placeholder="이름 (닉네임)"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
        )}
        <input
          className="input-field"
          type="email"
          placeholder="이메일"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          className="input-field"
          type="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})}
          required
        />
        <button className="btn btn-primary" type="submit">
          {isLogin ? '로그인' : '회원가입'}
        </button>
      </form>
      <p 
        style={{textAlign: 'center', marginTop: 20, color: '#888', cursor: 'pointer'}}
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
      </p>
    </div>
  );
}

// 2. 메인 대시보드 (투표 및 리스트)
function MainDashboard({ user, onLogout }) {
  const [socket, setSocket] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Socket 연결 설정
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    
    // 실시간 데이터 수신
    newSocket.on('update_data', (data) => {
      setRestaurants(data);
    });

    return () => newSocket.close();
  }, []);

  const handleVote = (restaurantId) => {
    if (!socket) return;
    // UX: 클릭 시 즉각적인 피드백을 주지만, 실제 데이터는 소켓 브로드캐스트를 기다림 (신뢰성)
    socket.emit('vote', { restaurantId, userId: user.id });
  };

  const handleAddRestaurant = async (name, desc) => {
    try {
      await axios.post(`${API_URL}/api/restaurants`, { name, description: desc });
      setShowAddModal(false);
    } catch (err) {
      alert('등록 실패');
    }
  };

  // 1등 식당 계산
  const topRestaurantId = useMemo(() => {
    if (restaurants.length === 0) return null;
    const maxVotes = Math.max(...restaurants.map(r => r.votes));
    if (maxVotes === 0) return null;
    return restaurants.find(r => r.votes === maxVotes)?._id;
  }, [restaurants]);

  return (
    <div>
      {/* Header: 네트워크 상태 시각화 */}
      <header className="header">
        <div>
          <span style={{ fontWeight: 'bold' }}>Hello, {user.name}</span>
          <div style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span className={`status-indicator ${isConnected ? 'status-connected' : 'status-disconnected'}`}></span>
            {isConnected ? 'Live Sync' : 'Connecting...'}
          </div>
        </div>
        <button 
          onClick={onLogout} 
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
        >
          Logout
        </button>
      </header>

      {/* 실시간 결과 대시보드 (그래프) */}
      <div style={{ height: '200px', padding: '20px', background: '#fff', marginBottom: '10px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>실시간 득표 현황</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={restaurants}>
            <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} />
            <Tooltip />
            <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
              {restaurants.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry._id === topRestaurantId ? '#FF6B6B' : '#4ECDC4'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 식당 리스트 */}
      <div className="section-title">투표 후보 ({restaurants.length})</div>
      <div className="card-list">
        {restaurants.map(r => {
          const isVoted = r.voters.includes(user.id);
          const isWinner = r._id === topRestaurantId;
          
          return (
            <div key={r._id} className={`restaurant-card ${isWinner ? 'winner-card' : ''}`}>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>{r.name} {isWinner && '👑'}</h3>
                <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>{r.description || '설명 없음'}</p>
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--primary)', fontWeight: 'bold' }}>
                  {r.votes}표
                </div>
              </div>
              <button 
                className={`vote-btn ${isVoted ? 'voted' : ''}`}
                onClick={() => handleVote(r._id)}
              >
                {isVoted ? '♥' : '♡'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button (Add) */}
      <div className="fab" onClick={() => setShowAddModal(true)}>+</div>

      {/* Add Modal */}
      {showAddModal && <AddModal onClose={() => setShowAddModal(false)} onAdd={handleAddRestaurant} />}
    </div>
  );
}

function AddModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(name.trim()) onAdd(name, desc);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>새 식당 등록</h3>
        <form onSubmit={handleSubmit}>
          <input 
            className="input-field" 
            placeholder="식당 이름" 
            value={name} 
            onChange={e => setName(e.target.value)}
            autoFocus 
          />
          <input 
            className="input-field" 
            placeholder="간단 설명 (예: 김치찌개 맛집)" 
            value={desc} 
            onChange={e => setDesc(e.target.value)} 
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn" style={{ background: '#eee' }} onClick={onClose}>취소</button>
            <button type="submit" className="btn btn-primary">등록</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;