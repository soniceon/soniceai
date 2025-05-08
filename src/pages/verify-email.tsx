import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('验证中...');

  useEffect(() => {
    if (!token) return;
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    }).then(async res => {
      const data = await res.json();
      if (res.ok) {
        setStatus('邮箱验证成功，请登录');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setStatus(data.message || '验证失败');
      }
    });
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">邮箱验证</h2>
        <p>{status}</p>
      </div>
    </div>
  );
} 