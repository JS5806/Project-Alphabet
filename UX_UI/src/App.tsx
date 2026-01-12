import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GlobalStyle from './styles/GlobalStyle';
import Roulette from './components/Roulette';
import CategoryTabs from './components/CategoryTabs';
import Timer from './components/Timer';
import ConfirmModal from './components/ConfirmModal';
import { Category, Menu, MENU_DATA } from './types';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
`;

const Header = styled.header`
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #333;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: #888;
  margin-top: 5px;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #6B8DD6, #8E37D7);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 30px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(107, 141, 214, 0.4);
  transition: transform 0.1s;
  width: 80%;
  align-self: center;
  margin-top: 20px;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    box-shadow: none;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const WinnerDisplay = styled(motion.div)`
  margin: 20px;
  padding: 20px;
  background-color: #f8f0fc;
  border: 2px solid #8E37D7;
  border-radius: 12px;
  text-align: center;
  
  h2 {
    color: #8E37D7;
    margin-bottom: 5px;
  }
  p {
    font-size: 20px;
    font-weight: bold;
  }
`;

const ResetButton = styled.button`
  background: transparent;
  border: 1px solid #ccc;
  color: #888;
  padding: 8px 16px;
  border-radius: 20px;
  margin: 40px auto 0;
  display: block;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    border-color: #FF6B6B;
    color: #FF6B6B;
  }
`;

const App: React.FC = () => {
  // 상태 관리
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Menu | null>(null);
  const [deadline, setDeadline] = useState<number>(Date.now() + 10 * 60 * 1000); // 10분 타이머 (예제)
  const [isResetModalOpen, setResetModalOpen] = useState(false);

  // 카테고리 필터링 (useMemo로 불필요한 연산 방지)
  const filteredMenu = useMemo(() => {
    if (selectedCategory === 'All') return MENU_DATA;
    return MENU_DATA.filter((menu) => menu.category === selectedCategory);
  }, [selectedCategory]);

  // 스핀 시작 핸들러
  const handleStartSpin = () => {
    if (isSpinning || filteredMenu.length === 0) return;
    setWinner(null);
    setIsSpinning(true);
  };

  // 스핀 종료 핸들러
  const handleSpinEnd = (result: Menu) => {
    setIsSpinning(false);
    setWinner(result);
  };

  // 투표 리셋 핸들러
  const handleReset = () => {
    setResetModalOpen(false);
    setSelectedCategory('All');
    setWinner(null);
    setIsSpinning(false);
    setDeadline(Date.now() + 10 * 60 * 1000); // 타이머 리셋
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>점심 뭐 먹지?</Title>
          <SubTitle>결정장애를 위한 랜덤 메뉴 추천</SubTitle>
        </Header>

        {/* 타이머 컴포넌트 */}
        <Timer 
          deadline={deadline} 
          onExpire={() => alert('투표 시간이 종료되었습니다!')} 
        />

        {/* 카테고리 탭 */}
        <CategoryTabs 
          selectedCategory={selectedCategory} 
          onSelect={(cat) => {
            setSelectedCategory(cat);
            setWinner(null); // 카테고리 변경 시 결과 초기화
          }} 
        />

        {/* 룰렛 영역 */}
        <div style={{ pointerEvents: isSpinning ? 'none' : 'auto' }}> 
          <Roulette 
            items={filteredMenu} 
            isSpinning={isSpinning} 
            onSpinEnd={handleSpinEnd} 
          />
        </div>

        {/* 결과 표시 (Framer Motion) */}
        {winner && !isSpinning && (
          <WinnerDisplay
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2>🎉 오늘의 메뉴 추천 🎉</h2>
            <p>{winner.name}</p>
          </WinnerDisplay>
        )}

        {/* 실행 버튼 */}
        <ActionButton 
          onClick={handleStartSpin} 
          disabled={isSpinning || filteredMenu.length === 0}
        >
          {isSpinning ? '메뉴 고르는 중...' : '메뉴 돌리기 GO!'}
        </ActionButton>

        {/* 리셋 버튼 */}
        <ResetButton onClick={() => setResetModalOpen(true)}>
          투표 다시 시작하기
        </ResetButton>

        {/* 컨펌 모달 */}
        <ConfirmModal 
          isOpen={isResetModalOpen}
          onClose={() => setResetModalOpen(false)}
          onConfirm={handleReset}
          message="현재 진행 중인 투표와 타이머가 모두 초기화됩니다. 계속하시겠습니까?"
        />
      </Container>
    </>
  );
};

export default App;