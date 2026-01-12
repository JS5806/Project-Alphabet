import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 스타일 병합 유틸리티 (Tailwind 충돌 방지)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}