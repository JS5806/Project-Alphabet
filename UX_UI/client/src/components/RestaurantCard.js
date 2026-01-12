import React from 'react';
import { motion } from 'framer-motion';
import { IoRestaurantOutline, IoCheckmarkCircle } from 'react-icons/io5';

const RestaurantCard = ({ data, isActive, onVote }) => {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={onVote}
      className={`
        relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
        flex items-center justify-between shadow-sm bg-white
        ${isActive 
          ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-200' 
          : 'border-transparent hover:border-gray-200'}
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`
          w-12 h-12 rounded-lg flex items-center justify-center text-xl
          ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}
        `}>
          <IoRestaurantOutline />
        </div>
        <div>
          <h4 className={`font-bold ${isActive ? 'text-indigo-900' : 'text-gray-800'}`}>
            {data.name}
          </h4>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
            {data.category}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`text-lg font-bold ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
          {data.votes}
        </span>
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-indigo-600 text-xl"
          >
            <IoCheckmarkCircle />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RestaurantCard;