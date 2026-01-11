import React from 'react';
import { useMenus } from '../hooks/useMenu';
import { useRealtimeVotes } from '../hooks/useRealtimeVotes';

const VotePage: React.FC = () => {
  const { data: menus } = useMenus();
  const { votes, isConnected, castVote } = useRealtimeVotes();

  // 메뉴 ID 별 투표 수 매핑
  const getVoteCount = (menuId: string) => {
    return votes.find((v) => v.menuId === menuId)?.count || 0;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">오늘의 점심 투표</h2>
        <span className={`rounded px-3 py-1 text-sm font-bold text-white ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
            {isConnected ? '실시간 연결됨' : '연결 끊김'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menus?.map((menu) => (
          <div
            key={menu.id}
            onClick={() => castVote(menu.id)}
            className="group cursor-pointer rounded-xl border-2 border-transparent bg-white p-6 shadow-lg transition duration-200 hover:scale-105 hover:border-blue-400"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                {menu.name}
              </h3>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800">
                {getVoteCount(menu.id)}표
              </span>
            </div>
            <p className="mt-2 text-gray-500">{menu.description}</p>
            <p className="mt-4 text-right font-bold text-gray-900">
              {menu.price.toLocaleString()}원
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotePage;