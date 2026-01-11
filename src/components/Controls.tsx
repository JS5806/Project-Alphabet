import React from 'react';
import styled from 'styled-components';
import { useRouletteStore } from '../store/useRouletteStore';
import { motion, AnimatePresence } from 'framer-motion';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  gap: 15px;
  width: 100%;
  max-width: 320px;
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background: #333;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);

  &:disabled {
    background: #aaa;
    cursor: not-allowed;
  }
`;

const ResultBox = styled(motion.div)`
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 2px solid #4ECDC4;

  h3 {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 8px;
  }
  p {
    color: #333;
    font-size: 1.5rem;
    font-weight: 800;
  }
`;

const InfoText = styled.p`
  font-size: 0.8rem;
  color: #888;
  text-align: center;
  line-height: 1.4;
`;

export const Controls: React.FC = () => {
  const { isSpinning, winner, filteredMenus, resetHistory } = useRouletteStore();
  
  // 룰렛 컴포넌트 내부가 아닌 외부 버튼으로도 제어하고 싶다면 
  // store의 액션을 공유해야 하지만, 현재 구조상 룰렛 내부 클릭으로 처리됨.
  // 여기서는 결과 표시 및 정보 제공 역할 수행.

  return (
    <Container>
      <AnimatePresence>
        {winner && !isSpinning && (
          <ResultBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3>오늘의 메뉴는?</h3>
            <p>{winner.name}</p>
          </ResultBox>
        )}
      </AnimatePresence>

      {!isSpinning && (
        <motion.div 
          style={{ width: '100%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <InfoText>
            가운데 원을 클릭하여 돌려주세요.<br />
            최근 3일 내 먹은 메뉴 ({8 - filteredMenus.length}개)는 제외되었습니다.
          </InfoText>
        </motion.div>
      )}

      <Button
        whileTap={{ scale: 0.95 }}
        onClick={resetHistory}
        disabled={isSpinning}
        style={{ marginTop: '10px', background: '#ff6b6b' }}
      >
        기록 초기화
      </Button>
    </Container>
  );
};