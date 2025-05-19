import jwt from 'jsonwebtoken';
import { User } from '../types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '7d'; // 7天

export interface TokenPayload {
  userId: string;
  email: string;
  rememberMe?: boolean;
  [key: string]: any;
}

export function generateToken(user: User, rememberMe: boolean = false): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    rememberMe
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: rememberMe ? '30d' : TOKEN_EXPIRY // 记住登录状态时token有效期30天
  });
}

export function validateToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    return null;
  }
} 