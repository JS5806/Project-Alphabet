import React, { useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

interface TimerProps {
  isActive: boolean;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  onTimeUp: () => void;
}

const TimerWrapper = styled.div`
  margin-top: 15px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
  background: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: inline-block;
`;

const Timer: React.FC<TimerProps> = ({ isActive, timeLeft, setTimeLeft, onTimeUp }) => {
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      onTimeUp();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeUp, setTimeLeft]);

  if (!isActive) return null;

  // date-fns를 사용하여 mm:ss 포맷팅 (0부터 시작하는 타임스탬프로 변환)
  const formattedTime = format(new Date(0).setSeconds(timeLeft), 'mm:ss');

  return (
    <TimerWrapper>
      투표 종료까지: {formattedTime}
    </TimerWrapper>
  );
};

export default Timer;