import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiX, FiHome, FiImage, FiMessageSquare, FiCode, FiFileText, FiVideo, FiMusic, FiDatabase, FiGrid, FiMoreHorizontal } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface CategoryItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  count?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categories: CategoryItem[] = [
    { id: 'all', name: t('categories.all'), icon: <FiGrid />, count: 1250 },
    { id: 'chatbots', name: t('categories.chatbots'), icon: <FiMessageSquare />, count: 235 },
    { id: 'image-generation', name: t('categories.imageGeneration'), icon: <FiImage />, count: 182 },
    { id: 'code-assistants', name: t('categories.codeAssistants'), icon: <FiCode />, count: 147 },
    { id: 'content-writing', name: t('categories.contentWriting'), icon: <FiFileText />, count: 168 },
    { id: 'video-generation', name: t('categories.videoGeneration'), icon: <FiVideo />, count: 93 },
    { id: 'music-generation', name: t('categories.musicGeneration'), icon: <FiMusic />, count: 51 },
    { id: 'data-analysis', name: t('categories.dataAnalysis'), icon: <FiDatabase />, count: 79 },
  ];

  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 },
  };

  return (
    <motion.div
      className="h-screen overflow-y-auto w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm fixed md:relative"
      initial={isOpen ? 'open' : 'closed'}
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <FiX className="h-5 w-5" />
          </button>
        )}
        
        {/* Sidebar header */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('sidebar.categories')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('sidebar.browseTools')}</p>
        </div>
        
        {/* Navigation Items */}
        <nav>
          <div className="mb-4">
            <Link
              href="/"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'bg-primary-50 dark:bg-gray-800 text-primary-600 dark:text-primary-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <FiHome className="mr-3 h-5 w-5" />
              <span>{t('sidebar.home')}</span>
            </Link>
          </div>
          
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('sidebar.toolCategories')}
            </h3>
            
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium relative ${
                  isActive(`/category/${category.id}`)
                    ? 'bg-primary-50 dark:bg-gray-800 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                } sidebar-item ${isActive(`/category/${category.id}`) ? 'active' : ''}`}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center">
                  <span className="mr-3 h-5 w-5">{category.icon}</span>
                  <span>{category.name}</span>
                </div>
                {category.count !== undefined && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {category.count}
                  </span>
                )}
                
                {hoveredCategory === category.id && (
                  <motion.div
                    className="absolute -right-2 -mt-2 w-1 h-full bg-primary-500 dark:bg-primary-400 rounded"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: '100%' }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            ))}
            
            <Link
              href="/categories"
              className="flex items-center px-3 py-2 mt-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FiMoreHorizontal className="mr-3 h-5 w-5" />
              <span>{t('sidebar.allCategories')}</span>
            </Link>
          </div>
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;