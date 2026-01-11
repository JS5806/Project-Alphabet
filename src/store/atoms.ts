import { atom } from 'recoil';
import { Category, Menu, WebhookConfig } from '../types';

// 초기 더미 데이터
const INITIAL_MENUS: Menu[] = [
  { id: 1, name: '김치찌개', category: 'KOREAN' },
  { id: 2, name: '된장찌개', category: 'KOREAN' },
  { id: 3, name: '비빔밥', category: 'KOREAN' },
  { id: 4, name: '삼겹살', category: 'KOREAN' },
  { id: 5, name: '짜장면', category: 'CHINESE' },
  { id: 6, name: '짬뽕', category: 'CHINESE' },
  { id: 7, name: '탕수육', category: 'CHINESE' },
  { id: 8, name: '초밥', category: 'JAPANESE' },
  { id: 9, name: '라멘', category: 'JAPANESE' },
  { id: 10, name: '돈까스', category: 'JAPANESE' },
  { id: 11, name: '파스타', category: 'WESTERN' },
  { id: 12, name: '피자', category: 'WESTERN' },
  { id: 13, name: '스테이크', category: 'WESTERN' },
  { id: 14, name: '햄버거', category: 'WESTERN' },
];

export const menuListState = atom<Menu[]>({
  key: 'menuListState',
  default: INITIAL_MENUS,
});

export const categoryFilterState = atom<Category>({
  key: 'categoryFilterState',
  default: 'ALL',
});

export const webhookConfigState = atom<WebhookConfig>({
  key: 'webhookConfigState',
  default: {
    url: '',
    isActive: false,
  },
});