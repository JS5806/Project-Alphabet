import { NextResponse } from 'next/server';
import { voteSessions, generateId } from '@/lib/mock-db';

export async function POST(req: Request) {
  const body = await req.json();
  const { title, candidateIds } = body;

  const newSessionId = generateId();
  
  voteSessions[newSessionId] = {
    id: newSessionId,
    title: title || '오늘 점심 뭐 먹지?',
    candidates: candidateIds.map((id: string) => ({ restaurantId: id, votes: 0 })),
    participants: []
  };

  return NextResponse.json({ sessionId: newSessionId });
}