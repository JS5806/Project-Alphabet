import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

// Socket Initialize
const socket = io('http://localhost:5000');

function App() {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [view, setView] = useState('login'); // login, list

  // Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // New Restaurant State
  const [newRestName, setNewRestName] = useState('');
  const [newRestDesc, setNewRestDesc] = useState('');

  useEffect(() => {
    // Listen for Real-time updates
    socket.on('update-list', (data) => {
      setRestaurants(data);
    });

    return () => socket.off('update-list');
  }, []);

  const handleLogin = async () => {
    // Simple fetch simulation
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      setView('list');
      socket.emit('request-list'); // Load initial list
    } else {
      alert(data.message);
    }
  };

  const handleRegister = async () => {
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username: email.split('@')[0] })
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      setView('list');
      socket.emit('request-list');
    }
  };

  const handleAddRestaurant = async () => {
    if (!newRestName) return;
    await fetch('http://localhost:5000/api/restaurants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newRestName, description: newRestDesc })
    });
    setNewRestName('');
    setNewRestDesc('');
  };

  const handleVote = async (id) => {
    await fetch(`http://localhost:5000/api/vote/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    });
    // No manual state update needed, Socket will handle it
  };

  const handleDelete = async (id) => {
    if(window.confirm('삭제하시겠습니까?')) {
      await fetch(`http://localhost:5000/api/restaurants/${id}`, { method: 'DELETE' });
    }
  };

  // UI Components
  if (view === 'login') {
    return (
      <div className="container">
        <div className="auth-box">
          <h2 style={{ marginBottom: '0.5rem' }}>오늘 점심 어디갈까요?</h2>
          <p style={{ color: '#6B7280', marginBottom: '2rem' }}>팀원들과 함께 결정해보세요.</p>
          
          <input 
            className="input-field" 
            placeholder="이메일" 
            value={email} onChange={e => setEmail(e.target.value)} 
          />
          <input 
            className="input-field" 
            type="password" 
            placeholder="비밀번호" 
            value={password} onChange={e => setPassword(e.target.value)} 
          />
          
          <button className="btn btn-primary" onClick={handleLogin}>로그인</button>
          <button 
            className="btn" 
            style={{ marginTop: '10px', background: 'transparent', color: 'var(--primary)' }} 
            onClick={handleRegister}
          >
            회원가입
          </button>

          <div className="social-login">
            <span className="social-btn">G Google</span>
            <span className="social-btn">K Kakao</span>
          </div>
        </div>
      </div>
    );
  }

  // Find max votes to highlight leader
  const maxVotes = Math.max(...restaurants.map(r => r.votes), 0);

  return (
    <div className="container">
      <div className="header">
        <div>
          <h2 style={{ margin: 0 }}>🍽️ 점심 투표</h2>
          <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Hello, {user.username}</span>
        </div>
        <button 
          className="btn" 
          style={{ background: '#E5E7EB', padding: '6px 12px', fontSize: '0.8rem' }}
          onClick={() => { setUser(null); setView('login'); }}
        >
          로그아웃
        </button>
      </div>

      <div className="add-form">
        <h4 style={{ margin: '0 0 10px 0' }}>새로운 식당 추천</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            className="input-field" 
            style={{ margin: 0, flex: 2 }}
            placeholder="식당 이름" 
            value={newRestName} 
            onChange={e => setNewRestName(e.target.value)} 
          />
          <input 
            className="input-field" 
            style={{ margin: 0, flex: 3 }}
            placeholder="간단 설명 (예: 김치찌개 맛집)" 
            value={newRestDesc} 
            onChange={e => setNewRestDesc(e.target.value)} 
          />
          <button 
            className="btn btn-primary" 
            style={{ margin: 0, width: 'auto', flex: 1 }}
            onClick={handleAddRestaurant}
          >
            등록
          </button>
        </div>
      </div>

      <div className="card-list">
        {restaurants.map(rest => {
          const isVoted = rest.votedBy.includes(user.id);
          const isLeading = rest.votes > 0 && rest.votes === maxVotes;

          return (
            <div key={rest._id} className={`card ${isLeading ? 'leading' : ''}`}>
              {isLeading && <div className="leading-badge">🔥 현재 1위</div>}
              
              <div className="card-info">
                <h3>{rest.name}</h3>
                <p>{rest.description}</p>
                <div style={{ marginTop: '8px' }}>
                  <button 
                    onClick={() => handleDelete(rest._id)}
                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0, fontSize: '0.8rem' }}
                  >
                    삭제
                  </button>
                </div>
              </div>

              <button 
                className={`btn btn-vote ${isVoted ? 'active' : ''}`}
                onClick={() => handleVote(rest._id)}
              >
                <span className="vote-count">{rest.votes}</span>
                <span className="vote-label">{isVoted ? 'Voted' : 'Vote'}</span>
              </button>
            </div>
          );
        })}
        {restaurants.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '20px' }}>
            등록된 식당이 없습니다.<br/>첫 번째 식당을 추천해보세요!
          </div>
        )}
      </div>
    </div>
  );
}

export default App;