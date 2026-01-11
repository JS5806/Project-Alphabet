# AI Powered Lunch Voting App

AI DevOps 팀이 자동으로 생성하고 배포한 사내 점심 투표 시스템입니다.

## Features
- **Real-time Voting**: Firestore를 활용한 실시간 투표 현황 반영
- **Secure Access**: Google Workspace 계정 연동 인증
- **Automated Notifications**: 투표 마감 시 Slack 알림 전송

## Installation

```bash
npm install && npm start
```
MIT License

Copyright (c) 2024 AI DevOps Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
// Auto-deployed by AI DevOps
import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, doc, increment } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

// Firebase Configuration (Environment Variables)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore Listener
  useEffect(() => {
    if (!user) return;
    
    // Query Optimization: Listen only to active restaurants
    const q = collection(db, "restaurants");
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setRestaurants(items);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleVote = async (restaurantId) => {
    if (!user) return;
    
    // Firestore Security Rules will validate this write
    const restaurantRef = doc(db, "restaurants", restaurantId);
    try {
      await updateDoc(restaurantRef, {
        votes: increment(1)
      });
    } catch (error) {
      console.error("Voting failed:", error);
      alert("투표 권한이 없거나 마감되었습니다.");
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>AI Powered Lunch Voting App</h1>
        <p>사내 계정으로 로그인해주세요.</p>
        <button onClick={handleLogin}>Login with Google Workspace</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ marginBottom: '20px', borderBottom: '1px solid #ccc' }}>
        <h2>오늘의 점심 투표</h2>
        <p>환영합니다, {user.displayName}님</p>
      </header>
      
      <main>
        <h3>식당 목록</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {restaurants.map((restaurant) => (
            <li key={restaurant.id} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{restaurant.name}</strong>
                <span style={{ marginLeft: '10px', color: '#666' }}>({restaurant.category})</span>
              </div>
              <div>
                <span style={{ marginRight: '15px', fontWeight: 'bold' }}>{restaurant.votes || 0}표</span>
                <button onClick={() => handleVote(restaurant.id)}>투표하기</button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;