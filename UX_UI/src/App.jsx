import React, { useState, useEffect, useMemo } from 'react';
import { socket } from './lib/mockSocket';
import Auth from './components/Auth';
import RestaurantCard from './components/RestaurantCard';
import Modal from './components/Modal';

// 초기 더미 데이터
const INITIAL_DATA = [
  { id: 1, name: '김가네 김치찌개', type: '한식', description: '얼큰한 국물이 일품인 정통 김치찌개', votes: 5 },
  { id: 2, name: '드래곤 중화요리', type: '중식', description: '불맛 가득한 짬뽕과 바삭한 탕수육', votes: 3 },
  { id: 3, name: '스시 마스터', type: '일식', description: '신선한 재료로 만드는 프리미엄 초밥', votes: 8 },
];

export default function App() {
  const [user, setUser] = useState(null); // 로그인 사용자 상태
  const [restaurants, setRestaurants] = useState(INITIAL_DATA);
  const [votedId, setVotedId] = useState(null); // 사용자가 투표한 식당 ID
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // [UX Goal 4] 결과 집계 대시보드 계산 로직
  const totalVotes = useMemo(() => restaurants.reduce((acc, cur) => acc + cur.votes, 0), [restaurants]);
  const topRestaurantId = useMemo(() => {
    if (restaurants.length === 0) return null;
    return restaurants.reduce((prev, current) => (prev.votes > current.votes) ? prev : current).id;
  }, [restaurants]);

  // Socket Listener 설정
  useEffect(() => {
    socket.on('update-votes', ({ id, count }) => {
      setRestaurants(prev => prev.map(r => r.id === id ? { ...r, votes: r.votes + 1 } : r));
    });

    socket.on('restaurant-added', (newRestaurant) => {
      setRestaurants(prev => [...prev, newRestaurant]);
    });

    socket.on('restaurant-deleted', (id) => {
      setRestaurants(prev => prev.filter(r => r.id !== id));
      if (votedId === id) setVotedId(null);
    });
  }, [votedId]);

  // Actions
  const handleLogin = (username) => {
    setUser(username);
  };

  const handleVote = (id) => {
    if (votedId === id) return; // 이미 투표함
    // Optimistic Update: 즉시 UI 반영 (실제 앱에서는 서버 응답 대기 로직 추가 고려)
    setVotedId(id);
    socket.emit('vote', { id });
  };

  const handleAddRestaurant = (data) => {
    socket.emit('add-restaurant', data);
  };

  const handleDeleteRestaurant = (id) => {
      if(window.confirm('정말 삭제하시겠습니까?')) {
        socket.emit('delete-restaurant', id);
      }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-extrabold text-indigo-600 tracking-tight">🍱 점심 뭐 먹지?</h1>
          <div className="flex items-center gap-2">
             <span className="text-sm text-slate-500 hidden sm:inline">안녕하세요, </span>
             <span className="text-sm font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md">{user}님</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-4">
        {/* [UX Goal 4] Dashboard: 실시간 집계 현황 */}
        <section className="mb-8 rounded-2xl bg-indigo-900 p-6 text-white shadow-xl">
            <h2 className="mb-4 text-lg font-bold flex items-center">
                📊 실시간 투표 현황
                <span className="ml-2 text-xs font-normal bg-indigo-800 px-2 py-0.5 rounded-full text-indigo-200">Live</span>
            </h2>
            <div className="space-y-3">
                {restaurants.sort((a,b) => b.votes - a.votes).slice(0, 3).map((r) => {
                    const percentage = totalVotes === 0 ? 0 : Math.round((r.votes / totalVotes) * 100);
                    const isTop = r.id === topRestaurantId;
                    return (
                        <div key={r.id} className="group">
                            <div className="flex justify-between text-sm mb-1">
                                <span className={`font-medium ${isTop ? 'text-yellow-300' : 'text-indigo-100'}`}>
                                    {isTop && '👑 '}{r.name}
                                </span>
                                <span className="text-indigo-200">{percentage}% ({r.votes}표)</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-indigo-800 overflow-hidden">
                                <div 
                                    className={`h-full rounded-full progress-bar-transition ${isTop ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-indigo-400'}`} 
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>

        {/* Action Bar */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">후보 식당 목록</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-700 shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            식당 추가
          </button>
        </div>

        {/* Restaurant List Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((data) => (
            <RestaurantCard
              key={data.id}
              data={data}
              isVoted={votedId === data.id}
              onVote={handleVote}
              onDelete={handleDeleteRestaurant}
            />
          ))}
        </div>
      </main>

      {/* Modals */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddRestaurant}
      />
    </div>
  );
}