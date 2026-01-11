import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from '../types';
import Loader from './Loader';
import { RefreshCw, Share2 } from 'lucide-react';

interface Props {
  candidates: Menu[];
  onShare: (menu: Menu) => void;
}

const SlotMachine: React.FC<Props> = ({ candidates, onShare }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Menu | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const startRoulette = () => {
    if (candidates.length === 0) return;
    
    setIsSpinning(true);
    setShowResultModal(false);
    setResult(null);

    // API 지연 시뮬레이션 (1.5초)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      setResult(candidates[randomIndex]);
      setIsSpinning(false);
      setShowResultModal(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* 슬롯 머신 메인 영역 */}
      <div className="relative w-full max-w-sm h-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 flex items-center justify-center mb-8">
        <AnimatePresence mode="wait">
          {isSpinning ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader />
            </motion.div>
          ) : !result ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-6"
            >
              <div className="text-6xl mb-4">🎰</div>
              <p className="text-gray-500">
                오늘 뭐 먹지?<br />
                <strong className="text-gray-900">버튼을 눌러 추천받으세요!</strong>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
               {/* 이 부분은 모달이 뜨기 전 잠깐 보여지는 영역이거나, 모달 닫은 후 보여질 영역 */}
               <div className="text-6xl mb-2">{result.icon}</div>
               <div className="text-gray-400 text-sm">{result.category}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Button */}
      <motion.button
        onClick={startRoulette}
        disabled={isSpinning || candidates.length === 0}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-12 py-4 rounded-full text-lg font-bold shadow-lg transition-all
          ${isSpinning 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-orange-200'
          }`}
      >
        {isSpinning ? '메뉴 선정 중...' : result ? '다시 돌리기' : '점심 메뉴 추천받기'}
      </motion.button>

      {/* 결과 모달 (팝업) */}
      <AnimatePresence>
        {showResultModal && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center relative overflow-hidden"
            >
              {/* Confetti Effect Background (Simplified CSS) */}
              <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <motion.div 
                  initial={{ rotate: -10, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="text-8xl mb-4"
                >
                  {result.icon}
                </motion.div>
                
                <h3 className="text-sm font-bold text-orange-500 tracking-wider mb-2 uppercase">Today's Pick</h3>
                <h2 className="text-3xl font-black text-gray-900 mb-6">{result.name}</h2>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResultModal(false)}
                    className="flex-1 py-3 rounded-xl bg-gray-100 font-bold text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} />
                    다시하기
                  </button>
                  <button
                    onClick={() => onShare(result)}
                    className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 size={18} />
                    공유하기
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SlotMachine;