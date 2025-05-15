import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const usersFile = path.resolve(process.cwd(), 'src/data/users.json');

function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== t('auto_post_a02439')) return res.status(405).json({ message: t('auto_method_not_allowed_e84e55') });
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: t('auto_missing_email_or_password_d5dddb') });

  const users = readUsers();
  const user = users.find((u: any) => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ message: t('auto_invalid_email_or_password_2abaf3') });
  if (!user.verified) return res.status(400).json({ message: t('auto_email_not_verified_9e5ca9'), token: user.token });

  return res.status(200).json({ message: t('auto_login_success_1a0fc3'), nickname: user.nickname || '' });
} 