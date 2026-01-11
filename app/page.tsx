'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Filter, Plus, Check } from 'lucide-react';
import { Button, Input, Card, Badge } from '@/components/ui/mock-shadcn';
import { useCreateVoteStore } from '@/store/useCreateVoteStore';
import { Restaurant } from '@/lib/mock-db';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'ALL' | 'KR' | 'CN' | 'JP' | 'WS'>('ALL');
  const [search, setSearch] = useState('');
  
  // 상태 관리 (투표 생성용 장바구니)
  const { selectedRestaurants, toggleRestaurant } = useCreateVoteStore();

  // 데이터 페칭
  const { data: restaurants, isLoading } = useQuery<Restaurant[]>({
    queryKey: ['restaurants'],
    queryFn: () => fetch('/api/restaurants').then(res => res.json())
  });

  // 투표 세션 생성 뮤테이션
  const createSession = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/vote/create', {
        method: 'POST',
        body: JSON.stringify({
          title: '오늘의 점심 투표',
          candidateIds: selectedRestaurants.map(r => r.id)
        })
      });
      return res.json();
    },
    onSuccess: (data) => {
      router.push(`/vote/${data.sessionId}`);
    }
  });

  // 필터링 로직
  const filteredList = restaurants?.filter(r => {
    const matchFilter = filter === 'ALL' || r.category === filter;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (isLoading) return <div className="p-8 text-center">로딩 중...</div>;

  return (
    <div className="max-w-md mx-auto p-4 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">점심 뭐 먹지? 🍚</h1>
        <p className="text-slate-500 text-sm">후보를 선택하고 동료들에게 투표를 요청하세요.</p>
      </header>

      {/* Search & Filter */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="식당 이름 검색..." 
            className="pl-9" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['ALL', 'KR', 'CN', 'JP', 'WS'].map((cat) => (
            <Button 
              key={cat} 
              variant={filter === cat ? 'default' : 'outline'}
              onClick={() => setFilter(cat as any)}
              className="h-8 text-xs rounded-full"
            >
              {cat === 'ALL' ? '전체' : cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Restaurant List */}
      <div className="grid gap-4">
        {filteredList?.map((restaurant) => {
          const isSelected = selectedRestaurants.some(r => r.id === restaurant.id);
          return (
            <Card 
              key={restaurant.id} 
              className={cn(
                "overflow-hidden cursor-pointer transition-all active:scale-95",
                isSelected ? "ring-2 ring-slate-900 ring-offset-2" : ""
              )}
            >
              <div onClick={() => toggleRestaurant(restaurant)} className="flex items-center p-3 gap-4">
                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-slate-100">
                  {/* Next/Image Placeholder 처리 */}
                  <Image 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    fill 
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{restaurant.name}</h3>
                    <Badge>{restaurant.category}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isSelected ? '선택됨' : '터치하여 선택'}
                  </p>
                </div>
                <div className={cn(
                  "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                  isSelected ? "bg-blue-500 border-blue-500 text-white" : "border-slate-300"
                )}>
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Floating Action Button (Create) */}
      {selectedRestaurants.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 max-w-md mx-auto">
          <Button 
            className="w-full h-12 text-lg shadow-lg"
            onClick={() => createSession.mutate()}
            disabled={createSession.isPending}
          >
            {createSession.isPending ? '생성 중...' : `${selectedRestaurants.length}개로 투표 생성하기`}
          </Button>
        </div>
      )}
    </div>
  );
}