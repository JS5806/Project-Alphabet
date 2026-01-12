import React from 'react';
import { useMenuStore } from '../store/menuStore';

export const HistoryList: React.FC = () => {
  const { history, clearHistory } = useMenuStore();

  if (history.length === 0) return null;

  return (
    <div className="mt-8 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          최근 제외된 기록 ({history.length})
        </h3>
        <button
          onClick={clearHistory}
          className="text-xs text-red-400 hover:text-red-600 underline"
        >
          전체 삭제
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {history.map((item, index) => (
          <div
            key={`${item.id}-${item.eatenAt}`}
            className={`flex justify-between items-center p-3 ${
              index !== history.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <span className="text-gray-700 font-medium">{item.name}</span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              {item.category}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-center text-gray-400 mt-2">
        ※ 최근 먹은 메뉴는 추천 후보에서 자동으로 제외됩니다.
      </p>
    </div>
  );
};