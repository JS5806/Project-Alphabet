import React from 'react';

// [UX Goal 2 & 3] 식당 정보 카드 및 실시간 투표 버튼
export default function RestaurantCard({ data, isVoted, onVote, onDelete }) {
  return (
    <div className={`relative flex flex-col justify-between overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg ${isVoted ? 'ring-2 ring-indigo-500' : ''}`}>
      {/* 식당 이미지 영역 (Placeholder) */}
      <div className="h-32 w-full bg-slate-200">
         {/* 실제 이미지가 있다면 img 태그 사용, MVP용 색상 플레이스홀더 */}
         <div className={`h-full w-full flex items-center justify-center text-4xl ${getHeaderColor(data.type)}`}>
            {getIcon(data.type)}
         </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex justify-between items-start">
            <div>
                <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 mb-1">
                {data.type}
                </span>
                <h3 className="text-lg font-bold text-slate-800 leading-tight">{data.name}</h3>
            </div>
             <button onClick={() => onDelete(data.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             </button>
        </div>
        
        <p className="mt-2 text-sm text-slate-500 line-clamp-2">{data.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-1">
             <span className="text-sm font-medium text-slate-600">득표수:</span>
             <span className="text-lg font-bold text-indigo-600 transition-all key={data.votes} animate-pulse">
                {data.votes}
             </span>
          </div>

          <button
            onClick={() => onVote(data.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
              isVoted
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isVoted ? '투표 완료' : '투표하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper: 카테고리별 아이콘/색상
const getIcon = (type) => {
    switch(type) {
        case '한식': return '🍚';
        case '중식': return '🥟';
        case '일식': return '🍣';
        case '양식': return '🍕';
        default: return '🍴';
    }
};
const getHeaderColor = (type) => {
    switch(type) {
        case '한식': return 'bg-orange-100';
        case '중식': return 'bg-red-100';
        case '일식': return 'bg-blue-100';
        case '양식': return 'bg-yellow-100';
        default: return 'bg-slate-200';
    }
};