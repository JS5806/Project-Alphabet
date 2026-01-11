import React from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/services';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.accessToken);
      navigate('/');
    },
    onError: () => {
      alert('로그인에 실패했습니다.');
    }
  });

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          점심 메뉴 투표 시스템
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          사내 계정으로 로그인해주세요
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? '로그인 중...' : 'SSO 로그인'}
        </button>
      </div>
    </div>
  );
}