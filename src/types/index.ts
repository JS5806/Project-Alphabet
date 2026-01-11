export interface MenuItem {
  id: string;
  name: string;
  color: string;
}

export interface HistoryItem {
  menuId: string;
  timestamp: number; // Date.now()
}

export interface RouletteState {
  menus: MenuItem[];
  history: HistoryItem[];
  filteredMenus: MenuItem[];
  isSpinning: boolean;
  winner: MenuItem | null;
  
  // Actions
  setSpinning: (isSpinning: boolean) => void;
  setWinner: (winner: MenuItem) => void;
  initializeCandidates: () => void;
  resetHistory: () => void;
}