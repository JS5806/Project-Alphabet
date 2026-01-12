import React from 'react';
import { useMenuStore } from '../store/menuStore';

export const ResultDisplay: React.FC = () => {
  const { selectedMenu, noCandidatesFound, pickRandomMenu, clearHistory } = useMenuStore();

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center min-h-[300px] flex flex-col justify-center items-center border border-gray-100">
      {/* 1. 결과가 선택되었을 때 */}
      {selectedMenu && !noCandidatesFound && (
        <div className="animate-fade-in-up">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold mb-4">
            {selectedMenu.category}
          </span>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedMenu.name}</h2>
          <p className="text-gray-500 mb-8">{selectedMenu.description}</p>
        </div>
      )}

      {/* 2. Empty State (필터 조건 + 기록 제외로 후보가 없을 때) */}
      {noCandidatesFound && (
        <div className="text-center animate-pulse">
          <div className="text-5xl mb-4">🍽️ 🚫</div>
          <h3 className="text-xl font-bold text-red-500 mb-2">추천할 메뉴가 없어요!</h3>
          <p className="text-gray-500 mb-6 text-sm">
            선택한 카테고리의 모든 메뉴를 최근에 드셨네요.<br />
            다른 카테고리를 선택하거나 기록을 초기화해보세요.
          </p>
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition"
          >
            최근 기록 초기화하기
          </button>
        </div>
      )}

      {/* 3. 초기 상태 */}
      {!selectedMenu && !noCandidatesFound && (
        <div>
          <div className="text-5xl mb-4">🎲</div>
          <p className="text-gray-400 text-lg">오늘은 무엇을 먹을까요?</p>
        </div>
      )}

      {/* 공통 실행 버튼 */}
      {!noCandidatesFound && (
        <button
          onClick={pickRandomMenu}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition transform active:scale-95 shadow-lg"
        >
          {selectedMenu ? '다른 메뉴 다시 뽑기' : '메뉴 추천 받기'}
        </button>
      )}
    </div>
  );
};