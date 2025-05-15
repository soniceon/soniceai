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
  if (req.method !== t('auto_post_a02439')) return res.status(405).json({ message: t('auto_method_not_allowed_e84e55') });
  const { email, password, nickname } = req.body;
  if (!email || !password) return res.status(400).json({ message: t('auto_missing_email_or_password_d5dddb') });

  const users = readUsers();
  if (users.find((u: any) => u.email === email)) {
    return res.status(400).json({ message: t('auto_email_already_registered_95f169') });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const newUser = {
    email,
    password, // 实际项目请加密
    nickname: nickname || '',
    verified: false,
    token,
    tokenExpires: Date.now() + 1000 * 60 * 60 * 24 // 24小时
  };
  users.push(newUser);
  writeUsers(users);

  // 动态拼接 baseUrl，适配本地和线上
  const baseUrl = req.headers.host?.startsWith('localhost')
    ? 'http://localhost:3000'
    : `https://${req.headers.host}`;

  try {
    await fetch(`${baseUrl}/api/send-verification-email`, {
      method: t('auto_post_a02439'),
      headers: { t('auto_content_type_dc105a'): 'application/json' },
      body: JSON.stringify({ email, token })
    });
  } catch (e) {
    return res.status(500).json({ message: t('auto_failed_to_send_verification_em_13bd1f') });
  }

  return res.status(200).json({ message: 'Registered, please verify your email' });
} 