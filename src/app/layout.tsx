NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export interface Restaurant {
  id: string;
  name: string;
  category: string;
  votes: number;
}
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json({ error: "Server config error" }, { status: 500 });
    }

    await axios.post(webhookUrl, {
      text: message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
"use client";

import { useState } from "react";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Restaurant } from "@/types";

interface Props {
  restaurants: Restaurant[];
}

export default function RestaurantManager({ restaurants }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Korean");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await addDoc(collection(db, "restaurants"), {
        name,
        category,
        votes: 0,
      });
      setName("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "restaurants", id));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">🍽️ 식당 리스트 관리</h2>
      
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="식당 이름"
          className="border p-2 rounded flex-1"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="Korean">한식</option>
          <option value="Chinese">중식</option>
          <option value="Japanese">일식</option>
          <option value="Western">양식</option>
          <option value="Etc">기타</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          등록
        </button>
      </form>

      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {restaurants.map((rest) => (
          <li key={rest.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <span className="font-medium">{rest.name}</span>
              <span className="text-sm text-gray-500 ml-2">({rest.category})</span>
            </div>
            <button
              onClick={() => handleDelete(rest.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
"use client";

import { updateDoc, doc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Restaurant } from "@/types";
import axios from "axios";

interface Props {
  restaurants: Restaurant[];
}

export default function VotingDashboard({ restaurants }: Props) {
  const totalVotes = restaurants.reduce((acc, cur) => acc + cur.votes, 0);

  const handleVote = async (id: string) => {
    const ref = doc(db, "restaurants", id);
    await updateDoc(ref, { votes: increment(1) });
  };

  const handleNotify = async () => {
    if (restaurants.length === 0) return;
    
    const sorted = [...restaurants].sort((a, b) => b.votes - a.votes);
    const winner = sorted[0];
    const message = `📢 투표 결과 확정!\n\n🏆 1위: *${winner.name}* (${winner.votes}표)\n총 참여: ${totalVotes}명`;

    try {
      await axios.post("/api/slack", { message });
      alert("Slack으로 결과가 전송되었습니다.");
    } catch (error) {
      alert("전송 실패");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📊 실시간 투표 현황</h2>
        <button 
          onClick={handleNotify}
          className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700"
        >
          Slack 전송
        </button>
      </div>

      <div className="space-y-4">
        {restaurants.map((rest) => {
          const percentage = totalVotes > 0 ? (rest.votes / totalVotes) * 100 : 0;
          return (
            <div key={rest.id} className="relative">
              <div className="flex justify-between mb-1 text-sm">
                <span>{rest.name}</span>
                <span className="font-bold">{rest.votes}표 ({percentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative group cursor-pointer" onClick={() => handleVote(rest.id)}>
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 text-white text-xs font-bold transition-opacity">
                  클릭하여 투표
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Restaurant } from "@/types";

interface Props {
  restaurants: Restaurant[];
}

export default function RandomPicker({ restaurants }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const pickRandom = () => {
    if (restaurants.length === 0) return;
    setIsAnimating(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * restaurants.length);
      setSelected(restaurants[randomIndex].name);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 100);
  };

  return (
    <div className="bg-indigo-50 p-6 rounded-lg shadow-inner text-center">
      <h2 className="text-lg font-bold text-indigo-900 mb-2">🎲 메뉴 결정 장애 해결사</h2>
      <div className="h-16 flex items-center justify-center">
         {selected ? (
           <span className={`text-2xl font-extrabold ${isAnimating ? 'text-gray-400' : 'text-indigo-600 scale-110 transition-transform'}`}>
             {selected}
           </span>
         ) : (
           <span className="text-gray-400">버튼을 눌러주세요</span>
         )}
      </div>
      <button
        onClick={pickRandom}
        disabled={isAnimating || restaurants.length === 0}
        className="mt-2 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
      >
        {isAnimating ? "추첨 중..." : "랜덤 뽑기"}
      </button>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Restaurant } from "@/types";
import RestaurantManager from "@/components/RestaurantManager";
import VotingDashboard from "@/components/VotingDashboard";
import RandomPicker from "@/components/RandomPicker";

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  // 실시간 데이터 동기화 (Snapshot)
  useEffect(() => {
    const q = query(collection(db, "restaurants"), orderBy("votes", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Restaurant[];
      setRestaurants(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          오늘 뭐 먹지? 🍱
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <VotingDashboard restaurants={restaurants} />
            <RandomPicker restaurants={restaurants} />
          </div>
          <div>
            <RestaurantManager restaurants={restaurants} />
          </div>
        </div>
      </div>
    </main>
  );
}
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/lib/providers";

export const metadata: Metadata = {
  title: "점심 메뉴 투표",
  description: "실시간 점심 메뉴 투표 및 랜덤 추천",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}