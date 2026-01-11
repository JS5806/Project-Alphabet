import { NextResponse } from 'next/server';
import { restaurants } from '@/lib/mock-db';

export async function GET() {
  // 실제 네트워크 지연 시뮬레이션 (300ms)
  await new Promise((resolve) => setTimeout(resolve, 300));
  return NextResponse.json(restaurants);
}