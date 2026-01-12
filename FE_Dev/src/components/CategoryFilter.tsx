import React from 'react';
import { useMenuStore } from '../store/menuStore';
import { Category } from '../types/menu';

const categories: Category[] = ['전체', '한식', '중식', '일식', '양식', '분식'];

export const CategoryFilter: React.FC = () => {
  const { selectedCategory, setCategory } = useMenuStore();

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors
            ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};