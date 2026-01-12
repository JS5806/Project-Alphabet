import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import { MENU_DATA } from './data';
import { Category, MenuItem } from './types';
import Roulette from './components/Roulette';
import CategoryFilter from './components/CategoryFilter';
import Timer from './components/Timer';

const AppContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const ResultBox = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  
  h3 {
    margin-bottom: 5px;
    color: #555;
  }
  
  p {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
  }
`;

const App: React.FC = () => {
  // 상태 관리
  const [currentCategory, setCurrentCategory] = useState<Category>('ALL');
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // 타이머 상태
  const TIMER_DURATION = 30; // 30초
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // 룰렛 초기화 트리거
  const [resetTrigger, setResetTrigger] = useState(false);

  // 카테고리 필터링 (useMemo로 성능 최적화)
  const filteredMenus = useMemo(() => {
    if (currentCategory === 'ALL') {
      return MENU_DATA;
    }
    return MENU_DATA.filter(menu => menu.category === currentCategory);
  }, [currentCategory]);

  // 카테고리 변경 핸들러 (투표 데이터 유지를 위해 필터만 변경)
  const handleCategoryChange = (category: Category) => {
    if (isSpinning) return; // 룰렛 동작 중 변경 방지
    setCurrentCategory(category);
    
    // 필터 변경 시 현재 선택된 결과는 유지하되, 
    // 새로운 룰렛 리스트에 대한 혼란을 줄이기 위해 선택 상태를 초기화할지 여부는 기획에 따름.
    // 여기서는 "기존 투표 데이터 유실 방지"라는 코멘트에 따라
    // 선택된 결과(selectedMenu)는 리셋하지 않고 뷰만 바꿉니다.
  };

  // 룰렛 회전 완료 핸들러
  const handleSpinComplete = (item: MenuItem) => {
    setSelectedMenu(item);
    startTimer();
  };

  // 타이머 시작
  const startTimer = () => {
    setTimeLeft(TIMER_DURATION);
    setIsTimerActive(true);
  };

  // 타이머 종료 및 초기화 (Time Up)
  const handleTimeUp = useCallback(() => {
    setIsTimerActive(false);
    setSelectedMenu(null);
    setResetTrigger(prev => !prev); // 룰렛 각도 초기화 신호 전송
    alert("투표 시간이 종료되어 상태가 초기화되었습니다.");
  }, []);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Title>오늘 뭐 먹지?</Title>

        <CategoryFilter 
          currentCategory={currentCategory} 
          onSelectCategory={handleCategoryChange} 
          disabled={isSpinning}
        />

        <Roulette 
          items={filteredMenus} 
          onSpinComplete={handleSpinComplete}
          isSpinning={isSpinning}
          setIsSpinning={setIsSpinning}
          resetTrigger={resetTrigger}
        />

        {selectedMenu && (
          <ResultBox>
            <h3>오늘의 추천 메뉴</h3>
            <p>{selectedMenu.name}</p>
          </ResultBox>
        )}

        <Timer 
          isActive={isTimerActive} 
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          onTimeUp={handleTimeUp}
        />
      </AppContainer>
    </>
  );
};

export default App;