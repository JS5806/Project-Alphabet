import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Menu } from '../types';

interface RouletteProps {
  items: Menu[];
  onSpinEnd: (winner: Menu) => void;
  isSpinning: boolean;
}

const RouletteContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  position: relative;
`;

const Pointer = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 25px solid #333;
  z-index: 10;
`;

const Canvas = styled.canvas`
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
`;

const Roulette: React.FC<RouletteProps> = ({ items, onSpinEnd, isSpinning }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  
  // Canvas 설정 및 초기 렌더링
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI Display 대응 (모바일 렌더링 최적화)
    const size = 300;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10; // 패딩

    const drawWheel = (currentRotation: number) => {
      ctx.clearRect(0, 0, size, size);
      const arc = (2 * Math.PI) / items.length;

      // 휠 회전 적용
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(currentRotation);
      ctx.translate(-centerX, -centerY);

      items.forEach((item, index) => {
        const angle = index * arc;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, angle, angle + arc);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.stroke();

        // 텍스트 렌더링
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(item.name, radius - 20, 5);
        ctx.restore();
      });

      ctx.restore();
    };

    drawWheel(rotation);

  }, [items, rotation]);

  // 스핀 로직
  useEffect(() => {
    if (isSpinning) {
      let start: number | null = null;
      const duration = 3000; // 3초간 회전
      const initialRotation = rotation;
      // 랜덤 회전수 (5~10바퀴) + 랜덤 각도
      const targetRotation = initialRotation + (Math.PI * 2 * 5) + (Math.random() * Math.PI * 2);

      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const t = Math.min(progress / duration, 1);
        
        // Ease-out Cubic (감속 효과)
        const easeOut = 1 - Math.pow(1 - t, 3);
        const currentAngle = initialRotation + (targetRotation - initialRotation) * easeOut;

        setRotation(currentAngle);

        if (progress < duration) {
          requestAnimationFrame(animate);
        } else {
          // 회전 종료 후 당첨자 계산
          const finalAngle = currentAngle % (Math.PI * 2);
          // 캔버스는 시계방향 회전. 포인터는 12시 방향(-PI/2 or 270deg). 
          // 실제 당첨 아이템 계산을 위한 역산 로직
          const sliceAngle = (Math.PI * 2) / items.length;
          // Canvas의 0도는 3시 방향. 12시 방향 보정(-PI/2)과 회전각 고려
          const compensatedAngle = (2 * Math.PI) - (finalAngle % (2 * Math.PI)); 
          // 12시 방향(Top)에 위치한 슬라이스 인덱스 계산
          const winningIndex = Math.floor(((compensatedAngle + Math.PI / 2) % (Math.PI * 2)) / sliceAngle); 
          
          const actualIndex = (winningIndex + items.length) % items.length;
          onSpinEnd(items[actualIndex]);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isSpinning, items]); // 의존성 배열 최소화

  return (
    <RouletteContainer>
      <Pointer />
      <Canvas ref={canvasRef} />
    </RouletteContainer>
  );
};

export default Roulette;