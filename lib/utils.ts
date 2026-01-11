import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Tailwind 클래스 병합 유틸리티 (Shadcn/UI 표준)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 랜덤 ID 생성기
export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}