import React, { useState, useEffect } from 'react';
import { Restaurant } from '../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Restaurant;
}

export const RestaurantModal = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '한식',
    distance: 0,
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        distance: initialData.distance,
        description: initialData.description,
      });
    } else {
      setFormData({ name: '', category: '한식', distance: 0, description: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? '식당 정보 수정' : '새 식당 추가'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">이름</label>
            <input
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">카테고리</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option>한식</option>
              <option>중식</option>
              <option>일식</option>
              <option>양식</option>
              <option>분식</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">거리 (m)</label>
            <input
              type="number"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">설명</label>
            <textarea
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};