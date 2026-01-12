import React, { useEffect, useState } from 'react';
import { useRestaurantStore } from '../../store/useRestaurantStore';
import { useAuthStore } from '../../store/useAuthStore';
import AddRestaurantModal from '../Restaurant/AddRestaurantModal';

const RealtimeDashboard: React.FC = () => {
  const { restaurants, fetchRestaurants, vote, handleSocketEvents, cleanupSocketEvents } = useRestaurantStore();
  const { logout, user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 1. 초기 데이터 로드
    fetchRestaurants();
    // 2. 소켓 리스너 등록 (실시간 업데이트)
    handleSocketEvents();

    // 3. 클린업
    return () => {
      cleanupSocketEvents();
    };
  }, []);

  // 투표수가 많은 순으로 정렬
  const sortedRestaurants = [...restaurants].sort((a, b) => b.votes - a.votes);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold text-gray-800">🍽️ Lunch Voting System</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Hello, <b>{user?.username || 'User'}</b></span>
          <button 
            onClick={logout}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Real-time Status</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow transition"
          >
            + Add Restaurant
          </button>
        </div>

        <div className="grid gap-4">
          {sortedRestaurants.map((restaurant) => (
            <div 
              key={restaurant.id} 
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center transition hover:shadow-md"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-800">{restaurant.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {restaurant.votes} Votes
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">{restaurant.description}</p>
                
                {/* 시각적 게이지 바 */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 max-w-xs">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${Math.min(restaurant.votes * 10, 100)}%` }} // 임시 스케일링
                  ></div>
                </div>
              </div>

              <button
                onClick={() => vote(restaurant.id)}
                className="ml-4 bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded hover:bg-blue-100 font-medium transition active:scale-95"
              >
                Vote
              </button>
            </div>
          ))}

          {restaurants.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No restaurants yet. Be the first to add one!
            </div>
          )}
        </div>
      </main>

      <AddRestaurantModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default RealtimeDashboard;