import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';

const categories = [
  { type: 'chatbot', icon: "💬", tKey: 'sidebar_chatbot', color: "text-cyan-500", href: "/#chatbot" },
  { type: 'image', icon: "🖼️", tKey: 'sidebar_image', color: "text-orange-400", href: "/#image" },
  { type: 'coding', icon: "💻", tKey: 'sidebar_coding', color: "text-blue-500", href: "/#coding" },
  { type: 'productivity', icon: "📝", tKey: 'sidebar_productivity', color: "text-orange-500", href: "/#productivity" },
  { type: 'design', icon: "🎨", tKey: 'sidebar_design', color: "text-gray-700", href: "/#design" },
  { type: 'writing', icon: "✍️", tKey: 'sidebar_writing', color: "text-green-500", href: "/#writing" },
  { type: 'media', icon: "🎬", tKey: 'sidebar_media', color: "text-pink-500", href: "/#media" },
  { type: 'marketing', icon: "📢", tKey: 'sidebar_marketing', color: "text-red-500", href: "/#marketing" },
  { type: 'security', icon: "🔒", tKey: 'sidebar_security', color: "text-black", href: "/#security" },
];

export default function Sidebar() {
  const { t, i18n, ready } = useTranslation('common');
  const router = useRouter();
  const [hover, setHover] = useState(false);
  
  useEffect(() => {
    if (ready && i18n) {
      i18n.reloadResources(i18n.language, ['common']);
      // 只在客户端调试输出
      console.log('Sidebar.tsx 当前语言:', i18n.language, 'sidebar_tools:', t('sidebar_tools'));
    }
  }, [ready, i18n, t]);
  
  if (!ready) return null;

  const handleCategoryClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const hash = href.split('#')[1];
    
    if (router.pathname === '/') {
      // 如果已经在首页，直接滚动到锚点
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // 如果不在首页，先跳转到首页，然后滚动到锚点
      router.push('/').then(() => {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      });
    }
  };

  return (
    <aside
      key={i18n.language}
      className="hidden md:flex fixed top-20 left-0 z-40 h-[calc(100vh-2rem)] w-24 hover:w-64 bg-white shadow-lg rounded-r-2xl flex-col py-2 gap-1 border-r border-gray-100 dark:bg-gray-900 dark:border-gray-800 group transition-all duration-200 overflow-y-auto"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {categories.map((cat, idx) => (
        <a
          key={`${cat.type}-${i18n.language}`}
          href={cat.href}
          onClick={(e) => handleCategoryClick(e, cat.href)}
          className="flex items-center gap-2 px-5 py-1.5 font-medium transition rounded-l-full group cursor-pointer"
        >
          <span className={`text-lg ${cat.color}`}>{cat.icon}</span>
          <span
            className={`text-sm text-gray-700 dark:text-gray-200 transition-all duration-200 truncate
              ${hover ? 'opacity-100 ml-2' : 'opacity-0 ml-[-8px] w-0 overflow-hidden'}
            `}
            style={{ minWidth: hover ? 60 : 0 }}
          >
            {t(cat.tKey)}
          </span>
        </a>
      ))}
    </aside>
  );
} 
