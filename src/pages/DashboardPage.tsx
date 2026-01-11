import React, { useMemo } from 'react';
import { useMenus } from '../hooks/useMenu';
import { useRealtimeVotes } from '../hooks/useRealtimeVotes';

const DashboardPage: React.FC = () => {
  const { data: menus } = useMenus();
  const { votes } = useRealtimeVotes();

  // 데이터 가공: 투표 수 기준 정렬 및 병합
  const rankingData = useMemo(() => {
    if (!menus) return [];
    
    return menus.map(menu => {
        const count = votes.find(v => v.menuId === menu.id)?.count || 0;
        return { ...menu, count };
    }).sort((a, b) => b.count - a.count);
  }, [menus, votes]);

  const maxVotes = rankingData.length > 0 ? rankingData[0].count : 1;

  return (
    <div className="container mx-auto p-6">
      <h2 className="mb-8 text-2xl font-bold text-gray-800">실시간 투표 결과 대시보드</h2>

      <div className="rounded-xl bg-white p-8 shadow-lg">
        {rankingData.map((item, index) => {
            const percentage = (item.count / (maxVotes || 1)) * 100;
            
            return (
                <div key={item.id} className="mb-6 last:mb-0">
                    <div className="mb-1 flex justify-between">
                        <span className="font-bold text-gray-700">
                            #{index + 1} {item.name}
                        </span>
                        <span className="font-semibold text-blue-600">{item.count}표</span>
                    </div>
                    {/* 막대 그래프 시각화 */}
                    <div className="h-6 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
            );
        })}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
         <div className="rounded-lg bg-blue-50 p-4">
             <p className="text-sm text-gray-500">총 투표수</p>
             <p className="text-2xl font-bold text-blue-700">
                 {rankingData.reduce((acc, curr) => acc + curr.count, 0)}
             </p>
         </div>
         {/* 추가 통계 위젯들... */}
      </div>
    </div>
  );
};

export default DashboardPage;