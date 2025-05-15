import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== t('auto_post_a02439')) {
    return res.status(405).json({ message: t('auto_method_not_allowed_e84e55') });
  }
  const { email, token } = req.body;
  if (!email || !token) {
    return res.status(400).json({ message: t('auto_missing_email_or_token_baa36f') });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'soniceono@gmail.com',
      pass: 'ajoj tuhq rtrh bybc',
    },
  });

  const verifyUrl = `http://localhost:3000/verify-email?token=${token}`;
  try {
    await transporter.sendMail({
      from: 'soniceono@gmail.com',
      to: email,
      subject: '邮箱验证',
      html: `<p>请点击以下链接完成邮箱验证：</p><a href="${verifyUrl}">${verifyUrl}</a>`
    });
    return res.status(200).json({ message: t('auto_verification_email_sent_3471c8') });
  } catch (err) {
    return res.status(500).json({ message: t('auto_failed_to_send_email_cdbd4d'), error: String(err) });
  }
} 