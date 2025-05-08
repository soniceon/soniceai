import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const usersFile = path.resolve(process.cwd(), 'src/data/users.json');

function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}
function writeUsers(users: any[]) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

  const users = readUsers();
  if (users.find((u: any) => u.email === email)) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const newUser = {
    email,
    password, // 实际项目请加密
    verified: false,
    token,
    tokenExpires: Date.now() + 1000 * 60 * 60 * 24 // 24小时
  };
  users.push(newUser);
  writeUsers(users);

  // 调用发邮件API
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-verification-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token })
  });

  return res.status(200).json({ message: 'Registered, please verify your email' });
} 