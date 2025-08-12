import type { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '../../../utils/userService';
import { JwtUtil } from '../../../utils/jwtUtil';
import EmailService from '../../../utils/emailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const userService = UserService.getInstance();
    const user = await userService.findByEmail(email);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 生成重置密码token
    const jwtUtil = JwtUtil.getInstance();
    const resetToken = jwtUtil.generateToken({ email: user.email });
    
    // 发送重置密码邮件
    const emailService = EmailService.getInstance();
    const success = await emailService.sendPasswordResetEmail(email, resetToken);
    
    if (success) {
      return res.status(200).json({ message: 'Password reset email sent' });
    } else {
      return res.status(500).json({ message: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}