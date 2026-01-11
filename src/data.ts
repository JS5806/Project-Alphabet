import { Menu, Category } from './types';

export const CATEGORIES: Category[] = ['한식', '중식', '일식', '양식', '분식', '아시안'];

export const MENUS: Menu[] = [
  { id: 1, name: '김치찌개', category: '한식', icon: '🥘' },
  { id: 2, name: '제육볶음', category: '한식', icon: '🥩' },
  { id: 3, name: '짜장면', category: '중식', icon: '🍜' },
  { id: 4, name: '탕수육', category: '중식', icon: '🍖' },
  { id: 5, name: '초밥', category: '일식', icon: '🍣' },
  { id: 6, name: '돈까스', category: '일식', icon: '🍱' },
  { id: 7, name: '파스타', category: '양식', icon: '🍝' },
  { id: 8, name: '햄버거', category: '양식', icon: '🍔' },
  { id: 9, name: '떡볶이', category: '분식', icon: '🍢' },
  { id: 10, name: '쌀국수', category: '아시안', icon: '🍲' },
  { id: 11, name: '비빔밥', category: '한식', icon: '🥗' },
  { id: 12, name: '마라탕', category: '중식', icon: '🌶️' },
  { id: 13, name: '라멘', category: '일식', icon: '🍜' },
  { id: 14, name: '피자', category: '양식', icon: '🍕' },
  { id: 15, name: '김밥', category: '분식', icon: '🍙' },
];