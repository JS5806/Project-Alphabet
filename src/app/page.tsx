/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5A5F', // 식욕을 돋우는 메인 컬러
        secondary: '#00A699', // 긍정/선택 컬러
        negative: '#FC642D', // 부정/거절 컬러
        background: '#F7F7F7',
        surface: '#FFFFFF',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'floating': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

interface Restaurant {
  id: number;
  name: string;
  category: string;
  image: string;
  rating: number;
}

interface VotingCardProps {
  data: Restaurant;
  onSwipe: (direction: 'left' | 'right') => void;
}

const VotingCard: React.FC<VotingCardProps> = ({ data, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // 스와이프 배경색 변화 (직관적 피드백)
  const bgStatus = useTransform(x, [-150, 0, 150], ['rgba(252, 100, 45, 0.2)', 'rgba(255,255,255,0)', 'rgba(0, 166, 153, 0.2)']);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute top-0 left-0 w-full h-full p-4"
    >
      <motion.div 
        className="w-full h-full bg-surface rounded-2xl shadow-card overflow-hidden flex flex-col relative border border-gray-100"
        style={{ backgroundColor: bgStatus as any }}
      >
        <div className="relative h-2/3 bg-gray-200">
          <img src={data.image} alt={data.name} className="w-full h-full object-cover pointer-events-none" />
          <div className="absolute top-4 right-4 bg-surface px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            ⭐ {data.rating}
          </div>
        </div>
        
        <div className="flex flex-col justify-center items-center h-1/3 p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{data.name}</h2>
          <p className="text-gray-500 font-medium">{data.category}</p>
          
          <div className="flex gap-8 mt-6 w-full justify-center">
            <button className="w-14 h-14 rounded-full bg-white border border-gray-200 shadow-md text-2xl flex items-center justify-center text-negative" onClick={() => onSwipe('left')}>
              ✕
            </button>
            <button className="w-14 h-14 rounded-full bg-primary text-white shadow-floating text-2xl flex items-center justify-center" onClick={() => onSwipe('right')}>
              ♥
            </button>
          </div>
        </div>

        {/* 오버레이 텍스트 (스와이프 시 표시) */}
        <motion.div className="absolute top-10 left-10 border-4 border-secondary text-secondary font-extrabold text-3xl px-2 py-1 rounded rotate-[-12deg]" style={{ opacity: useTransform(x, [50, 150], [0, 1]) }}>
          LIKE
        </motion.div>
        <motion.div className="absolute top-10 right-10 border-4 border-negative text-negative font-extrabold text-3xl px-2 py-1 rounded rotate-[12deg]" style={{ opacity: useTransform(x, [-150, -50], [1, 0]) }}>
          NOPE
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default VotingCard;
import React from 'react';

// 간단한 차트 구현 (라이브러리 의존성 최소화)
interface ResultItem {
  name: string;
  votes: number;
  total: number;
}

const BarItem = ({ name, votes, total }: ResultItem) => {
  const percentage = Math.round((votes / total) * 100);
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-bold text-gray-700">{name}</span>
        <span className="text-sm text-primary font-bold">{votes}표 ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function LiveResults() {
  const dummyData = [
    { name: '스시 오마카세', votes: 12, total: 20 },
    { name: '매운 갈비찜', votes: 5, total: 20 },
    { name: '수제 버거', votes: 3, total: 20 },
  ];

  return (
    <div className="bg-surface rounded-xl p-6 shadow-card w-full">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
        실시간 투표 현황
      </h3>
      <div className="space-y-2">
        {dummyData.map((item, idx) => (
          <BarItem key={idx} {...item} />
        ))}
      </div>
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">현재 1위</p>
        <p className="text-xl font-bold text-primary">🍣 스시 오마카세</p>
      </div>
    </div>
  );
}
import React from 'react';

// 사내 메신저(Slack/Teams) 연동을 위한 모듈형 디자인 템플릿
// Block Kit(Slack) 또는 Adaptive Card(Teams) 구조를 반영한 UI

export default function SlackCardTemplate() {
  return (
    <div className="w-full max-w-sm border border-gray-300 rounded-lg overflow-hidden bg-white font-sans">
      {/* 챗봇 사이드 컬러 바 */}
      <div className="flex">
        <div className="w-1.5 bg-primary min-h-full"></div>
        <div className="flex-1 p-4">
          
          {/* 헤더 섹션 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-gray-500">점심 투표 봇</span>
            <span className="text-xs text-gray-400">APP</span>
          </div>
          
          <h3 className="font-bold text-gray-900 text-base mb-1">오늘의 점심 메뉴를 결정해주세요! 🗳️</h3>
          <p className="text-sm text-gray-600 mb-4">팀원들의 취향을 반영해 3곳의 후보를 추렸습니다.</p>

          {/* 정보 섹션 (Field Group) */}
          <div className="grid grid-cols-2 gap-4 mb-4 border-l-2 border-gray-100 pl-3">
            <div>
              <p className="text-xs font-bold text-gray-500">마감 시간</p>
              <p className="text-sm">오늘 11:30 AM</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500">참여자</p>
              <p className="text-sm">5/12 명 완료</p>
            </div>
          </div>

          {/* 액션 버튼 그룹 */}
          <div className="flex gap-2">
            <button className="flex-1 bg-primary text-white text-sm py-2 rounded font-bold hover:bg-opacity-90 transition-colors">
              투표하러 가기
            </button>
            <button className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm py-2 rounded hover:bg-gray-50 transition-colors">
              결과 보기
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
import React from 'react';

// Naver/Kakao Map API 연동을 가정한 UI 컴포넌트
export default function RestaurantMap() {
  return (
    <div className="relative w-full h-[300px] bg-gray-200 rounded-xl overflow-hidden">
      {/* 지도 배경 (Mock) */}
      <div className="w-full h-full bg-[url('https://via.placeholder.com/600x400/e0e0e0/aeaeae?text=Map+API+View')] bg-cover bg-center opacity-60"></div>
      
      {/* 핀 포인트 (Marker) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg animate-bounce flex items-center justify-center text-white text-xs font-bold">
            1
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-black opacity-20 rounded-full blur-[1px]"></div>
        </div>
      </div>

      {/* 하단 플로팅 리스트 버튼 */}
      <div className="absolute bottom-4 left-0 w-full px-4">
        <div className="bg-surface p-3 rounded-lg shadow-floating flex items-center justify-between">
          <div>
            <p className="font-bold text-sm text-gray-800">강남역 인근 맛집</p>
            <p className="text-xs text-gray-500">반경 500m 이내 • 3곳 검색됨</p>
          </div>
          <button className="bg-gray-100 p-2 rounded-md">
            <span className="text-xs font-bold">필터 ⚙️</span>
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from 'react';
import VotingCard from '@/components/voting/VotingCard';
import LiveResults from '@/components/dashboard/LiveResults';
import SlackCardTemplate from '@/components/chatbot/SlackCardTemplate';
import RestaurantMap from '@/components/map/RestaurantMap';

export default function MobileAppPage() {
  const [activeTab, setActiveTab] = useState<'vote' | 'result' | 'share'>('vote');

  // 더미 데이터
  const [restaurants, setRestaurants] = useState([
    { id: 1, name: "스시 오마카세", category: "일식", rating: 4.8, image: "https://via.placeholder.com/300x400/FF5A5F/FFFFFF?text=Sushi" },
    { id: 2, name: "다운타우너", category: "수제버거", rating: 4.5, image: "https://via.placeholder.com/300x400/00A699/FFFFFF?text=Burger" },
    { id: 3, name: "명동교자", category: "한식", rating: 4.7, image: "https://via.placeholder.com/300x400/FC642D/FFFFFF?text=Noodle" },
  ]);

  const handleSwipe = (direction: 'left' | 'right') => {
    console.log(`Swiped ${direction}`);
    // 카드 제거 로직 (UI 시연용 단순 제거)
    setRestaurants(prev => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-0 md:pt-10">
      {/* 모바일 컨테이너 시뮬레이션 */}
      <div className="w-full max-w-md bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[844px] flex flex-col relative border-8 border-gray-900 md:border-gray-800">
        
        {/* 상단 노치 영역 (Design Decoration) */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-2xl z-50"></div>

        {/* 헤더 */}
        <header className="pt-12 pb-4 px-6 flex justify-between items-center bg-white z-10">
          <h1 className="text-xl font-extrabold text-gray-900">
            Lunch<span className="text-primary">Pick</span>
          </h1>
          <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
             <img src="https://via.placeholder.com/32" alt="User" />
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 relative bg-background rounded-t-3xl overflow-y-auto">
          
          {/* 탭 1: 투표 인터페이스 */}
          {activeTab === 'vote' && (
            <div className="h-full flex flex-col p-6">
              <div className="flex-1 relative mb-6">
                {restaurants.length > 0 ? (
                  restaurants.map((rest, index) => (
                    <VotingCard 
                      key={rest.id} 
                      data={rest} 
                      onSwipe={handleSwipe} 
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-lg font-bold text-gray-400">투표 완료! 🎉</p>
                    <button 
                      onClick={() => setActiveTab('result')}
                      className="mt-4 px-6 py-3 bg-primary text-white rounded-full font-bold shadow-lg"
                    >
                      결과 확인하기
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-auto">
                 <RestaurantMap />
              </div>
            </div>
          )}

          {/* 탭 2: 결과 대시보드 */}
          {activeTab === 'result' && (
            <div className="p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">투표 결과</h2>
              <LiveResults />
              <div className="bg-white p-4 rounded-xl shadow-card">
                 <h3 className="font-bold mb-2">참여자 코멘트</h3>
                 <div className="space-y-2">
                    <div className="text-sm p-2 bg-gray-50 rounded">"오늘은 깔끔한게 땡겨요" - 김디자이너</div>
                    <div className="text-sm p-2 bg-gray-50 rounded">"웨이팅 없는 곳으로..." - 이개발자</div>
                 </div>
              </div>
            </div>
          )}

          {/* 탭 3: 공유/챗봇 */}
          {activeTab === 'share' && (
            <div className="p-6 flex flex-col items-center justify-center h-full space-y-8">
              <div className="text-center">
                 <h2 className="text-xl font-bold mb-2">팀원들에게 공유하기</h2>
                 <p className="text-gray-500 text-sm">메신저에 최적화된 카드를 전송합니다.</p>
              </div>
              <SlackCardTemplate />
              <button className="w-full bg-[#4A154B] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                 Slack으로 전송
              </button>
            </div>
          )}
        </main>

        {/* 하단 네비게이션 (Tab Bar) */}
        <nav className="bg-surface px-6 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-20">
          <ul className="flex justify-between items-center">
            <li>
              <button 
                onClick={() => setActiveTab('vote')}
                className={`flex flex-col items-center space-y-1 ${activeTab === 'vote' ? 'text-primary' : 'text-gray-400'}`}
              >
                <span className="text-2xl">🗳️</span>
                <span className="text-[10px] font-bold">투표</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('result')}
                className={`flex flex-col items-center space-y-1 ${activeTab === 'result' ? 'text-primary' : 'text-gray-400'}`}
              >
                <span className="text-2xl">📊</span>
                <span className="text-[10px] font-bold">결과</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('share')}
                className={`flex flex-col items-center space-y-1 ${activeTab === 'share' ? 'text-primary' : 'text-gray-400'}`}
              >
                <span className="text-2xl">💬</span>
                <span className="text-[10px] font-bold">공유</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}