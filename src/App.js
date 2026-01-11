// Auto-deployed by AI DevOps
import React, { useState } from 'react';
import './App.css';

function App() {
  const [votes, setVotes] = useState({
    korean: 0,
    western: 0,
    chinese: 0,
    japanese: 0
  });

  const handleVote = (category) => {
    setVotes(prev => ({
      ...prev,
      [category]: prev[category] + 1
    }));
  };

  return (
    <div className="App" style={{ textAlign: 'center', padding: '20px' }}>
      <header className="App-header">
        <h1>🍱 AI Powered Lunch Voting</h1>
        <p>오늘 점심 뭐 먹지? 투표해주세요!</p>
      </header>
      
      <main style={{ marginTop: '30px' }}>
        <div className="vote-card" style={{ margin: '10px' }}>
          <h3>🍚 한식</h3>
          <p>득표수: {votes.korean}</p>
          <button onClick={() => handleVote('korean')}>투표하기</button>
        </div>

        <div className="vote-card" style={{ margin: '10px' }}>
          <h3>🍔 양식</h3>
          <p>득표수: {votes.western}</p>
          <button onClick={() => handleVote('western')}>투표하기</button>
        </div>

        <div className="vote-card" style={{ margin: '10px' }}>
          <h3>🍜 중식</h3>
          <p>득표수: {votes.chinese}</p>
          <button onClick={() => handleVote('chinese')}>투표하기</button>
        </div>

        <div className="vote-card" style={{ margin: '10px' }}>
          <h3>🍣 일식</h3>
          <p>득표수: {votes.japanese}</p>
          <button onClick={() => handleVote('japanese')}>투표하기</button>
        </div>
      </main>
    </div>
  );
}

export default App;