import React, { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import io from 'socket.io-client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { apiClient } from '../lib/axios';
import { Restaurant, VoteUpdatePayload } from '../types';

// Socket 서버 URL
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000';

const fetchVoteData = async (): Promise<Restaurant[]> => {
  // 실제 API: const { data } = await apiClient.get('/restaurants/votes');
  // return data;
  
  // Mock Data
  return [
    { id: '1', name: '김밥천국', category: '한식', description: '', votes: 12 },
    { id: '2', name: '스시마루', category: '일식', description: '', votes: 8 },
    { id: '3', name: '버거킹', category: '패스트푸드', description: '', votes: 15 },
  ];
};

export const VotePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: restaurants, isLoading } = useQuery(['votes'], fetchVoteData);
  
  // Socket 연결 및 이벤트 리스닝
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('token') },
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    // [최적화 포인트]
    // 실시간 투표 업데이트 시 전체 refetch 대신 캐시된 데이터만 부분 업데이트
    socket.on('vote_update', (payload: VoteUpdatePayload) => {
      queryClient.setQueryData<Restaurant[]>(['votes'], (oldData) => {
        if (!oldData) return [];
        return oldData.map((res) =>
          res.id === payload.restaurantId ? { ...res, votes: payload.votes } : res
        );
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  const handleVote = async (id: string) => {
    try {
      // API 호출로 투표 처리 -> 서버가 처리 후 socket emit -> 위 useEffect에서 수신
      // await apiClient.post(`/votes/${id}`);
      
      // Mocking Socket behavior locally for demo
      console.log(`Voted for ${id}`);
      // 로컬 시뮬레이션 (실제로는 서버 소켓 이벤트로 처리됨)
      queryClient.setQueryData<Restaurant[]>(['votes'], (oldData) => {
        if (!oldData) return [];
        return oldData.map((res) =>
          res.id === id ? { ...res, votes: res.votes + 1 } : res
        );
      });
    } catch (error) {
      console.error('Vote failed', error);
    }
  };

  // 차트 데이터 정렬 (투표순)
  const chartData = useMemo(() => {
    if (!restaurants) return [];
    return [...restaurants].sort((a, b) => b.votes - a.votes);
  }, [restaurants]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (isLoading) return <div className="flex justify-center p-10">데이터 불러오는 중...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">실시간 점심 메뉴 투표 📊</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 왼쪽: 투표 리스트 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">투표하기</h2>
          <div className="space-y-4">
            {restaurants?.map((res) => (
              <div key={res.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div>
                  <div className="font-bold text-lg">{res.name}</div>
                  <div className="text-sm text-gray-500">{res.category}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-blue-600">{res.votes}표</span>
                  <button
                    onClick={() => handleVote(res.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 active:scale-95 transition transform"
                  >
                    투표 👆
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 실시간 차트 */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">실시간 현황</h2>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 14, fontWeight: 'bold' }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="votes" radius={[0, 10, 10, 0]} barSize={30}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};