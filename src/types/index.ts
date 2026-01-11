export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  token: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
}

export interface VoteData {
  menuId: string;
  count: number;
}

export interface VoteUpdatePayload {
  totalVotes: number;
  rankings: VoteData[];
}