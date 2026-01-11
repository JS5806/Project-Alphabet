import { NextResponse } from 'next/server';
import { voteSessions, restaurants } from '@/lib/mock-db';

// 투표 세션 정보 조회 (Results & Voting)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = voteSessions[params.id];
  
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  // 클라이언트에 필요한 형태로 데이터 가공 (식당 상세 정보 Join)
  const enrichedCandidates = session.candidates.map(c => {
    const rInfo = restaurants.find(r => r.id === c.restaurantId);
    return { ...c, ...rInfo };
  });

  // 최다 득표 계산
  const maxVotes = Math.max(...session.candidates.map(c => c.votes));

  return NextResponse.json({
    ...session,
    candidates: enrichedCandidates,
    maxVotes
  });
}

// 투표 하기
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { restaurantId, nickname } = await req.json();
  const session = voteSessions[params.id];

  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  // 중복 투표 방지 (닉네임 기준) - MVP에서는 단순 체크
  if (session.participants.includes(nickname)) {
    return NextResponse.json({ error: 'Already voted' }, { status: 400 });
  }

  // 투표 수 증가
  const candidate = session.candidates.find(c => c.restaurantId === restaurantId);
  if (candidate) {
    candidate.votes += 1;
    session.participants.push(nickname);
  }

  return NextResponse.json({ success: true });
}