import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { voteApi } from '../api/services';
import { cn } from '../lib/utils';
import { TrophyIcon } from '@heroicons/react/24/solid';

export default function ResultPage() {
  const { data: results, isLoading, isError } = useQuery({
    queryKey: ['voteResults'],
    queryFn: voteApi.getResults,
    refetchInterval: 5000, // 5초마다 실시간 업데이트 (폴링)
  });

  if (isLoading) return <div className="text-center py-20">집계 중...</div>;
  if (isError) return <div className="text-center py-20 text-red-500">결과를 불러오지 못했습니다.</div>;

  const maxVotes = results && results.length > 0 ? results[0].count : 0;
  const totalVotes = results?.reduce((acc, curr) => acc + curr.count, 0) || 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">투표 결과 대시보드</h1>
        <p className="mt-2 text-gray-500">현재 총 투표수: <span className="font-bold text-indigo-600">{totalVotes}</span>표</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <ul className="space-y-6">
          {results?.map((item, index) => {
            const isWinner = index === 0 && item.count > 0;
            const percentage = totalVotes > 0 ? Math.round((item.count / totalVotes) * 100) : 0;

            return (
              <li key={item.restaurantId} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {isWinner && <TrophyIcon className="h-5 w-5 text-yellow-500" />}
                    <span className={cn("font-medium", isWinner ? "text-indigo-700 font-bold" : "text-gray-700")}>
                      {item.restaurantName}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 font-mono">{item.count}표 ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={cn(
                      "h-4 rounded-full transition-all duration-1000 ease-out",
                      isWinner ? "bg-indigo-600" : "bg-gray-400"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                {isWinner && (
                    <div className="absolute -left-2 -top-2 w-full h-full pointer-events-none border-2 border-yellow-400 rounded-lg animate-pulse opacity-50 p-6 -m-4"></div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}