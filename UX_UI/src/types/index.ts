export interface Menu {
  id: number;
  name: string;
  category: string;
  color: string; // 룰렛 슬라이스 색상
}

export type Category = 'All' | 'Korean' | 'Chinese' | 'Japanese' | 'Western';

export const MENU_DATA: Menu[] = [
  { id: 1, name: '김치찌개', category: 'Korean', color: '#FF6B6B' },
  { id: 2, name: '된장찌개', category: 'Korean', color: '#FFA07A' },
  { id: 3, name: '비빔밥', category: 'Korean', color: '#FFD700' },
  { id: 4, name: '짜장면', category: 'Chinese', color: '#90EE90' },
  { id: 5, name: '짬뽕', category: 'Chinese', color: '#20B2AA' },
  { id: 6, name: '탕수육', category: 'Chinese', color: '#87CEFA' },
  { id: 7, name: '초밥', category: 'Japanese', color: '#9370DB' },
  { id: 8, name: '라멘', category: 'Japanese', color: '#FF69B4' },
  { id: 9, name: '파스타', category: 'Western', color: '#D3D3D3' },
  { id: 10, name: '스테이크', category: 'Western', color: '#A9A9A9' },
  { id: 11, name: '피자', category: 'Western', color: '#F08080' },
];