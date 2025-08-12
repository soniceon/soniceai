export interface AuthUser {
  id: string;
  email: string;
  name: string;
  verified?: boolean;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  message: string;
  user?: AuthUser;
  token?: string;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
} 