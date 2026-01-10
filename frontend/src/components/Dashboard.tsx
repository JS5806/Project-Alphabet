import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery(['stock-stats'], async () => {
    const res = await fetch('/api/stock/stats');
    return res.json();
  });

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  if (isLoading) return <div className="p-8 text-center text-gray-500">데이터를 불러오는 중...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">재고 현황 대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats?.summary.map((item: any, index: number) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4" style={{ borderColor: COLORS[index] }}>
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-2xl font-bold">{item.value.toLocaleString()} 개</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">월별 만료 예정 품목</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;