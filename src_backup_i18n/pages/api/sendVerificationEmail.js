import { sendVerificationEmail } from '../../utils/emailService';

export default async function handler(req, res) {
  if (req.method !== t('auto_post_a02439')) {
    return res.status(405).json({ error: t('auto_method_not_allowed_e84e55') });
  }
  const { email, token } = req.body;
  const ok = await sendVerificationEmail(email, token);
  if (ok) {
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ error: '邮件发送失败' });
  }
} 