import React from 'react';
import { RecoilRoot } from 'recoil';
import CategoryFilter from './components/CategoryFilter';
import MenuList from './components/MenuList';
import RandomPicker from './components/RandomPicker';
import WebhookSettings from './components/WebhookSettings';

// Layout Component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Lunch Pick 🍱
        </h1>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          v1.0.0
        </span>
      </div>
    </header>
    <main className="max-w-5xl mx-auto px-4 py-8">
      {children}
    </main>
  </div>
);

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <Layout>
        <section className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">오늘 점심 뭐 먹지?</h2>
            <p className="text-gray-600">카테고리를 선택하거나 랜덤 추천을 받아보세요.</p>
          </div>

          {/* 1. 카테고리 필터링 영역 */}
          <CategoryFilter />

          {/* 2. 메뉴 리스트 영역 */}
          <MenuList />

          {/* 3. 메신저 연동 설정 영역 */}
          <WebhookSettings />

          {/* 4. 랜덤 메뉴 추천 FAB & Modal */}
          <RandomPicker />
        </section>
      </Layout>
    </RecoilRoot>
  );
};

export default App;