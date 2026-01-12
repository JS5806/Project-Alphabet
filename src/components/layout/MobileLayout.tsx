import React from 'react';
import { Outlet } from 'react-router-dom';

// UX: 데스크톱에서도 모바일 뷰포트를 유지하여 일관된 경험 제공 (최대 너비 480px)
export const MobileLayout = () => {
  return (
    <div className="w-full max-w-[480px] h-full bg-neutral-50 min-h-screen shadow-2xl overflow-y-auto flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-5 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">VOTE APP</h1>
      </header>
      
      <main className="flex-1 p-5 pb-10">
        <Outlet />
      </main>

      <footer className="py-4 text-center text-xs text-neutral-400">
        Designed for Mobile Experience
      </footer>
    </div>
  );
};