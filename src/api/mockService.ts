import { Restaurant, VoteRoom, VoteRecord, VoteResult } from "@/types";
import { generateId } from "@/lib/utils";

/**
 * Backend API Simulation
 * 실제 Axios 대신 LocalStorage를 사용하여 데이터 영속성을 보장하고
 * setTimeout을 사용하여 네트워크 지연을 흉내냅니다.
 */

// 초기 더미 데이터
const INITIAL_RESTAURANTS: Restaurant[] = [
  { id: "1", name: "김밥천국", category: "한식", description: "가성비 좋은 분식" },
  { id: "2", name: "스시로", category: "일식", description: "신선한 초밥" },
  { id: "3", name: "맥도날드", category: "양식", description: "빠른 햄버거" },
  { id: "4", name: "홍콩반점", category: "중식", description: "얼큰한 짬뽕" },
  { id: "5", name: "서브웨이", category: "양식", description: "건강한 샌드위치" },
];

const DB_KEYS = {
  RESTAURANTS: "db_restaurants",
  ROOMS: "db_rooms",
  VOTES: "db_votes",
};

// Helper: Simulate Network Delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Restaurants API ---
export const getRestaurants = async (): Promise<Restaurant[]> => {
  await delay(500);
  const stored = localStorage.getItem(DB_KEYS.RESTAURANTS);
  if (!stored) {
    localStorage.setItem(DB_KEYS.RESTAURANTS, JSON.stringify(INITIAL_RESTAURANTS));
    return INITIAL_RESTAURANTS;
  }
  return JSON.parse(stored);
};

// --- Vote Room API ---
export const createVoteRoom = async (title: string, candidateIds: string[]): Promise<string> => {
  await delay(800);
  const rooms: VoteRoom[] = JSON.parse(localStorage.getItem(DB_KEYS.ROOMS) || "[]");
  
  const newRoom: VoteRoom = {
    id: generateId(),
    title,
    candidateIds,
    createdAt: Date.now(),
    isClosed: false,
  };
  
  rooms.push(newRoom);
  localStorage.setItem(DB_KEYS.ROOMS, JSON.stringify(rooms));
  return newRoom.id;
};

export const getVoteRoom = async (roomId: string): Promise<VoteRoom> => {
  await delay(400);
  const rooms: VoteRoom[] = JSON.parse(localStorage.getItem(DB_KEYS.ROOMS) || "[]");
  const room = rooms.find((r) => r.id === roomId);
  if (!room) throw new Error("Room not found");
  return room;
};

// --- Voting API ---
export const submitVote = async (roomId: string, restaurantId: string, voterName: string) => {
  await delay(600);
  const votes: VoteRecord[] = JSON.parse(localStorage.getItem(DB_KEYS.VOTES) || "[]");
  
  // (Optional) 중복 투표 방지 로직은 MVP에서 생략하거나 LocalStorage에 Flag설정 가능
  const newVote: VoteRecord = {
    roomId,
    restaurantId,
    voterName,
    timestamp: Date.now(),
  };
  
  votes.push(newVote);
  localStorage.setItem(DB_KEYS.VOTES, JSON.stringify(votes));
  return true;
};

export const getVoteResults = async (roomId: string): Promise<VoteResult[]> => {
  await delay(300); // 짧은 딜레이 (Polling 고려)
  
  const rooms: VoteRoom[] = JSON.parse(localStorage.getItem(DB_KEYS.ROOMS) || "[]");
  const room = rooms.find(r => r.id === roomId);
  if(!room) throw new Error("Room not found");

  const votes: VoteRecord[] = JSON.parse(localStorage.getItem(DB_KEYS.VOTES) || "[]");
  const roomVotes = votes.filter((v) => v.roomId === roomId);
  
  const allRestaurants = await getRestaurants(); // 이름 매핑용

  // 집계 로직
  const result: VoteResult[] = room.candidateIds.map(candId => {
    const restaurant = allRestaurants.find(r => r.id === candId);
    const count = roomVotes.filter(v => v.restaurantId === candId).length;
    return {
      restaurantId: candId,
      restaurantName: restaurant?.name || "Unknown",
      count
    };
  });

  // 득표수 내림차순 정렬
  return result.sort((a, b) => b.count - a.count);
};