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
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: t('auto_missing_token_fef9ba') });

  const users = readUsers();
  const user = users.find((u: any) => u.token === token && u.tokenExpires > Date.now());
  if (!user) return res.status(400).json({ message: t('auto_invalid_or_expired_token_870b06') });

  user.verified = true;
  user.token = null;
  user.tokenExpires = null;
  writeUsers(users);

  return res.status(200).json({ message: t('auto_email_verified_b61dee') });
} 