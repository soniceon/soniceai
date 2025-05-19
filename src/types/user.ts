export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  verified: boolean;
  token: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserInput {
  email: string;
  password: string;
  name?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OAuthProfile {
  provider: string;
  id: string;
  email: string;
  name: string;
  avatar?: string;
} 