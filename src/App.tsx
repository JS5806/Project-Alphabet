import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import VotePage from './pages/VotePage';
import CreateVotePage from './pages/CreateVotePage';
import { useAuthStore } from './store/useAuthStore';

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <VotePage />
            </ProtectedRoute>
          } />
          
          <Route path="/create" element={
            <ProtectedRoute>
              <CreateVotePage />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;