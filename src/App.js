import React, { useState, useEffect } from "react";
import { auth, provider, db } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  increment, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from "firebase/firestore";
import { format } from "date-fns";
import "./App.css";

// 초기 데이터 시딩용 (DB가 비어있을 때 사용)
const INITIAL_RESTAURANTS = [
  { name: "한솥 도시락", menu: "치킨마요, 돈까스도련님", location: "본관 1층 로비 옆" },
  { name: "전주 콩나물국밥", menu: "콩나물국밥, 오징어젓갈", location: "별관 지하 1층" },
  { name: "스시 마이우", menu: "런치 초밥 세트 A/B", location: "외부 - 도보 5분거리" },
  { name: "맘스터치", menu: "싸이버거 세트", location: "본관 2층 휴게실 옆" },
];

function App() {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedId, setVotedId] = useState(null);
  
  // 오늘 날짜 포맷 (하루 1회 투표 제한용)
  const today = format(new Date(), "yyyy-MM-dd");

  // 1. 사용자 인증 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await checkUserVoteStatus(currentUser.uid);
      } else {
        setHasVoted(false);
        setVotedId(null);
      }
    });
    return () => unsubscribe();
  }, [today]); // 날짜가 바뀌면 상태 재확인

  // 2. 식당 리스트 실시간 구독 및 데이터 시딩
  useEffect(() => {
    const q = query(collection(db, "restaurants"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // 데이터가 없으면 시딩 (MVP 편의성)
        seedData();
      } else {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // 투표수 내림차순 정렬
        setRestaurants(list.sort((a, b) => (b.votes || 0) - (a.votes || 0)));
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const seedData = async () => {
    INITIAL_RESTAURANTS.forEach(async (rest) => {
      await setDoc(doc(collection(db, "restaurants")), {
        ...rest,
        votes: 0,
        createdAt: serverTimestamp()
      });
    });
  };

  // 3. 사용자의 오늘 투표 여부 확인
  const checkUserVoteStatus = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      if (data.lastVotedDate === today) {
        setHasVoted(true);
        setVotedId(data.votedRestaurantId);
      } else {
        setHasVoted(false);
        setVotedId(null);
      }
    }
  };

  // 4. 로그인 핸들러 (SSO 시뮬레이션)
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  // 5. 투표 핸들러
  const handleVote = async (restaurantId) => {
    if (!user) return alert("로그인이 필요합니다.");
    if (hasVoted) return alert("오늘은 이미 투표하셨습니다.");

    try {
      // 식당 투표수 증가
      const restaurantRef = doc(db, "restaurants", restaurantId);
      await updateDoc(restaurantRef, {
        votes: increment(1)
      });

      // 사용자 투표 기록 갱신
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        lastVotedDate: today,
        votedRestaurantId: restaurantId
      }, { merge: true });

      setHasVoted(true);
      setVotedId(restaurantId);
    } catch (error) {
      console.error("Vote failed", error);
      alert("투표 중 오류가 발생했습니다.");
    }
  };

  // 6. 투표 취소 핸들러 (선택 사항 - MVP에서는 단순화를 위해 생략하거나 간단히 구현)
  // 현재 MVP 스펙상 '1일 1회 투표권 부여' 이므로 취소/재투표 로직은 복잡도 감소를 위해 제외.

  if (loading) return <div className="loading-container">Loading Lunch Data...</div>;

  const topRestaurant = restaurants.length > 0 ? restaurants[0] : null;
  const isVotingClosed = false; // 실제로는 시간을 체크하여 true로 변경 (예: 11:30 AM)

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div>
          <h1>🍚 오늘 뭐 먹지?</h1>
          <span style={{ fontSize: '14px', color: '#6B7280' }}>
            {today} | 사내 점심 투표 시스템
          </span>
        </div>
        <div className="user-info">
          {user ? (
            <>
              {user.photoURL && <img src={user.photoURL} alt="Profile" className="user-avatar" />}
              <span style={{fontSize:'14px', fontWeight:'500'}}>{user.displayName}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <button onClick={handleLogin} className="btn-login">사내 계정 로그인</button>
          )}
        </div>
      </header>

      {/* Result Dashboard (투표 종료 후 혹은 실시간 1등 표시) */}
      {topRestaurant && (topRestaurant.votes > 0) && (
        <section className="winner-section">
          <span className="winner-badge">현재 1위 🔥</span>
          <h2 style={{ margin: '10px 0', fontSize: '28px', color: '#111827' }}>
            {topRestaurant.name}
          </h2>
          <p style={{ margin: 0, color: '#4B5563' }}>
            {topRestaurant.menu} ({topRestaurant.votes}표)
          </p>
        </section>
      )}

      {/* Main List */}
      <main className="list-container">
        {restaurants.map((rest) => (
          <div key={rest.id} className="card">
            <div className="card-image">
              {/* 이미지 DB 연동 전 Placeholder */}
              {rest.name} 사진
            </div>
            <div className="card-content">
              <h3 className="card-title">{rest.name}</h3>
              <p className="card-menu">{rest.menu}</p>
              <div className="card-location">
                📍 {rest.location}
              </div>
              
              <div className="vote-action">
                <span className="vote-count">
                  {rest.votes || 0} 명 투표
                </span>
                <button 
                  className={`btn-vote ${votedId === rest.id ? 'active' : ''}`}
                  onClick={() => handleVote(rest.id)}
                  disabled={!user || (hasVoted && votedId !== rest.id) || isVotingClosed}
                >
                  {votedId === rest.id ? '투표완료' : '투표하기'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;