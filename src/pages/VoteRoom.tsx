import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getVoteRoom, getRestaurants, submitVote } from '@/api/mockService';
import { Loader2, Share2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VoteRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [selectedRestId, setSelectedRestId] = useState<string | null>(null);

  // 방 정보 조회
  const { data: room, isLoading: isRoomLoading, isError } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => getVoteRoom(roomId!),
    enabled: !!roomId,
    retry: false,
  });

  // 식당 상세 정보를 위해 전체 목록 조회 (실제로는 방 조회 시 포함되는 게 좋음)
  const { data: allRestaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: getRestaurants,
  });

  // 투표 제출
  const voteMutation = useMutation({
    mutationFn: async () => {
      if (!roomId || !selectedRestId) return;
      return submitVote(roomId, selectedRestId, "Guest");
    },
    onSuccess: () => {
      navigate(`/result/${roomId}`);
    },
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URL이 클립보드에 복사되었습니다!");
  };

  if (isRoomLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-8 h-8" /></div>;
  if (isError || !room) return <div className="text-center p-10">존재하지 않는 투표 방입니다.</div>;

  // 후보 식당 필터링
  const candidates = allRestaurants?.filter(r => room.candidateIds.includes(r.id)) || [];

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-accent uppercase">Voting Now</span>
          <h1 className="text-2xl font-bold mt-1">{room.title}</h1>
        </div>
        <button onClick={handleShare} className="btn btn-outline h-9 px-3">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {candidates.map((rest) => {
            const isSelected = selectedRestId === rest.id;
            return (
                <div
                key={rest.id}
                onClick={() => setSelectedRestId(rest.id)}
                className={cn(
                    "card p-4 cursor-pointer transition-all hover:shadow-md",
                    isSelected ? "border-accent ring-2 ring-accent bg-blue-50/50" : ""
                )}
                >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg">{rest.name}</h3>
                        <p className="text-sm text-secondary">{rest.description}</p>
                    </div>
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", 
                        isSelected ? "border-accent" : "border-slate-300"
                    )}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                    </div>
                </div>
                </div>
            )
        })}
      </div>

      <div className="pt-4">
        <button
          onClick={() => voteMutation.mutate()}
          disabled={!selectedRestId || voteMutation.isPending}
          className="btn btn-primary w-full h-12 text-lg shadow-lg shadow-primary/20"
        >
          {voteMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <span className="flex items-center gap-2">투표하고 결과 보기 <ArrowRight className="w-5 h-5" /></span>
          )}
        </button>
      </div>
    </div>
  );
}