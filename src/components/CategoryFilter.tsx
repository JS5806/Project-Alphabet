import React from 'react';
import { useRecoilState } from 'recoil';
import { categoryFilterState } from '../store/atoms';
import { Category } from '../types';

const categories: { label: string; value: Category }[] = [
  { label: '전체', value: 'ALL' },
  { label: '한식', value: 'KOREAN' },
  { label: '중식', value: 'CHINESE' },
  { label: '일식', value: 'JAPANESE' },
  { label: '양식', value: 'WESTERN' },
];

const CategoryFilter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useRecoilState(categoryFilterState);

  return (
    <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white rounded-lg shadow-sm">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setSelectedCategory(cat.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
            ${
              selectedCategory === cat.value
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;