import React, { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { fetchRestaurants } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { VoteState } from '../types';
import { BarChart3, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

// 실제 환경에서는 환경변수로 관리
const SOCKET_URL = 'http://localhost:4000';

export default function VotingPage() {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [votes, setVotes] = useState<VoteState>({});
  const [myVote, setMyVote] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  // 식당 데이터 조회
  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: fetchRestaurants,
  });

  // Socket 초기화 및 이벤트 리스닝
  useEffect(() => {
    // 실제 백엔드가 없으면 연결 오류가 발생하므로, UI 테스트를 위해 mock 처리가 필요할 수 있음.
    // 여기서는 표준 구현을 작성함.
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      query: { username: user?.username },
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
      newSocket.emit('join_room', 'lunch_vote_today');
    });

    newSocket.on('initial_state', (currentVotes: VoteState) => {
      setVotes(currentVotes);
    });

    newSocket.on('update_votes', (updatedVotes: VoteState) => {
      setVotes(updatedVotes);
    });
    
    // MVP: 백엔드 없이 UI 테스트를 위한 더미 타이머 (실제 배포시 제거)
    // const mockTimer = setInterval(() => {
    //   setVotes(prev => {
    //     const ids = restaurants?.map(r => r.id) || [];
    //     if(ids.length === 0) return prev;
    //     const randomId = ids[Math.floor(Math.random() * ids.length)];
    //     return { ...prev, [randomId]: (prev[randomId] || 0) + 1 };
    //   });
    // }, 3000);

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      // clearInterval(mockTimer);
    };
  }, [user, restaurants]);

  const handleVote = (restaurantId: string) => {
    if (!socket || !connected) {
        // Fallback for offline/demo
        setMyVote(restaurantId);
        setVotes(prev => ({...prev, [restaurantId]: (prev[restaurantId] || 0) + 1}));
        return; 
    }
    
    // 이전 투표 취소 로직은 백엔드에서 처리한다고 가정
    setMyVote(restaurantId);
    socket.emit('vote', { restaurantId, userId: user?.id });
  };

  // 결과 계산
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  
  // 랭킹 정렬
  const rankedRestaurants = useMemo(() => {
    if (!restaurants) return [];
    return [...restaurants].sort((a, b) => {
      const voteA = votes[a.id] || 0;
      const voteB = votes[b.id] || 0;
      return voteB - voteA; // 내림차순
    });
  }, [restaurants, votes]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* 왼쪽: 투표 영역 */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto max-h-screen">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">점심 메뉴 투표</h1>
          <p className="text-gray-500">원하는 식당을 선택하세요.</p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {restaurants?.map((rest) => {
            const isSelected = myVote === rest.id;
            return (
              <button
                key={rest.id}
                onClick={() => handleVote(rest.id)}
                className={clsx(
                  "relative p-5 rounded-xl border-2 text-left transition-all shadow-sm",
                  isSelected 
                    ? "border-primary bg-blue-50 ring-1 ring-primary" 
                    : "border-white bg-white hover:border-blue-200"
                )}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{rest.name}</h3>
                    <span className="text-sm text-gray-500">{rest.category}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="text-primary w-6 h-6" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 오른쪽/하단: 결과 대시보드 */}
      <div className="w-full md:w-96 bg-white border-l border-gray-200 p-6 shadow-xl z-20">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="text-secondary w-6 h-6" />
          <h2 className="text-xl font-bold">실시간 득표 현황</h2>
        </div>
        
        <div className="space-y-6">
          {rankedRestaurants.map((rest, index) => {
            const count = votes[rest.id] || 0;
            const percentage = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
            
            return (
              <div key={rest.id}>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="flex items-center gap-2">
                    <span className={clsx(
                      "w-5 h-5 flex items-center justify-center rounded-full text-xs text-white",
                      index === 0 ? "bg-yellow-400" : "bg-gray-400"
                    )}>{index + 1}</span>
                    {rest.name}
                  </span>
                  <span className="text-gray-600">{count}표 ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className={clsx(
                      "h-full transition-all duration-500 ease-out rounded-full",
                      index === 0 ? "bg-secondary" : "bg-gray-400"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}

          {totalVotes === 0 && (
            <div className="text-center text-gray-400 py-10">
              아직 투표가 없습니다.<br />첫 번째로 투표해보세요!
            </div>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
           <div className="text-center">
             <span className="text-4xl font-bold text-gray-800">{totalVotes}</span>
             <p className="text-gray-500 text-sm">총 투표 수</p>
           </div>
        </div>
      </div>
    </div>
  );
}