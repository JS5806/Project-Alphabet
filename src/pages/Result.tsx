import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVoteResults, getVoteRoom } from '@/api/mockService';
import { Loader2, RefreshCw, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Result() {
  const { roomId } = useParams<{ roomId: string }>();

  // 방 정보 (제목 표시용)
  const { data: room } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => getVoteRoom(roomId!),
    enabled: !!roomId,
  });

  // 결과 Polling (2초마다 갱신) - Concurrency 해결
  const { data: results, isLoading } = useQuery({
    queryKey: ['results', roomId],
    queryFn: () => getVoteResults(roomId!),
    refetchInterval: 2000, 
    enabled: !!roomId,
  });

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-8 h-8" /></div>;

  const totalVotes = results?.reduce((acc, curr) => acc + curr.count, 0) || 0;
  const winner = results && results.length > 0 ? results[0] : null;

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-sm text-secondary">투표 결과</h2>
        <h1 className="text-2xl font-bold">{room?.title}</h1>
        <div className="flex items-center justify-center gap-2 text-xs text-secondary animate-pulse">
            <RefreshCw className="w-3 h-3" /> 실시간 집계 중...
        </div>
      </div>

      {/* Winner Highlight */}
      {winner && winner.count > 0 && (
        <div className="card bg-yellow-50 border-yellow-200 p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Trophy className="w-24 h-24 text-yellow-600" />
          </div>
          <span className="text-yellow-700 font-bold text-sm uppercase tracking-wide">Current Winner</span>
          <h3 className="text-3xl font-black text-slate-900 mt-2">{winner.restaurantName}</h3>
          <p className="text-yellow-800 mt-1">{winner.count}표 획득!</p>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex justify-between">
            <span>득표 현황</span>
            <span className="text-sm font-normal text-secondary">총 {totalVotes}명 참여</span>
        </h3>
        
        <div className="space-y-3">
          {results?.map((item, index) => {
            const percentage = totalVotes === 0 ? 0 : Math.round((item.count / totalVotes) * 100);
            const isWinner = index === 0 && item.count > 0;

            return (
              <div key={item.restaurantId} className="relative">
                <div className="flex justify-between items-end mb-1 text-sm">
                  <span className={cn("font-medium", isWinner && "text-primary")}>
                    {item.restaurantName} {isWinner && "👑"}
                  </span>
                  <span className="text-secondary">{item.count}표 ({percentage}%)</span>
                </div>
                {/* Bar Chart Background */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className={cn(
                        "h-full rounded-full transition-all duration-500 ease-out", 
                        isWinner ? "bg-accent" : "bg-slate-400"
                    )}
                    style={{ width: `${percentage}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-8 text-center">
        <Link to="/" className="text-sm text-secondary hover:underline">
          메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}