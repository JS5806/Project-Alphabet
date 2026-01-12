import React, { createContext, useContext, useState } from 'react';
import { Poll } from '../types';

// Mock Data
const INITIAL_POLLS: Poll[] = [
  {
    id: '1',
    question: "다음 워크샵 장소는 어디가 좋을까요?",
    description: "팀원들의 의견을 수렴하여 결정합니다.",
    totalVotes: 12,
    options: [
      { id: 'opt1', text: '제주도 푸른밤', votes: 5 },
      { id: 'opt2', text: '강릉 오션뷰 호텔', votes: 4 },
      { id: 'opt3', text: '도심 속 호캉스', votes: 3 },
    ]
  },
  {
    id: '2',
    question: "점심 메뉴 추천해주세요 🍱",
    totalVotes: 45,
    options: [
      { id: 'opt1', text: '한식 (김치찌개/불고기)', votes: 20 },
      { id: 'opt2', text: '중식 (짜장/짬뽕)', votes: 10 },
      { id: 'opt3', text: '일식 (돈까스/초밥)', votes: 15 },
    ]
  }
];

interface PollContextType {
  polls: Poll[];
  getPoll: (id: string) => Poll | undefined;
  votePoll: (pollId: string, optionId: string) => void;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export const PollProvider = ({ children }: { children: React.ReactNode }) => {
  const [polls, setPolls] = useState<Poll[]>(INITIAL_POLLS);

  const getPoll = (id: string) => polls.find(p => p.id === id);

  const votePoll = (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id !== pollId) return poll;
      
      // 이미 투표했다면 로직 생략 (실제론 서버 검증 필요)
      if (poll.hasVoted) return poll;

      return {
        ...poll,
        totalVotes: poll.totalVotes + 1,
        hasVoted: true,
        userChoice: optionId,
        options: poll.options.map(opt => 
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        )
      };
    }));
  };

  return (
    <PollContext.Provider value={{ polls, getPoll, votePoll }}>
      {children}
    </PollContext.Provider>
  );
};

export const usePoll = () => {
  const context = useContext(PollContext);
  if (!context) throw new Error("usePoll must be used within PollProvider");
  return context;
};