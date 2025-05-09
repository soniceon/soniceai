import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth?.() || {};

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.replace('/login');
    }
  }, [user, router, mounted]);

  // 只在客户端渲染
  if (!mounted) return null;
  if (!user) return null;

  // 语言切换
  const handleLangChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#181825]">
      {/* 侧边栏 */}
      <aside className="w-64 bg-white dark:bg-gray-900 p-6 border-r border-gray-200 dark:border-gray-800">
        <div className="font-bold text-xl mb-6">{t('dashboard')}</div>
        <ul className="space-y-4 text-gray-700 dark:text-gray-200">
          <li>{t('my_tools')}</li>
          <li>{t('advertising')}</li>
          <li>{t('posts_links')}</li>
          <li>{t('favorites')}</li>
          <li>{t('orders_invoice')}</li>
        </ul>
        <div className="mt-8">
          <select className="w-full p-2 rounded border" value={i18n.language} onChange={handleLangChange}>
            <option value="en">English</option>
            <option value="zh">简体中文</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="ru">Русский</option>
          </select>
        </div>
      </aside>
      {/* 主内容区 */}
      <main className="flex-1 p-10">
        <div className="bg-white dark:bg-gray-800 rounded shadow p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center text-3xl font-bold text-purple-700">
              {user.email[0]?.toUpperCase()}
            </div>
            <div>
              <div className="text-xl font-bold">{user.email}</div>
              <div className="text-gray-500 text-sm">ID: {user.id}</div>
            </div>
          </div>
          <div className="mb-4">
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700" onClick={async () => { await import('../utils/supabaseClient').then(({ supabase }) => supabase.auth.signOut()); router.push('/login'); }}>{t('logout')}</button>
          </div>
          <div className="mt-8">
            <div className="font-bold text-lg mb-2">AI's Data</div>
            <div className="text-gray-400">{t('no_tools')}</div>
          </div>
        </div>
      </main>
    </div>
  );
} 