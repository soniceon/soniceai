import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiGrid, FiMessageSquare, FiImage, FiCode, FiFileText, FiVideo, FiMusic, FiDatabase, FiHome, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSearch } from '@/contexts/SearchContext';

interface CategoryItem {
  id: string;
  name: string;
  icon: JSX.Element;
  count: number;
}

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobile, onClose }: SidebarProps) {
  const { t, i18n, ready } = useTranslation('common');
  if (!ready) return null;
  console.log('layout/Sidebar.tsx 当前语言:', i18n.language, 'sidebar_dashboard:', t('sidebar_dashboard'));

  useEffect(() => {
    i18n.reloadResources(i18n.language, ['common']);
    // 只在客户端调试输出
    console.log('layout/Sidebar.tsx 当前语言:', i18n.language, 'sidebar_dashboard:', t('sidebar_dashboard'));
  }, [i18n.language, t]);

  const categories = [
    { type: 'chatbot', icon: "💬", tKey: 'sidebar_chatbot', color: "text-cyan-500" },
    { type: 'image', icon: "🖼️", tKey: 'sidebar_image', color: "text-orange-400" },
    { type: 'coding', icon: "💻", tKey: 'sidebar_coding', color: "text-blue-500" },
    { type: 'productivity', icon: "📝", tKey: 'sidebar_productivity', color: "text-orange-500" },
    { type: 'design', icon: "🎨", tKey: 'sidebar_design', color: "text-gray-700" },
    { type: 'writing', icon: "✍️", tKey: 'sidebar_writing', color: "text-green-500" },
    { type: 'media', icon: "🎬", tKey: 'sidebar_media', color: "text-pink-500" },
    { type: 'marketing', icon: "📢", tKey: 'sidebar_marketing', color: "text-red-500" },
    { type: 'security', icon: "🔒", tKey: 'sidebar_security', color: "text-black" },
  ];

  return (
    <aside
      key={i18n.language}
      className={`fixed top-20 left-0 z-40 h-[calc(100vh-2rem)] w-64 bg-white shadow-lg rounded-r-2xl flex-col py-2 gap-1 border-r border-gray-100 dark:bg-gray-900 dark:border-gray-800 group transition-all duration-200 overflow-y-auto ${isMobile ? '' : 'hidden md:flex w-24 hover:w-64'}`}
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-5 py-3 font-bold text-lg text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-l-full group"
        onClick={isMobile && onClose ? onClose : undefined}
      >
        <FiHome className="text-2xl mr-2" />
        <span className="ml-2">{t('sidebar_dashboard')}</span>
      </Link>
      {categories.map((cat, idx) => (
        <Link
          key={`${cat.type}-${i18n.language}`}
          href={`/#${cat.type}`}
          className="flex items-center gap-2 px-5 py-1.5 font-medium transition rounded-l-full group"
          onClick={isMobile && onClose ? onClose : undefined}
        >
          <span className={`text-lg ${cat.color}`}>{cat.icon}</span>
          <span className="text-sm text-gray-700 dark:text-gray-200 ml-2">{t(cat.tKey)}</span>
        </Link>
      ))}
    </aside>
  );
}