import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantApi, voteApi, Restaurant } from '../api/services';
import { cn } from '../lib/utils';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function VotePage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // 1. 식당 리스트 Fetching
  const { data: restaurants, isLoading, isError } = useQuery({
    queryKey: ['restaurants'],
    queryFn: restaurantApi.getList,
  });

  // 2. 투표 제출 Mutation
  const voteMutation = useMutation({
    mutationFn: voteApi.submitVote,
    onSuccess: () => {
      alert('투표가 완료되었습니다!');
      // 결과 페이지 데이터 미리 갱신
      queryClient.invalidateQueries({ queryKey: ['voteResults'] });
      setSelectedId(null);
    },
    onError: () => {
      alert('투표 전송 중 오류가 발생했습니다.');
    }
  });

  const handleVote = () => {
    if (selectedId) {
      voteMutation.mutate(selectedId);
    }
  };

  if (isLoading) return <div className="text-center py-20">로딩 중...</div>;
  if (isError) return <div className="text-center py-20 text-red-500">데이터를 불러오는데 실패했습니다.</div>;

  return (
    <div>
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">오늘의 점심 후보</h1>
          <p className="mt-2 text-sm text-gray-500">원하는 식당을 선택하고 투표 버튼을 눌러주세요.</p>
        </div>
        <button
          onClick={handleVote}
          disabled={!selectedId || voteMutation.isPending}
          className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {voteMutation.isPending ? '제출 중...' : '투표하기'}
        </button>
      </header>

      {/* Grid UI */}
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {restaurants?.map((restaurant) => (
          <div 
            key={restaurant.id} 
            onClick={() => setSelectedId(restaurant.id)}
            className={cn(
              "group relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-lg",
              selectedId === restaurant.id 
                ? "border-indigo-600 bg-indigo-50" 
                : "border-gray-200 bg-white hover:border-indigo-300"
            )}
          >
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-48">
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  {restaurant.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{restaurant.category}</p>
                <p className="mt-2 text-sm text-gray-600">{restaurant.description}</p>
              </div>
              {selectedId === restaurant.id && (
                 <CheckCircleIcon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}