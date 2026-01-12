import React, { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import AuthTemplate from './components/Auth/AuthTemplate';
import RealtimeDashboard from './components/Dashboard/RealtimeDashboard';

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 간단한 라우팅 처리 (MVP)
  if (!isAuthenticated) {
    return <AuthTemplate />;
  }

  return <RealtimeDashboard />;
}

export default App;