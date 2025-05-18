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

export default function Sidebar({ isMobile = false, onClose }: SidebarProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation('common');
  const { setKeyword } = useSearch();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Monitor language changes and force re-render
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [i18n.language]);

  // 添加语言变化监听，确保在语言切换时重新生成分类列表
  useEffect(() => {
    setCategories([
      { id: 'all', name: t('categories_all'), icon: <FiGrid />, count: 1250 },
      { id: 'chatbots', name: t('categories_chatbots'), icon: <FiMessageSquare />, count: 235 },
      { id: 'image-generation', name: t('categories_imageGeneration'), icon: <FiImage />, count: 182 },
      { id: 'code-assistants', name: t('categories_codeAssistants'), icon: <FiCode />, count: 147 },
      { id: 'content-writing', name: t('categories_contentWriting'), icon: <FiFileText />, count: 168 },
      { id: 'video-generation', name: t('categories_videoGeneration'), icon: <FiVideo />, count: 93 },
      { id: 'music-generation', name: t('categories_musicGeneration'), icon: <FiMusic />, count: 51 },
      { id: 'data-analysis', name: t('categories_dataAnalysis'), icon: <FiDatabase />, count: 79 },
    ]);
  }, [t, i18n.language]); // 添加i18n.language作为依赖项

  // Check if current route is active
  const isActive = (path: string) => {
    return router.pathname === path || router.asPath === path;
  };

  // Animation variants for mobile sidebar
  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 },
  };

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'all') {
      setKeyword('');
    } else {
      setKeyword(categoryId);
      if (router.pathname !== '/') {
        router.push('/');
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 overflow-y-auto ${
          isMobile ? 'w-64' : 'w-16 md:w-64'
        } pt-20`}
        initial={isMobile ? 'closed' : false}
        animate="open"
        exit="closed"
        variants={sidebarVariants}
        key={`sidebar-${i18n.language}-${forceUpdate}`} // 添加forceUpdate确保在语言变化时重新渲染
      >
        <div className="p-4">
          {/* Sidebar header */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('sidebar_categories')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('sidebar_browseTools')}</p>
          </div>

          {/* Main navigation */}
          <div className="space-y-6">
            <div>
              <Link
                href="/"
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive('/') ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <FiHome className="mr-3 h-5 w-5" />
                <span>{t('sidebar_home')}</span>
              </Link>
            </div>

            <div>
              <h3 className="px-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {t('sidebar_toolCategories')}
              </h3>

              <div className="space-y-1">
                {categories.map((category) => (
                  <div
                    key={`${category.id}-${i18n.language}-${forceUpdate}`} // Add forceUpdate to ensure re-render
                    className="relative"
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <button
                      onClick={() => {
                        handleCategoryClick(category.id);
                        if (onClose) onClose();
                      }}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-md transition-colors ${
                        isActive(`/categories/${category.id}`)
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{category.icon}</span>
                        <span className={isMobile ? '' : 'hidden md:inline'}>{category.name}</span>
                      </div>
                      <span className={`text-xs text-gray-500 dark:text-gray-400 ${isMobile ? '' : 'hidden md:inline'}`}>{category.count}</span>
                    </button>
                  </div>
                ))}

                <Link
                  href="/categories"
                  className={`flex items-center px-3 py-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mt-4 ${
                    isMobile ? '' : 'hidden md:flex'
                  }`}
                >
                  <span>{t('sidebar_allCategories')}</span>
                  <FiChevronDown className="ml-auto" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}