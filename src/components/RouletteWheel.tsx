import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { useRouletteStore } from '../store/useRouletteStore';

const WHEEL_SIZE = 320;

const WheelContainer = styled.div`
  position: relative;
  width: ${WHEEL_SIZE}px;
  height: ${WHEEL_SIZE}px;
  margin: 0 auto;
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
  border-top: 30px solid #333;
  z-index: 10;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));
`;

const Wheel = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #333;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 15px rgba(0,0,0,0.2);
  /* GPU 가속 강제 활성화 */
  will-change: transform;
`;

const Segment = styled.div<{ $rotation: number; $color: string; $angle: number }>`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 50%;
  background-color: ${(props) => props.$color};
  transform-origin: 0% 100%;
  transform: rotate(${(props) => props.$rotation}deg) skewY(${(props) => -(90 - props.$angle)}deg);
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const Label = styled.span<{ $angle: number }>`
  position: absolute;
  left: 20px;
  bottom: 20px;
  transform-origin: 0 0;
  /* skew 보정 및 텍스트 정렬 */
  transform: skewY(${(props) => 90 - props.$angle}deg) rotate(15deg); 
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  font-size: 14px;
  white-space: nowrap;
`;

// 중심점 
const CenterDot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
  border: 4px solid #333;
  z-index: 5;
`;

export const RouletteWheel: React.FC = () => {
  const { filteredMenus, isSpinning, setSpinning, setWinner, initializeCandidates } = useRouletteStore();
  const controls = useAnimation();

  useEffect(() => {
    initializeCandidates();
  }, [initializeCandidates]);

  const segmentAngle = 360 / filteredMenus.length;

  const handleSpin = async () => {
    if (isSpinning || filteredMenus.length === 0) return;

    setSpinning(true);

    // 랜덤 결과 인덱스 (0 ~ length-1)
    const randomIndex = Math.floor(Math.random() * filteredMenus.length);
    
    // 최소 5바퀴(1800도) + 결과 위치 보정
    // 포인터가 상단(0도)에 있다고 가정할 때:
    // 회전은 시계방향(+) -> 멈추는 각도는 (360 - 타겟각도) 개념
    const extraSpins = 360 * 5; 
    const targetAngle = segmentAngle * randomIndex;
    // 중앙 정렬을 위한 offset (세그먼트 반절만큼 더 회전)
    const centerOffset = segmentAngle / 2;
    
    // 최종 회전 각도 계산 (현재 위치에 더하는 것이 아니라 절대값으로 처리)
    const totalRotation = extraSpins + (360 - targetAngle) - centerOffset; 

    // Team Comment 반영: JS Loop 연산 대신 CSS Transition/Transform 활용
    await controls.start({
      rotate: totalRotation,
      transition: {
        duration: 4, // 4초 동안 회전
        ease: [0.2, 0.8, 0.2, 1], // Cubic bezier로 자연스러운 감속 구현
        type: "tween"
      }
    });

    // 애니메이션 종료 후 처리
    // 실제 회전값을 360으로 나눈 나머지로 재조정하여 다음 회전 시 부드럽게 이어지게 할 수도 있으나
    // 간단한 구현을 위해 여기서는 멈춤 처리만 진행
    setWinner(filteredMenus[randomIndex]);
    
    // 다음 회전을 위해 rotation 값을 초기화(0으로 리셋)하지 않고 누적된 상태로 둘 경우
    // 값이 너무 커지는 것을 방지하려면 onComplete에서 모듈로 연산을 적용할 수 있음.
    // 여기서는 간단히 유지.
  };

  return (
    <WheelContainer>
      <Pointer />
      <Wheel 
        animate={controls}
        initial={{ rotate: 0 }}
      >
        {filteredMenus.map((menu, index) => (
          <Segment
            key={menu.id}
            $color={menu.color}
            $rotation={segmentAngle * index}
            $angle={segmentAngle}
          >
            <Label $angle={segmentAngle}>{menu.name}</Label>
          </Segment>
        ))}
      </Wheel>
      <CenterDot onClick={handleSpin} />
    </WheelContainer>
  );
};