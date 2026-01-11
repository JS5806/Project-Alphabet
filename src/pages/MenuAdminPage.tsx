import React, { useState } from 'react';
import { useMenus, useCreateMenu, useDeleteMenu } from '../hooks/useMenu';

const MenuAdminPage: React.FC = () => {
  const { data: menus, isLoading } = useMenus();
  const createMutation = useCreateMenu();
  const deleteMutation = useDeleteMenu();

  const [form, setForm] = useState({ name: '', description: '', price: 0 });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 유효성 검사
    if (!form.name || !form.description || form.price <= 0) {
      setError('모든 필드를 올바르게 입력해주세요.');
      return;
    }
    setError('');
    createMutation.mutate(form, {
        onSuccess: () => setForm({ name: '', description: '', price: 0 })
    });
  };

  if (isLoading) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="mb-6 text-2xl font-bold">메뉴 등록 및 관리</h2>
      
      {/* 메뉴 등록 폼 */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">메뉴명</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">설명</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">가격</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="mt-2 w-full rounded bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {createMutation.isPending ? '등록 중...' : '메뉴 등록'}
          </button>
        </form>
      </div>

      {/* 메뉴 리스트 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menus?.map((menu) => (
          <div key={menu.id} className="relative rounded-lg border bg-white p-4 shadow-sm hover:shadow-md">
            <h3 className="text-lg font-bold">{menu.name}</h3>
            <p className="text-gray-600">{menu.description}</p>
            <p className="mt-2 font-semibold text-blue-600">{menu.price.toLocaleString()}원</p>
            <button
                onClick={() => deleteMutation.mutate(menu.id)}
                className="absolute right-4 top-4 text-red-500 hover:text-red-700"
            >
                삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuAdminPage;