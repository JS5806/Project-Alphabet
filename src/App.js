// Auto-deployed by AI DevOps
import React, { useState } from 'react';
import './App.css';

function App() {
  const [votes, setVotes] = useState({
    korean: 0,
    chinese: 0,
    japanese: 0,
    western: 0
  });

  const handleVote = (category) => {
    setVotes(prev => ({
      ...prev,
      [category]: prev[category] + 1
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🍱 AI Powered Lunch Voting App</h1>
        <p>오늘 점심 뭐 먹지? 투표해주세요!</p>
      </header>
      <main>
        <div className="vote-container">
          <button onClick={() => handleVote('korean')}>
            한식 (Korean) - {votes.korean}표
          </button>
          <button onClick={() => handleVote('chinese')}>
            중식 (Chinese) - {votes.chinese}표
          </button>
          <button onClick={() => handleVote('japanese')}>
            일식 (Japanese) - {votes.japanese}표
          </button>
          <button onClick={() => handleVote('western')}>
            양식 (Western) - {votes.western}표
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;