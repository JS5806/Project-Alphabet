export interface Menu {
  id: number;
  name: string;
  color: string;
}

export interface HistoryItem {
  menuId: number;
  date: string; // ISO String
}