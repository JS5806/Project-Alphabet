import React from 'react';
import { motion } from 'framer-motion';
import { RiKakaoTalkFill, RiGoogleFill } from 'react-icons/ri';
import { IoFastFoodOutline } from 'react-icons/io5';

const Login = ({ onLogin }) => {
  const handleSocialLogin = (provider) => {
    // 실제 OAuth 연동 대신 Mock 데이터 사용
    const mockUser = {
      id: Date.now(),
      name: provider === 'Kakao' ? '김카카오' : 'John Google',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      provider
    };
    onLogin(mockUser);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-12"
      >
        <div className="bg-white p-4 rounded-full shadow-lg mb-4">
          <IoFastFoodOutline className="text-4xl text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">오늘 뭐 먹지?</h1>
        <p className="text-indigo-100 text-center text-sm opacity-80">
          팀원들과 함께 점심 메뉴를 결정해보세요.<br/>실시간 투표로 빠르게 결정!
        </p>
      </motion.div>

      <div className="w-full space-y-3">
        <button 
          onClick={() => handleSocialLogin('Kakao')}
          className="w-full bg-[#FEE500] text-[#3c1e1e] py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-yellow-300 transition-colors"
        >
          <RiKakaoTalkFill className="text-xl" />
          카카오로 3초 만에 시작하기
        </button>
        
        <button 
          onClick={() => handleSocialLogin('Google')}
          className="w-full bg-white text-gray-700 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-gray-50 transition-colors"
        >
          <RiGoogleFill className="text-xl text-red-500" />
          Google 계정으로 계속하기
        </button>
      </div>
    </div>
  );
};

export default Login;