import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MenuItem } from '../types';

// Mock API Functions
const fetchMenus = async (): Promise<MenuItem[]> => {
  // 실제 API 호출: return axios.get('/api/menus').then(res => res.data);
  return new Promise((resolve) => 
    setTimeout(() => resolve([
      { id: '1', name: '김치찌개', description: '얼큰한 맛', price: 8000 },
      { id: '2', name: '제육볶음', description: '불맛 가득', price: 9000 },
    ]), 500)
  );
};

const createMenu = async (newMenu: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
  return new Promise((resolve) => 
    setTimeout(() => resolve({ ...newMenu, id: Math.random().toString() }), 500)
  );
};

const deleteMenu = async (id: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => resolve(), 300));
}

export const useMenus = () => {
  return useQuery({
    queryKey: ['menus'],
    queryFn: fetchMenus,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
};

export const useDeleteMenu = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deleteMenu,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['menus'] });
      },
    });
  };