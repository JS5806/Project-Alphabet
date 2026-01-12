export type Category = 'ALL' | '한식' | '중식' | '일식' | '양식' | '분식';

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  color: string; // 룰렛 슬라이스 색상
}