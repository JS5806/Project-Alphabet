import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';
import { Restaurant } from '../types';

// Mock Data Fetcher
const fetchRestaurants = async (): Promise<Restaurant[]> => {
  // const { data } = await apiClient.get('/restaurants');
  // return data;
  
  // Mocking return
  return [
    { id: '1', name: '김밥천국', category: '한식', description: '가성비 최고', votes: 10 },
    { id: '2', name: '스시마루', category: '일식', description: '신선한 초밥', votes: 5 },
  ];
};

export const RestaurantManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: restaurants, isLoading } = useQuery(['restaurants'], fetchRestaurants);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', description: '' });

  // Mutation: Add Restaurant
  const addMutation = useMutation(
    (newRes: Omit<Restaurant, 'id' | 'votes'>) => apiClient.post('/restaurants', newRes),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['restaurants']);
        setIsModalOpen(false);
        setFormData({ name: '', category: '', description: '' });
      },
    }
  );

  // Mutation: Delete Restaurant
  const deleteMutation = useMutation(
    (id: string) => apiClient.delete(`/restaurants/${id}`),
    {
      onSuccess: () => queryClient.invalidateQueries(['restaurants']),
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, calling mutation.mutate(formData);
    console.log('Adding:', formData);
    // Mocking optimistic update or success logic
    setIsModalOpen(false);
    alert('식당 등록 API 호출됨 (Mock)');
  };

  if (isLoading) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">식당 관리</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
        >
          + 식당 추가
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants?.map((res) => (
          <div key={res.id} className="bg-white rounded-lg shadow p-5 border border-gray-200">
            <h3 className="text-xl font-bold mb-2">{res.name}</h3>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mb-2">
              {res.category}
            </span>
            <p className="text-gray-600 mb-4">{res.description}</p>
            <div className="flex justify-end gap-2">
              <button className="text-blue-500 hover:text-blue-700 font-medium">수정</button>
              <button 
                onClick={() => deleteMutation.mutate(res.id)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Modal Implementation (Headless UI Concept) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">새 식당 등록</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="식당 이름"
                className="w-full border p-2 rounded"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                placeholder="카테고리"
                className="w-full border p-2 rounded"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
              <textarea
                placeholder="설명"
                className="w-full border p-2 rounded"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};