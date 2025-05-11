import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState<{ email: string; username: string; createdAt?: number } | null>(null);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const username = localStorage.getItem('username');
    if (!email) {
      router.replace('/login');
      return;
    }
    // 拉取用户注册时间
    fetch('/api/auth/user?email=' + encodeURIComponent(email))
      .then(res => res.json())
      .then(data => {
        setUser({ email, username: username || email, createdAt: data.createdAt });
        setNickname(data.nickname || username || email);
      });
    // 拉取评论历史
    fetch('/api/reviews?userEmail=' + encodeURIComponent(email))
      .then(res => res.json())
      .then(setReviews);
  }, [router]);

  const handleNicknameUpdate = async () => {
    setMessage('');
    const res = await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user?.email, nickname })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('昵称修改成功');
      localStorage.setItem('username', nickname);
    } else {
      setMessage(data.message || '修改失败');
    }
  };

  const handlePasswordUpdate = async () => {
    setMessage('');
    if (!password) return setMessage('请输入新密码');
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user?.email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('密码修改成功');
      setPassword('');
    } else {
      setMessage(data.message || '修改失败');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white dark:bg-gray-800 rounded shadow p-8">
      <h2 className="text-2xl font-bold mb-6">{t('profile_title')}</h2>
      <div className="mb-4">{t('profile_email')}: {user.email}</div>
      <div className="mb-4">{t('profile_register_time')}: {user.createdAt ? new Date(user.createdAt).toLocaleString() : t('profile_unknown')}</div>
      <div className="mb-4 flex items-center gap-2">
        <span>{t('profile_nickname')}：</span>
        <input value={nickname} onChange={e => setNickname(e.target.value)} className="border rounded px-2 py-1" />
        <button className="ml-2 px-3 py-1 bg-purple-600 text-white rounded" onClick={handleNicknameUpdate}>{t('profile_update_nickname')}</button>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <span>{t('profile_new_password')}：</span>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="border rounded px-2 py-1" />
        <button className="ml-2 px-3 py-1 bg-purple-600 text-white rounded" onClick={handlePasswordUpdate}>{t('profile_update_password')}</button>
      </div>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      <h3 className="text-xl font-bold mt-8 mb-2">{t('profile_my_reviews')}</h3>
      {reviews.length === 0 ? <div>{t('profile_no_reviews')}</div> : (
        <div className="space-y-2">
          {reviews.map(r => (
            <div key={r.id} className="bg-gray-100 dark:bg-gray-700 rounded p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
                <span className="text-xs text-gray-400 ml-auto">{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-gray-800 dark:text-gray-100 text-sm">{r.comment}</div>
              <div className="text-xs text-gray-400 mt-1">工具ID: {r.toolId}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 