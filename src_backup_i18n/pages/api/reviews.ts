import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const reviewsFile = path.resolve(process.cwd(), 'src/data/reviews.json');
const usersFile = path.resolve(process.cwd(), 'src/data/users.json');

function readReviews() {
  if (!fs.existsSync(reviewsFile)) return [];
  return JSON.parse(fs.readFileSync(reviewsFile, 'utf-8'));
}
function writeReviews(reviews: any[]) {
  fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
}
function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === t('auto_get_752803')) {
    const { toolId, userEmail } = req.query;
    const reviews = readReviews();
    if (toolId) {
      return res.status(200).json(reviews.filter((r: any) => r.toolId === toolId));
    }
    if (userEmail) {
      return res.status(200).json(reviews.filter((r: any) => r.userEmail === userEmail));
    }
    return res.status(400).json({ message: t('auto_missing_toolid_or_useremail_9f46f4') });
  }
  if (req.method === t('auto_post_a02439')) {
    const { toolId, userEmail, username, rating, comment } = req.body;
    if (!toolId || !userEmail || !rating) return res.status(400).json({ message: t('auto_missing_required_fields_7687f1') });
    const users = readUsers();
    const user = users.find((u: any) => u.email === userEmail);
    if (!user) return res.status(401).json({ message: t('auto_not_logged_in_09b2c7') });
    const reviews = readReviews();
    // 限制每个用户每个工具只能评论一次
    if (reviews.find((r: any) => r.toolId === toolId && r.userEmail === userEmail)) {
      return res.status(400).json({ message: t('auto_you_have_already_reviewed_this_642c16') });
    }
    const newReview = {
      id: uuidv4(),
      toolId,
      userEmail,
      username: username || userEmail,
      rating,
      comment: comment || '',
      createdAt: Date.now()
    };
    reviews.push(newReview);
    writeReviews(reviews);
    return res.status(200).json({ message: t('auto_review_submitted_40a146') });
  }
  if (req.method === t('auto_delete_32f68a')) {
    const { id, userEmail } = req.body;
    if (!id || !userEmail) return res.status(400).json({ message: t('auto_missing_id_or_useremail_8cd602') });
    const reviews = readReviews();
    const idx = reviews.findIndex((r: any) => r.id === id && r.userEmail === userEmail);
    if (idx === -1) return res.status(404).json({ message: t('auto_review_not_found_or_no_permiss_d6f8fe') });
    reviews.splice(idx, 1);
    writeReviews(reviews);
    return res.status(200).json({ message: t('auto_review_deleted_b85f3e') });
  }
  return res.status(405).json({ message: t('auto_method_not_allowed_e84e55') });
} 