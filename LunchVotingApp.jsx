import React, { useState, useEffect } from 'react';

// [UX/UI Design Team]
// 스타일 및 테마 정의 (Dark Mode Default 요청 반영)
// CSS Variables를 사용하여 테마 전환 유연성 확보 및 Skeleton UI 애니메이션 정의
const styles = `
  :root {
    --bg-primary: #121212;
    --bg-secondary: #1E1E1E;
    --bg-tertiary: #2C2C2C;
    --text-primary: #FFFFFF;
    --text-secondary: #B3B3B3;
    --accent-color: #6C63FF;
    --success-color: #4CAF50;
    --skeleton-base: #2C2C2C;
    --skeleton-highlight: #3A3A3A;
    --border-radius: 12px;
    --transition: all 0.3s ease;
  }

  body {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    transition: var(--transition);
  }

  .app-container {
    max-width: 480px; /* 모바일 환경 최적화 */
    margin: 0 auto;
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
  }

  /* Header & Clock */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: var(--border-radius);
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  }

  .clock {
    font-size: 1.2rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--accent-color);
  }

  /* SSO Login UI */
  .login-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 32px;
  }

  .sso-btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: var(--border-radius);
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: var(--transition);
  }

  .google-btn { background: #FFFFFF; color: #333; }
  .slack-btn { background: #4A154B; color: #FFF; }
  
  /* Voting Cards */
  .section-title {
    font-size: 1.1rem;
    margin-bottom: 16px;
    color: var(--text-secondary);
  }

  .card-grid {
    display: grid;
    gap: 16px;
  }

  .vote-card {
    background: var(--bg-secondary);
    padding: 20px;
    border-radius: var(--border-radius);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid transparent;
    cursor: pointer;
    transition: var(--transition);
  }

  .vote-card:active { transform: scale(0.98); }
  .vote-card.selected { border-color: var(--accent-color); background: var(--bg-tertiary); }

  /* Dashboard / Graphs */
  .result-bar-container {
    height: 8px;
    background: var(--bg-tertiary);
    border-radius: 4px;
    overflow: hidden;
    margin-top: 8px;
    width: 100%;
  }

  .result-bar-fill {
    height: 100%;
    background: var(--accent-color);
    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Skeleton UI Animation */
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .skeleton {
    background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-highlight) 50%, var(--skeleton-base) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: var(--border-radius);
  }

  .skeleton-text { height: 20px; width: 60%; margin-bottom: 8px; }
  .skeleton-card { height: 80px; width: 100%; }

`;

// [Component] 시계 기능 (긴급 요청 사항 반영)
const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="clock">
      {time.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit' })}
    </div>
  );
};

// [Component] 스켈레톤 로딩 UI (개발팀 협의 사항 반영)
const SkeletonLoader = () => (
  <div className="card-grid">
    <div className="skeleton skeleton-card" />
    <div className="skeleton skeleton-card" />
    <div className="skeleton skeleton-card" />
  </div>
);

// [Main App]
export default function LunchVotingApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [votes, setVotes] = useState({ '한식': 30, '일식': 15, '양식': 10 });
  const [selectedMenu, setSelectedMenu] = useState(null);

  // 데이터 로딩 시뮬레이션
  const handleVote = (menu) => {
    if (selectedMenu === menu) return;
    setLoading(true); // 시각적 피드백 지연 최소화를 위한 로딩 상태
    setTimeout(() => {
      setSelectedMenu(menu);
      setVotes(prev => ({ ...prev, [menu]: prev[menu] + 1 }));
      setLoading(false);
    }, 800);
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        {/* Header Area */}
        <header className="header">
          <div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Today's Lunch</span>
            <h1 style={{ margin: 0, fontSize: '1.2rem' }}>점심 메뉴 투표</h1>
          </div>
          <Clock />
        </header>

        {!isLoggedIn ? (
          /* Login Screen */
          <div className="login-container">
            <p style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-secondary)' }}>
              사내 계정으로 간편하게 참여하세요
            </p>
            <button className="sso-btn google-btn" onClick={() => setIsLoggedIn(true)}>
              <span>G</span> Google 계정으로 계속
            </button>
            <button className="sso-btn slack-btn" onClick={() => setIsLoggedIn(true)}>
              <span>#</span> Slack 계정으로 계속
            </button>
          </div>
        ) : (
          /* Main Voting Interface */
          <main>
            {/* Recommendation / List Section */}
            <section style={{ marginBottom: '32px' }}>
              <h2 className="section-title">추천 메뉴 (Card UI)</h2>
              {loading ? (
                <SkeletonLoader />
              ) : (
                <div className="card-grid">
                  {Object.keys(votes).map((menu) => {
                    const percentage = Math.round((votes[menu] / totalVotes) * 100) || 0;
                    return (
                      <div 
                        key={menu}
                        className={`vote-card ${selectedMenu === menu ? 'selected' : ''}`}
                        onClick={() => handleVote(menu)}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{menu}</strong>
                            <span>{percentage}%</span>
                          </div>
                          {/* Real-time Dashboard Graph */}
                          <div className="result-bar-container">
                            <div 
                              className="result-bar-fill" 
                              style={{ width: `${percentage}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* List View Section */}
            <section>
              <h2 className="section-title">실시간 현황</h2>
              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--border-radius)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid var(--bg-tertiary)' }}>
                    🔥 한식 팀이 1위 달리는 중
                  </li>
                  <li style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>
                    💬 개발팀: "오늘은 국밥 어때요?"
                  </li>
                </ul>
              </div>
            </section>
          </main>
        )}
      </div>
    </>
  );
}