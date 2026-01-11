export type Category = 'ALL' | 'KOREAN' | 'CHINESE' | 'JAPANESE' | 'WESTERN';

export interface Menu {
  id: number;
  name: string;
  category: Category;
  imageUrl?: string; // 이미지 URL (선택)
}

export interface WebhookConfig {
  url: string;
  isActive: boolean;
}