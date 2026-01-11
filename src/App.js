import React from 'react';
import VoteButton from './components/VoteButton';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1 className="title">오늘 점심 뭐 먹지?</h1>
      <VoteButton />
    </div>
  );
}

export default App;