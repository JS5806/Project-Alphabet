import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getRestaurants, createVoteRoom } from '@/api/mockService';
import { cn } from '@/lib/utils';
import { Loader2, Check } from 'lucide-react';

// Validation Schema
const formSchema = z.object({
  title: z.string().min(2, "제목은 최소 2글자 이상이어야 합니다."),
});

export default function CreateRoom() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 식당 목록 조회
  const { data: restaurants, isLoading: isListLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: getRestaurants,
  });

  // 방 생성 Mutation
  const createRoomMutation = useMutation({
    mutationFn: async (data: { title: string; ids: string[] }) => {
      return createVoteRoom(data.title, data.ids);
    },
    onSuccess: (roomId) => {
      navigate(`/vote/${roomId}`); // 생성 후 투표 화면으로 이동
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<{ title: string }>({
    resolver: zodResolver(formSchema),
  });

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const onSubmit = (data: { title: string }) => {
    if (selectedIds.length < 2) {
      alert("최소 2개의 식당을 선택해주세요.");
      return;
    }
    createRoomMutation.mutate({ title: data.title, ids: selectedIds });
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">투표 방 만들기</h2>
        <p className="text-secondary text-sm">주제와 후보 식당을 선택하세요.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">투표 제목</label>
          <input
            {...register('title')}
            placeholder="예: 12/25 점심 메뉴 선정"
            className="input"
          />
          {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">후보 식당 선택 ({selectedIds.length})</label>
          
          {isListLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
              {restaurants?.map((rest) => {
                const isSelected = selectedIds.includes(rest.id);
                return (
                  <div
                    key={rest.id}
                    onClick={() => toggleSelection(rest.id)}
                    className={cn(
                      "card p-4 cursor-pointer transition-all flex justify-between items-center hover:border-slate-400",
                      isSelected ? "border-primary ring-1 ring-primary bg-slate-50" : ""
                    )}
                  >
                    <div>
                      <h4 className="font-semibold">{rest.name}</h4>
                      <span className="text-xs text-secondary bg-slate-100 px-2 py-0.5 rounded">{rest.category}</span>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-primary" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={createRoomMutation.isPending}
          className="btn btn-primary w-full"
        >
          {createRoomMutation.isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 생성 중...</>
          ) : (
            '투표 방 생성하기'
          )}
        </button>
      </form>
    </div>
  );
}