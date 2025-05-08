import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const usersFile = path.resolve(process.cwd(), 'src/data/users.json');

function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}
function writeUsers(users: any[]) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Missing token' });

  const users = readUsers();
  const user = users.find((u: any) => u.token === token && u.tokenExpires > Date.now());
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.verified = true;
  user.token = null;
  user.tokenExpires = null;
  writeUsers(users);

  return res.status(200).json({ message: 'Email verified' });
} 