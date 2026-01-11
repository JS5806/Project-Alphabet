import { Link } from 'react-router-dom';
import { Utensils, PlusCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 text-center px-4">
      <div className="space-y-4">
        <div className="bg-slate-100 p-4 rounded-full w-fit mx-auto">
          <Utensils className="w-12 h-12 text-slate-700" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          오늘 점심 뭐 먹지?
        </h1>
        <p className="text-secondary max-w-[600px]">
          팀원들과 함께 점심 메뉴를 결정하세요. <br />
          투표 방을 만들고 링크를 공유하면 끝!
        </p>
      </div>

      <div className="flex gap-4">
        <Link to="/create" className="btn btn-primary text-lg px-8 py-6 gap-2">
          <PlusCircle className="w-5 h-5" />
          투표 방 만들기
        </Link>
      </div>
    </div>
  );
}