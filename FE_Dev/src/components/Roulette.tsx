import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { MenuItem } from '../types';

interface RouletteProps {
  items: MenuItem[];
  onSpinComplete: (item: MenuItem) => void;
  isSpinning: boolean;
  setIsSpinning: (state: boolean) => void;
  resetTrigger: boolean;
}

const RouletteContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 20px auto;
`;

const Wheel = styled.div<{ $rotation: number; $duration: number; $background: string }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 5px solid #333;
  position: relative;
  transition: transform ${(props) => props.$duration}s cubic-bezier(0.25, 0.1, 0.25, 1);
  transform: rotate(${(props) => props.$rotation}deg);
  background: ${(props) => props.$background};
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  overflow: hidden;
`;

const Pointer = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid #e74c3c;
  z-index: 10;
`;

const SpinButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #333;
  color: white;
  font-weight: bold;
  z-index: 5;
  box-shadow: 0 0 5px rgba(0,0,0,0.5);
  
  &:disabled {
    background: #888;
    cursor: not-allowed;
  }
`;

const Roulette: React.FC<RouletteProps> = ({ 
  items, 
  onSpinComplete, 
  isSpinning, 
  setIsSpinning,
  resetTrigger 
}) => {
  const [rotation, setRotation] = useState(0);
  const [background, setBackground] = useState('');
  
  // 룰렛 회전 수 누적을 위한 Ref
  const currentRotationRef = useRef(0);

  // 아이템 변경 시 배경 그라디언트 재생성
  useEffect(() => {
    if (items.length === 0) return;

    const anglePerItem = 360 / items.length;
    let gradientStr = 'conic-gradient(';
    
    items.forEach((item, index) => {
      const startAngle = index * anglePerItem;
      const endAngle = (index + 1) * anglePerItem;
      gradientStr += `${item.color} ${startAngle}deg ${endAngle}deg,`;
    });
    
    gradientStr = gradientStr.slice(0, -1) + ')';
    setBackground(gradientStr);
  }, [items]);

  // 리셋 트리거 감지 시 회전 초기화
  useEffect(() => {
    if (resetTrigger) {
      setRotation(0);
      currentRotationRef.current = 0;
    }
  }, [resetTrigger]);

  const handleSpin = () => {
    if (items.length < 2) {
      alert("최소 2개 이상의 메뉴가 필요합니다.");
      return;
    }
    
    setIsSpinning(true);

    // 랜덤 인덱스 선택
    const randomIndex = Math.floor(Math.random() * items.length);
    const selectedItem = items[randomIndex];

    // 각 조각의 각도
    const pieceAngle = 360 / items.length;
    
    // 목표 지점이 12시 방향(Pointer)에 오도록 계산
    // CSS rotate는 시계방향. Pointer는 0도(12시) 기준.
    // 특정 인덱스가 0도에 오려면: -(index * pieceAngle + pieceAngle/2) 만큼 회전해야 함.
    // 하지만 애니메이션을 위해 양의 방향으로 많이 회전시킴.
    
    const targetAngle = 360 - (randomIndex * pieceAngle + pieceAngle / 2);
    
    // 최소 5바퀴(1800도) + 타겟 각도
    const spinRounds = 5; 
    const newRotation = currentRotationRef.current + (360 * spinRounds) + targetAngle - (currentRotationRef.current % 360);
    
    currentRotationRef.current = newRotation;
    setRotation(newRotation);

    // 애니메이션 시간 (3초) 후 결과 전달
    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete(selectedItem);
    }, 3000);
  };

  return (
    <RouletteContainer>
      <Pointer />
      <Wheel 
        $rotation={rotation} 
        $duration={isSpinning ? 3 : 0} 
        $background={background}
      />
      <SpinButton onClick={handleSpin} disabled={isSpinning || items.length === 0}>
        SPIN
      </SpinButton>
    </RouletteContainer>
  );
};

export default Roulette;