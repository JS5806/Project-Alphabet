import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { Menu } from '../types';

interface RouletteProps {
  data: Menu[];
  onSpinComplete: (selected: Menu) => void;
  isSpinning: boolean;
  setIsSpinning: (state: boolean) => void;
}

const RouletteContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 20px auto;
  
  @media (max-width: 360px) {
    width: 260px;
    height: 260px;
  }
`;

const Wheel = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #333;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
`;

const Segment = styled.div<{ rotate: number; color: string; skew: number }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 50%;
  transform-origin: 0% 100%;
  background-color: ${(props) => props.color};
  transform: rotate(${(props) => props.rotate}deg) skewY(${(props) => props.skew}deg);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled.span<{ rotate: number; skew: number }>`
  position: absolute;
  left: -100%; 
  width: 200%;
  height: 200%;
  text-align: center;
  display: block;
  transform: skewY(-${(props) => props.skew}deg) rotate(15deg);
  padding-top: 20px;
  font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  font-size: 14px;
`;

const Pointer = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 25px solid #ff4757;
  z-index: 10;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
`;

const SpinButton = styled.button<{ disabled: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fff;
  border: 4px solid #333;
  font-weight: 800;
  color: #333;
  z-index: 5;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  transition: transform 0.1s;
  
  &:active {
    transform: translate(-50%, -50%) scale(0.95);
  }

  &:disabled {
    background: #e0e0e0;
    color: #aaa;
    cursor: not-allowed;
  }
`;

const Roulette: React.FC<RouletteProps> = ({ data, onSpinComplete, isSpinning, setIsSpinning }) => {
  const controls = useAnimation();
  const rotationRef = useRef(0);

  const numSegments = data.length;
  const segmentAngle = 360 / numSegments;
  // CSS Skew logic to make segments
  const skewAngle = 90 - segmentAngle;

  const handleSpin = async () => {
    if (isSpinning || numSegments < 2) return;
    setIsSpinning(true);

    // 랜덤 인덱스 선택 (결과 미리 산정)
    const randomIndex = Math.floor(Math.random() * numSegments);
    const selectedItem = data[randomIndex];

    // 회전 계산
    // 기본 5바퀴(1800도) + 타겟 위치 보정
    // Pointer가 상단(0도)에 있으므로, 타겟 세그먼트가 상단에 오려면 회전각 계산 필요
    // 데이터 순서가 시계방향으로 그려지므로, 역연산 필요할 수 있음.
    // 여기서는 단순화를 위해 랜덤 추가 회전값을 넉넉히 줌.
    
    // 정확한 위치 계산:
    // 인덱스 0이 0~segmentAngle 사이.
    // 중앙값 = (index * segmentAngle) + (segmentAngle / 2)
    // 360 - 중앙값 + (360 * 바퀴수)
    
    const targetAngle = (randomIndex * segmentAngle) + (segmentAngle / 2);
    const extraSpins = 360 * 5; // 최소 5바퀴
    // 포인터가 12시에 있고, 휠은 시계방향 회전.
    // 특정 인덱스가 12시에 오려면: 360도 - (해당 세그먼트 중심 각도) + 추가 회전
    
    // Framer Motion은 누적 회전을 사용하므로 현재 ref에서 더해줌
    const currentRotation = rotationRef.current % 360; 
    const adjustment = (360 - targetAngle) + extraSpins + (360 - currentRotation);
    const finalRotation = rotationRef.current + adjustment;

    rotationRef.current = finalRotation;

    await controls.start({
      rotate: finalRotation,
      transition: {
        duration: 4,
        ease: [0.2, 0.8, 0.2, 1], // Cubic-bezier for realistic friction
      },
    });

    setIsSpinning(false);
    onSpinComplete(selectedItem);
  };

  return (
    <RouletteContainer>
      <Pointer />
      <Wheel animate={controls} initial={{ rotate: 0 }}>
        {data.map((item, index) => (
          <Segment
            key={item.id}
            color={item.color}
            rotate={index * segmentAngle}
            skew={skewAngle}
          >
            {/* Label 회전 보정: 세그먼트 skew를 상쇄하고 텍스트 정렬 */}
            <Label rotate={segmentAngle / 2} skew={skewAngle}>
              <div style={{ transform: `rotate(${-(90 - (segmentAngle/2))}deg) translate(0, 20px)`}}>
                {item.name}
              </div>
            </Label>
          </Segment>
        ))}
      </Wheel>
      <SpinButton onClick={handleSpin} disabled={isSpinning || numSegments < 2}>
        {numSegments < 2 ? 'X' : 'GO'}
      </SpinButton>
    </RouletteContainer>
  );
};

export default Roulette;