export interface User {
  id: string;
  username: string;
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface VoteState {
  [restaurantId: string]: number; // restaurantId: count
}

export interface VoteEvent {
  restaurantId: string;
  userId: string;
}