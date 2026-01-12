import React, { useEffect } from 'react';
import { CategoryFilter } from './components/CategoryFilter';
import { ResultDisplay } from './components/ResultDisplay';
import { HistoryList } from './components/HistoryList';
import { useMenuStore } from './store/menuStore';

const App: React.FC = () => {
  const loadHistory = useMenuStore((state) => state.loadHistory);

  // 컴포넌트 마운트 시 로컬스토리지 데이터 로드
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            오늘 뭐 먹지? 🥄
          </h1>
          <p className="text-gray-500">
            결정장애 탈출! 카테고리만 고르세요.
          </p>
        </header>

        {/* Main Content */}
        <main>
          <CategoryFilter />
          <ResultDisplay />
          <HistoryList />
        </main>
        
        {/* Footer */}
        <footer className="mt-16 text-center text-gray-400 text-sm">
          &copy; 2023 Random Lunch Selector. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default App;