import React, { useState, useEffect, useMemo } from 'react';
import io from 'socket.io-client';
import { Plus, Utensils, Clock, ThumbsUp, LogIn, X } from 'lucide-react';

// --- Socket 연결 ---
const socket = io('http://localhost:3001');

// --- Components ---

// 1. 로그인 화면 (Mock SSO)
const LoginScreen = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary to-purple-600 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
        <div className="bg-indigo-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Utensils className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">오늘 뭐 먹지?</h1>
        <p className="text-gray-500 mb-8">사내 점심 메뉴 투표 시스템</p>
        
        <button 
          onClick={() => onLogin('google')}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors mb-3 shadow-sm"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Google 계정으로 계속하기
        </button>
        <button 
          onClick={() => onLogin('company')}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm"
        >
          사내 이메일로 로그인
        </button>
      </div>
    </div>
  );
};

// 2. 메뉴 등록 모달
const AddMenuModal = ({ isOpen, onClose }) => {
  const [restaurant, setRestaurant] = useState('');
  const [menu, setMenu] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!restaurant || !menu) return;

    socket.emit('add_menu', { restaurant, menu, note });
    
    // 초기화 및 닫기
    setRestaurant('');
    setMenu('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">새 메뉴 제안</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">식당명</label>
            <input 
              type="text" 
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              placeholder="예: 맥도날드" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">메뉴명</label>
            <input 
              type="text" 
              value={menu}
              onChange={(e) => setMenu(e.target.value)}
              placeholder="예: 빅맥 세트" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">메모 (선택)</label>
            <input 
              type="text" 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="예: 오늘은 내가 쏜다!" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 mt-2"
          >
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
};

// 3. 메인 앱
const LunchVoteApp = ({ user }) => {
  const [menus, setMenus] = useState([]);
  const [deadline, setDeadline] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 낙관적 UI 업데이트를 위한 로컬 상태 추적
  const [votedId, setVotedId] = useState(null); 

  useEffect(() => {
    // 초기 데이터 수신
    socket.on('init_data', (data) => {
      setMenus(data.menuItems);
      setDeadline(new Date(data.deadline));
    });

    // 메뉴 추가 수신
    socket.on('menu_added', (newMenu) => {
      setMenus((prev) => [...prev, newMenu]);
    });

    // 투표 업데이트 수신
    socket.on('vote_update', (updatedMenus) => {
      setMenus(updatedMenus);
    });

    return () => {
      socket.off('init_data');
      socket.off('menu_added');
      socket.off('vote_update');
    };
  }, []);

  // 타이머 로직
  useEffect(() => {
    if (!deadline) return;
    const interval = setInterval(() => {
      const now = new Date();
      const diff = deadline - now;
      if (diff <= 0) {
        setTimeLeft("투표 종료");
        clearInterval(interval);
      } else {
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${m}분 ${s}초 남음`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  // 총 투표수 계산
  const totalVotes = useMemo(() => menus.reduce((acc, curr) => acc + curr.votes, 0), [menus]);

  // 투표 핸들러 (낙관적 UI 적용)
  const handleVote = (id) => {
    if (votedId === id) return; // 이미 투표한 항목 중복 방지 (간단 로직)
    
    // 1. UI 즉시 업데이트 (Optimistic Update)
    setMenus((prev) => 
      prev.map(item => item.id === id ? { ...item, votes: item.votes + 1 } : item)
    );
    setVotedId(id);

    // 2. 서버 전송
    socket.emit('vote', id);
  };

  // 1등 메뉴 찾기 (Dashboard용)
  const topMenu = useMemo(() => {
    if (menus.length === 0) return null;
    return menus.reduce((prev, current) => (prev.votes > current.votes) ? prev : current);
  }, [menus]);

  return (
    <div className="min-h-screen pb-20 md:pb-8 max-w-2xl mx-auto bg-gray-50 relative shadow-2xl min-h-screen-ios">
      
      {/* --- Header & Dashboard --- */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <div className="px-5 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">점심 투표</h1>
            <p className="text-xs text-gray-500 font-medium">{user.name}님 환영합니다</p>
          </div>
          <div className="flex items-center gap-2 bg-red-50 text-red-500 px-3 py-1.5 rounded-full text-sm font-bold animate-pulse">
            <Clock size={16} />
            <span>{timeLeft || '로딩중...'}</span>
          </div>
        </div>

        {/* 실시간 대시보드 */}
        <div className="px-5 pb-4">
          <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium opacity-80">현재 1위</span>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">총 {totalVotes}표</span>
            </div>
            {topMenu ? (
              <div>
                <h2 className="text-2xl font-bold leading-tight">{topMenu.restaurant}</h2>
                <p className="opacity-90">{topMenu.menu}</p>
              </div>
            ) : (
              <p className="text-lg font-medium opacity-80">아직 등록된 메뉴가 없습니다.</p>
            )}
            
            {/* 시각적 그래프 바 */}
            {topMenu && totalVotes > 0 && (
              <div className="w-full bg-black/20 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-white h-full transition-all duration-500 ease-out"
                  style={{ width: `${(topMenu.votes / totalVotes) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- List View --- */}
      <main className="p-5 space-y-4">
        {menus.sort((a, b) => b.votes - a.votes).map((item) => (
          <div 
            key={item.id} 
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-800 text-lg">{item.restaurant}</span>
                {item.id === topMenu?.id && item.votes > 0 && (
                  <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">BEST</span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-1">{item.menu}</p>
              {item.note && <p className="text-gray-400 text-xs truncate">Current Note: {item.note}</p>}
            </div>

            <button 
              onClick={() => handleVote(item.id)}
              className={`vote-anim group flex flex-col items-center justify-center min-w-[60px] h-[60px] rounded-2xl border transition-colors ${
                votedId === item.id 
                ? 'bg-primary border-primary text-white' 
                : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-primary hover:text-primary'
              }`}
            >
              <ThumbsUp size={20} className={votedId === item.id ? 'fill-current' : ''} />
              <span className="text-xs font-bold mt-1">{item.votes}</span>
            </button>
          </div>
        ))}
        
        {menus.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p>아직 등록된 메뉴가 없습니다.</p>
            <p className="text-sm">첫 번째 메뉴를 추천해보세요!</p>
          </div>
        )}
      </main>

      {/* --- FAB (Floating Action Button) --- */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-20"
      >
        <Plus size={28} />
      </button>

      {/* --- Modal --- */}
      <AddMenuModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (provider) => {
    // 실제 구현에서는 OAuth 리다이렉트 로직 필요
    // 여기서는 데모를 위해 가상 유저 생성
    setUser({
      id: 'user_123',
      name: '김개발',
      email: 'dev@company.com',
      provider
    });
  };

  return (
    <>
      {!user ? <LoginScreen onLogin={handleLogin} /> : <LunchVoteApp user={user} />}
    </>
  );
}