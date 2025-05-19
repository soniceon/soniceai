import { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '../../../utils/userService';
import { generateToken } from '../../../utils/jwt';
import EmailService from '../../../utils/emailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: '请提供邮箱地址' });
    }

    const userService = UserService.getInstance();
    const user = await userService.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: '未找到该邮箱对应的用户' });
    }

    // 生成重置密码token
    const resetToken = generateToken({ userId: user.id }, '1h');

    // 发送重置密码邮件
    const emailService = EmailService.getInstance();
    const emailSent = await emailService.sendPasswordResetEmail(email, resetToken);

    if (!emailSent) {
      return res.status(500).json({ message: '发送重置密码邮件失败' });
    }

    res.status(200).json({
      message: '重置密码链接已发送到您的邮箱'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: '处理请求时出错' });
  }
} 