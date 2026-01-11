import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { menuListState, categoryFilterState } from '../store/atoms';
import { Menu } from '../types';

// 모달 컴포넌트 내부 정의 (간소화)
const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative transform transition-all scale-100">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
      {children}
    </div>
  </div>
);

const RandomPicker: React.FC = () => {
  const menus = useRecoilValue(menuListState);
  const filter = useRecoilValue(categoryFilterState);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [result, setResult] = useState<Menu | null>(null);
  const [displayMenu, setDisplayMenu] = useState<string>('???');
  
  // 애니메이션을 위한 Interval Ref
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // [Team Comment 반영] 클라이언트 측 로직 적용
  // 현재 필터링된 리스트 내에서 추천할지, 전체에서 할지 결정 (여기서는 현재 필터 기준)
  const targetMenus = filter === 'ALL' 
    ? menus 
    : menus.filter(m => m.category === filter);

  const startRoulette = () => {
    if (targetMenus.length === 0) {
      alert('추천할 메뉴가 없습니다!');
      return;
    }

    setIsOpen(true);
    setIsAnimating(true);
    setResult(null);

    // 룰렛 애니메이션 효과 (빠르게 이름 변경)
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * targetMenus.length);
      setDisplayMenu(targetMenus[randomIndex].name);
    }, 80);

    // 2초 후 멈춤
    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const finalIndex = Math.floor(Math.random() * targetMenus.length);
      const finalMenu = targetMenus[finalIndex];
      setResult(finalMenu);
      setDisplayMenu(finalMenu.name);
      setIsAnimating(false);
    }, 2000);
  };

  const handleRetry = () => {
    startRoulette();
  };

  const handleClose = () => {
    setIsOpen(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={startRoulette}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 px-6 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
        >
          <span>🎲 오늘 뭐 먹지?</span>
        </button>
      </div>

      {isOpen && (
        <Modal onClose={handleClose}>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-700 mb-6">
              {isAnimating ? '메뉴 고르는 중...' : '오늘의 추천 메뉴!'}
            </h2>
            
            <div className="h-32 flex items-center justify-center mb-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <span className={`text-3xl font-extrabold ${isAnimating ? 'text-gray-400' : 'text-indigo-600 animate-bounce'}`}>
                {displayMenu}
              </span>
            </div>

            {!isAnimating && result && (
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                >
                  다시 추천받기
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                >
                  결정하기
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default RandomPicker;