import { useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import { VoteData } from '../types';

// [Team Comment] 반영: Socket 상태 관리 최적화 훅
export const useRealtimeVotes = () => {
  const [votes, setVotes] = useState<VoteData[]>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    // 연결 상태 리스너
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    
    // 투표 데이터 수신 리스너
    const onVoteUpdate = (data: VoteData[]) => {
      setVotes(data);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('update_votes', onVoteUpdate);

    // 컴포넌트 마운트 시 초기 데이터 요청 (선택적)
    if (socket.connected) {
        socket.emit('request_initial_votes');
    }

    // Cleanup: 언마운트 시 리스너 해제하여 메모리 누수 방지
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('update_votes', onVoteUpdate);
    };
  }, []);

  const castVote = (menuId: string) => {
    if (isConnected) {
      socket.emit('vote', { menuId });
    } else {
      alert('서버 연결이 불안정합니다.');
    }
  };

  return { votes, isConnected, castVote };
};