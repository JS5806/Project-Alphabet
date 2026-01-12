import React, { useState, useEffect } from 'react';
import { IoAdd, IoLogOutOutline } from 'react-icons/io5';
import RestaurantCard from './RestaurantCard';
import LiveChart from './LiveChart';
import AddModal from './AddModal';

const Dashboard = ({ socket, user, onLogout }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myVote, setMyVote] = useState(null); // 로컬 상태에서 내가 투표한 항목 관리

  useEffect(() => {
    // 1. 초기 데이터 수신
    socket.on('init_data', (data) => {
      setRestaurants(data);
    });

    // 2. 실시간 데이터 업데이트 수신
    socket.on('update_data', (data) => {
      setRestaurants(data);
    });

    return () => {
      socket.off('init_data');
      socket.off('update_data');
    };
  }, [socket]);

  // Optimistic UI 적용: 서버 응답을 기다리지 않고 로컬 UI를 먼저 업데이트
  const handleVote = (id) => {
    if (myVote === id) return; // 이미 투표한 것 클릭 시 무시 (또는 토글)
    
    setMyVote(id);
    
    // 로컬 상태 즉시 반영 (UX 향상)
    setRestaurants(prev => 
      prev.map(r => r.id === id ? { ...r, votes: r.votes + 1 } : r)
    );

    // 소켓 전송
    socket.emit('vote', id);
  };

  const handleAddRestaurant = (data) => {
    socket.emit('add_restaurant', data);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="px-6 py-5 bg-white shadow-sm z-10 flex justify-between items-center sticky top-0">
        <div>
          <h2 className="text-xl font-bold text-gray-800">점심 투표</h2>
          <p className="text-xs text-gray-500">안녕하세요, {user.name}님!</p>
        </div>
        <button onClick={onLogout} className="text-gray-400 hover:text-red-500 transition-colors">
          <IoLogOutOutline className="text-2xl" />
        </button>
      </header>

      {/* Main Content (Scrollable) */}
      <main className="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
        {/* 실시간 대시보드 */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-3">
            <h3 className="font-bold text-gray-700">실시간 현황</h3>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full animate-pulse">Live</span>
          </div>
          <LiveChart data={restaurants} />
        </section>

        {/* 투표 리스트 */}
        <section>
          <h3 className="font-bold text-gray-700 mb-3">후보 식당</h3>
          <div className="grid grid-cols-1 gap-4">
            {restaurants.map((res) => (
              <RestaurantCard 
                key={res.id} 
                data={res} 
                isActive={myVote === res.id}
                onVote={() => handleVote(res.id)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* FAB (Floating Action Button) */}
      <div className="absolute bottom-6 right-6">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 bg-indigo-600 rounded-full shadow-lg shadow-indigo-300 flex items-center justify-center text-white text-2xl hover:bg-indigo-700 hover:scale-105 transition-all duration-300"
        >
          <IoAdd />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddModal onClose={() => setIsModalOpen(false)} onSubmit={handleAddRestaurant} />
      )}
    </div>
  );
};

export default Dashboard;