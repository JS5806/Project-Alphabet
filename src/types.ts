export type Category = '한식' | '중식' | '일식' | '양식' | '분식' | '아시안';

export interface Menu {
  id: number;
  name: string;
  category: Category;
  icon: string;
}

export interface AppSettings {
  webhookUrl: string;
  notificationTime: string;
}