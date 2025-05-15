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
  if (req.method !== t('auto_post_a02439')) return res.status(405).json({ message: t('auto_method_not_allowed_e84e55') });
  const { email, nickname } = req.body;
  if (!email || !nickname) return res.status(400).json({ message: t('auto_missing_email_or_nickname_96e5ec') });
  const users = readUsers();
  const user = users.find((u: any) => u.email === email);
  if (!user) return res.status(404).json({ message: t('auto_user_not_found_b846d1') });
  user.nickname = nickname;
  writeUsers(users);
  return res.status(200).json({ message: t('auto_nickname_updated_19163a') });
} 