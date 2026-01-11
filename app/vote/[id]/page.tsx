'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Share2, BarChart2, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Button, Input, Card, Badge } from '@/components/ui/mock-shadcn';
import { cn } from '@/lib/utils';

export default function VotePage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  
  const [nickname, setNickname] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [hasVoted, setHasVoted] = useState(false); // 로컬 투표 상태

  // Polling 설정 (실시간성 확보를 위해 2초마다 갱신)
  const { data: session, isLoading } = useQuery({
    queryKey: ['vote', id],
    queryFn: () => fetch(`/api/vote/${id}`).then(res => res.json()),
    refetchInterval: 2000, 
  });

  // 투표 실행
  const voteMutation = useMutation({
    mutationFn: async (restaurantId: string) => {
      await fetch(`/api/vote/${id}`, {
        method: 'POST',
        body: JSON.stringify({ restaurantId, nickname })
      });
    },
    onSuccess: () => {
      setHasVoted(true);
      queryClient.invalidateQueries({ queryKey: ['vote', id] });
    }
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다!');
  };

  if (isLoading) return <div className="p-8 text-center">세션 로딩 중...</div>;
  if (!session || session.error) return <div className="p-8 text-center">유효하지 않은 투표입니다.</div>;

  // 1. 닉네임 입력 단계 (게스트 입장)
  if (!isJoined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-md mx-auto">
        <Card className="w-full p-6 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-bold">{session.title}</h2>
            <p className="text-slate-500 text-sm">참여하려면 닉네임을 입력하세요.</p>
          </div>
          <Input 
            placeholder="닉네임 (예: 먹보)" 
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <Button 
            className="w-full" 
            disabled={!nickname.trim()}
            onClick={() => setIsJoined(true)}
          >
            입장하기
          </Button>
        </Card>
      </div>
    );
  }

  // 2. 결과 화면 (이미 투표했거나, 결과 보기 모드)
  if (hasVoted) {
    const dataForChart = session.candidates.map((c: any) => ({
      name: c.name,
      votes: c.votes,
      isWinner: c.votes === session.maxVotes && c.votes > 0
    }));

    return (
      <div className="max-w-md mx-auto p-4">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-xl font-bold">투표 현황 📊</h1>
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            <Share2 className="w-4 h-4 mr-2" /> 공유
          </Button>
        </header>

        <Card className="p-4 mb-6">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataForChart} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="votes" radius={[0, 4, 4, 0]} barSize={30}>
                  {dataForChart.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.isWinner ? '#3b82f6' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">
            실시간으로 업데이트 됩니다 (2초 주기)
          </p>
        </Card>

        <div className="space-y-2">
          <h3 className="font-semibold mb-2">득표 상세</h3>
          {session.candidates.map((c: any) => (
            <div key={c.restaurantId} className="flex justify-between items-center p-3 bg-white rounded-lg border">
              <span className="font-medium">{c.name}</span>
              <Badge active={c.votes === session.maxVotes && c.votes > 0}>
                {c.votes}표
              </Badge>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. 투표 진행 화면
  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <header className="mb-4">
        <h1 className="text-xl font-bold">{session.title}</h1>
        <p className="text-slate-500 text-sm">안녕하세요, {nickname}님! 메뉴를 선택해주세요.</p>
      </header>

      <div className="space-y-3">
        {session.candidates.map((c: any) => (
          <Card 
            key={c.restaurantId}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
            onClick={() => {
              if (confirm(`${c.name}에 투표하시겠습니까?`)) {
                voteMutation.mutate(c.restaurantId);
              }
            }}
          >
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-slate-200 rounded-md overflow-hidden relative">
                 {/* 이미지 최적화 이슈: MVP에서는 간단한 img 태그 또는 Next/Image 사용 */}
                 <img src={c.image} alt={c.name} className="object-cover w-full h-full" />
               </div>
               <div>
                 <h3 className="font-medium">{c.name}</h3>
                 <span className="text-xs text-slate-400">{c.category}</span>
               </div>
            </div>
            <Button variant="outline" className="h-8">선택</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}