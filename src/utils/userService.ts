import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, UserInput, OAuthProfile, UserResponse } from '../types/user';
import { validatePassword } from './passwordValidator';
import { generateToken } from './jwt';

const SALT_ROUNDS = 10;
const usersFile = path.resolve(process.cwd(), 'src/data/users.json');

export class UserService {
  private static instance: UserService;
  private users: User[] = [];

  private constructor() {
    this.loadUsers();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  private loadUsers(): void {
    if (!fs.existsSync(usersFile)) {
      this.users = [];
      return;
    }
    this.users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
  }

  private saveUsers(): void {
    fs.writeFileSync(usersFile, JSON.stringify(this.users, null, 2));
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  public async create(input: UserInput): Promise<User> {
    const existingUser = await this.findByEmail(input.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = input.password ? await bcrypt.hash(input.password, SALT_ROUNDS) : null;

    const newUser: User = {
      id: crypto.randomUUID(),
      email: input.email,
      password: hashedPassword,
      name: input.name || '',
      verified: true,
      token: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      provider: input.provider,
      providerId: input.providerId,
      avatar: input.avatar
    };

    this.users.push(newUser);
    this.saveUsers();

    return newUser;
  }

  public async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    const user = this.users.find(u => u.token === token);
    if (!user) {
      return { success: false, message: 'Invalid verification token' };
    }

    user.verified = true;
    user.token = null;
    user.updatedAt = new Date().toISOString();
    this.saveUsers();

    return { success: true, message: 'Email verified successfully' };
  }

  public async updateProfile(userId: string, updates: Partial<User>): Promise<{ success: boolean; message: string; user?: User }> {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    Object.assign(user, updates);
    user.updatedAt = new Date().toISOString();
    this.saveUsers();

    return { success: true, message: 'Profile updated successfully', user };
  }

  public async validateSession(token: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const user = this.users.find(u => u.id === decoded.userId);
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      return { success: true, message: 'Session valid', user };
    } catch (error) {
      return { success: false, message: 'Invalid session' };
    }
  }

  // 通过 provider 和 providerId 查找用户（如 OAuth 登录）
  public async findByProviderId(provider: string, providerId: string): Promise<User | null> {
    // 假设 User 结构中有 provider 和 providerId 字段
    return this.users.find(user => (user as any).provider === provider && (user as any).providerId === providerId) || null;
  }
} 