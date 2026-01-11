import React from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          사내 점심 투표 시스템
        </h1>
        <p className="mb-8 text-center text-gray-500">
          사내 계정으로 로그인하여 투표에 참여하세요.
        </p>
        <button
          onClick={login}
          className="w-full rounded bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          사내 통합 계정으로 로그인 (OAuth 2.0)
        </button>
      </div>
    </div>
  );
};

export default LoginPage;