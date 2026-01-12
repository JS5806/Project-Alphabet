import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const LiveChart = ({ data }) => {
  // 총 투표수 계산 (0으로 나누기 방지)
  const totalVotes = useMemo(() => {
    const sum = data.reduce((acc, curr) => acc + curr.votes, 0);
    return sum === 0 ? 1 : sum;
  }, [data]);

  // 투표수 순 정렬
  const sortedData = [...data].sort((a, b) => b.votes - a.votes).slice(0, 5); // 상위 5개만

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <div className="space-y-4">
        {sortedData.map((item) => {
          const percentage = Math.round((item.votes / totalVotes) * 100);
          
          return (
            <div key={item.id} className="relative">
              <div className="flex justify-between text-xs mb-1 font-medium text-gray-600">
                <span>{item.name}</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 15 }} // 부드러운 애니메이션
                  className="h-full bg-indigo-500 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveChart;