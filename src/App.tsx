import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Home from '@/pages/Home';
import CreateRoom from '@/pages/CreateRoom';
import VoteRoom from '@/pages/VoteRoom';
import Result from '@/pages/Result';

// React Query Client 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 개발 편의성을 위해 비활성화
    },
  },
});

// Layout Component (Mobile Container)
function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen shadow-xl border-x border-slate-100 p-6">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateRoom />} />
            <Route path="/vote/:roomId" element={<VoteRoom />} />
            <Route path="/result/:roomId" element={<Result />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;