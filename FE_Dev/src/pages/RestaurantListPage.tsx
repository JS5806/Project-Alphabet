import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRestaurants, createRestaurant } from '../lib/api';
import { Link } from 'react-router-dom';
import { Plus, Utensils } from 'lucide-react';

export default function RestaurantListPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRest, setNewRest] = useState({ name: '', category: '', description: '' });

  // 식당 목록 조회 (Read)
  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: fetchRestaurants,
  });

  // 식당 등록 (Create)
  const mutation = useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      setIsModalOpen(false);
      setNewRest({ name: '', category: '', description: '' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRest.name) return;
    mutation.mutate(newRest);
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Utensils className="w-5 h-5 text-primary" />
          식당 관리
        </h2>
        <Link to="/vote" className="text-sm bg-secondary text-white px-3 py-1.5 rounded-md font-medium animate-pulse">
          실시간 투표 입장 &rarr;
        </Link>
      </header>

      <main className="p-4 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {restaurants?.map((rest) => (
            <div key={rest.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{rest.name}</h3>
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">{rest.category}</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">{rest.description || '설명 없음'}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Action Button for Create */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-20"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">새 식당 등록</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                placeholder="식당 이름"
                className="w-full border p-2 rounded"
                value={newRest.name}
                onChange={(e) => setNewRest({ ...newRest, name: e.target.value })}
              />
              <input
                placeholder="카테고리 (예: 한식)"
                className="w-full border p-2 rounded"
                value={newRest.category}
                onChange={(e) => setNewRest({ ...newRest, category: e.target.value })}
              />
              <input
                placeholder="간단 설명"
                className="w-full border p-2 rounded"
                value={newRest.description}
                onChange={(e) => setNewRest({ ...newRest, description: e.target.value })}
              />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-200 py-2 rounded">취소</button>
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded">등록</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}