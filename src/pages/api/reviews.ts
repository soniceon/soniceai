import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { handleApiError, ValidationError, NotFoundError, ConflictError } from '@/utils/errorHandler';

// 类型定义
interface Review {
  id: string;
  toolId: string;
  userEmail: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  verified: boolean;
  token: string | null;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

interface CreateReviewRequest {
  toolId: string;
  userEmail: string;
  username?: string;
  rating: number;
  comment?: string;
}

interface DeleteReviewRequest {
  id: string;
  userEmail: string;
}

const reviewsFile = path.resolve(process.cwd(), 'src/data/reviews.json');
const usersFile = path.resolve(process.cwd(), 'src/data/users.json');

function readReviews(): Review[] {
  try {
    if (!fs.existsSync(reviewsFile)) return [];
    const data = fs.readFileSync(reviewsFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading reviews:', error);
    return [];
  }
}

function writeReviews(reviews: Review[]): void {
  try {
    fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
  } catch (error) {
    console.error('Error writing reviews:', error);
    throw new Error('Failed to save review');
  }
}

function readUsers(): User[] {
  try {
    if (!fs.existsSync(usersFile)) return [];
    const data = fs.readFileSync(usersFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { toolId, userEmail } = req.query;
      const reviews = readReviews();
      
      if (toolId && typeof toolId === 'string') {
        return res.status(200).json(reviews.filter((r: Review) => r.toolId === toolId));
      }
      if (userEmail && typeof userEmail === 'string') {
        return res.status(200).json(reviews.filter((r: Review) => r.userEmail === userEmail));
      }
      return res.status(400).json({ message: 'Missing toolId or userEmail' });
    }
    
    if (req.method === 'POST') {
      const { toolId, userEmail, username, rating, comment }: CreateReviewRequest = req.body;
      
      if (!toolId || !userEmail || !rating) {
        throw new ValidationError('Missing required fields');
      }
      
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        throw new ValidationError('Rating must be a number between 1 and 5');
      }
      
      const users = readUsers();
      const user = users.find((u: User) => u.email === userEmail);
      
      if (!user) {
        throw new ValidationError('User not found');
      }
      
      const reviews = readReviews();
      
      // 限制每个用户每个工具只能评论一次
      if (reviews.find((r: Review) => r.toolId === toolId && r.userEmail === userEmail)) {
        throw new ConflictError('You have already reviewed this tool');
      }
      
      const newReview: Review = {
        id: uuidv4(),
        toolId: toolId as string,
        userEmail: userEmail as string,
        username: username || user.name || userEmail,
        rating: rating as number,
        comment: comment || '',
        createdAt: Date.now()
      };
      
      reviews.push(newReview);
      writeReviews(reviews);
      
      return res.status(201).json({ 
        message: 'Review submitted successfully',
        review: newReview
      });
    }
    
    if (req.method === 'DELETE') {
      const { id, userEmail }: DeleteReviewRequest = req.body;
      
      if (!id || !userEmail) {
        throw new ValidationError('Missing id or userEmail');
      }
      
      const reviews = readReviews();
      const idx = reviews.findIndex((r: Review) => r.id === id && r.userEmail === userEmail);
      
      if (idx === -1) {
        throw new NotFoundError('Review not found or no permission');
      }
      
      reviews.splice(idx, 1);
      writeReviews(reviews);
      
      return res.status(200).json({ message: 'Review deleted successfully' });
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return res.status(statusCode).json({ message });
  }
} 
