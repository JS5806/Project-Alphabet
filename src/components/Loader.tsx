import React from 'react';
import { motion } from 'framer-motion';

/**
 * [Team Comment 반영]
 * API 응답 대기 시간을 위한 로딩 애니메이션입니다.
 * 실제 프로덕션에서는 lottie-react를 사용하여 JSON 파일을 렌더링하지만,
 * 여기서는 Framer Motion을 사용하여 코드 레벨에서 최적화된 애니메이션을 구현했습니다.
 */
const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative w-24 h-24">
        <motion.span
          className="absolute inset-0 border-4 border-gray-200 rounded-full"
        />
        <motion.span
          className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🤔
        </motion.div>
      </div>
      <motion.p
        className="text-gray-600 font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        맛있는 메뉴를 고르는 중...
      </motion.p>
    </div>
  );
};

export default Loader;