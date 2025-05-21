import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const menu = [
  { key: 'tools', icon: '🛠️', tKey: 'sidebar_tools', path: '/dashboard/tools' },
  { key: 'ads', icon: '📢', tKey: 'sidebar_ads', path: '/dashboard/ads' },
  { key: 'posts', icon: '📝', tKey: 'sidebar_posts', path: '/dashboard/posts' },
  { key: 'gpts', icon: '🧊', tKey: 'sidebar_gpts', path: '/dashboard/gpts' },
  { key: 'listening', icon: '👂', tKey: 'sidebar_listening', path: '/dashboard/listening' },
  { key: 'favorites', icon: '⭐', tKey: 'sidebar_favorites', path: '/dashboard/favorites' },
  { key: 'orders', icon: '🧾', tKey: 'sidebar_orders', path: '/dashboard/orders' },
];

export default function DashboardSidebar() {
  const { t, i18n, ready } = useTranslation('common');
  if (!ready) return null;
  const [forceUpdate, setForceUpdate] = useState(0);
  useEffect(() => {
    i18n.reloadResources(i18n.language, ['common']);
  }, [i18n.language]);
  console.log('DashboardSidebar.tsx 当前语言:', i18n.language, 'sidebar_tools:', t('sidebar_tools'));
  const router = useRouter();
  return (
    <aside key={i18n.language} className="flex flex-col w-56 min-h-screen bg-white border-r border-gray-100 shadow-sm py-6 px-2">
      <nav className="flex flex-col gap-1">
        {menu.map(item => (
          <Link
            key={item.key}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-purple-50 transition-all text-base ${router.asPath.startsWith(item.path) ? 'bg-purple-100 text-purple-700 font-bold' : ''}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{t(item.tKey)}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
} 