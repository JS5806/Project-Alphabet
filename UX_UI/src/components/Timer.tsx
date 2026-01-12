import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface TimerProps {
  deadline: number; // Timestamp
  onExpire: () => void;
}

const TimerWrapper = styled.div<{ $isUrgent: boolean }>`
  background-color: ${({ $isUrgent }) => ($isUrgent ? '#FFF0F0' : '#E8F5E9')};
  padding: 12px 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px;
  border: 1px solid ${({ $isUrgent }) => ($isUrgent ? '#FF6B6B' : '#4CAF50')};
  transition: background-color 0.3s ease;
`;

const TimerLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #555;
`;

const TimeDisplay = styled.span<{ $isUrgent: boolean }>`
  font-family: 'Courier New', monospace;
  font-size: 20px;
  font-weight: 700;
  color: ${({ $isUrgent }) => ($isUrgent ? '#FF3B30' : '#2E7D32')};
`;

const Timer: React.FC<TimerProps> = ({ deadline, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    // 서버 시간 동기화 오차 최소화를 위해 setInterval 내부에서 Date.now()로 재계산
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        onExpire();
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, onExpire]);

  // 임박 기준: 60초 미만
  const isUrgent = timeLeft < 60 * 1000 && timeLeft > 0;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <TimerWrapper $isUrgent={isUrgent}>
      <TimerLabel>투표 마감까지</TimerLabel>
      <TimeDisplay $isUrgent={isUrgent}>{timeLeft > 0 ? formatTime(timeLeft) : "마감됨"}</TimeDisplay>
    </TimerWrapper>
  );
};

export default Timer;