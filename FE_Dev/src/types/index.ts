export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  description: string;
  votes: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface VoteUpdatePayload {
  restaurantId: string;
  votes: number;
}