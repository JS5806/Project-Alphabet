export type Category = '전체' | '한식' | '중식' | '일식' | '양식' | '분식';

export interface Menu {
  id: number;
  name: string;
  category: Category;
  description: string;
}

export interface HistoryItem extends Menu {
  eatenAt: number; // timestamp
}