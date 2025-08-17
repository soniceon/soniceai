import { useState } from 'react';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SEO from '@/components/SEO';
import { useTranslation } from 'next-i18next';
import { useSearch } from '@/context/SearchContext';
import { aiTools } from '@/data/aiTools';

export default function Home() {
  const { t, i18n } = useTranslation('common');
  const { keyword, setKeyword } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const lang = i18n.language as 'zh' | 'en' | 'ja' | 'ko' | 'de' | 'fr' | 'es' | 'ru';

  // 分类列表
  const categories = [
    { id: 'all', name: { zh: '所有分类', en: 'All Categories', ja: 'すべてのカテゴリ', ko: '모든 카테고리', de: 'Alle Kategorien', fr: 'Toutes les catégories', es: 'Todas las categorías', ru: 'Все категории' } },
    { id: 'chatbot', name: { zh: '聊天机器人', en: 'Chatbot', ja: 'チャットボット', ko: '챗봇', de: 'Chatbot', fr: 'Chatbot', es: 'Chatbot', ru: 'Чат-бот' } },
    { id: 'image', name: { zh: '图像生成', en: 'Image Generation', ja: '画像生成', ko: '이미지 생성', de: 'Bildgenerierung', fr: 'Génération d\'image', es: 'Generación de imágenes', ru: 'Генерация изображений' } },
    { id: 'coding', name: { zh: '代码助手', en: 'Coding', ja: 'コーディング', ko: '코딩', de: 'Programmierung', fr: 'Codage', es: 'Codificación', ru: 'Кодинг' } },
    { id: 'productivity', name: { zh: '效率工具', en: 'Productivity', ja: '生産性', ko: '생산성', de: 'Produktivität', fr: 'Productivité', es: 'Productividad', ru: 'Продуктивность' } },
    { id: 'design', name: { zh: '设计工具', en: 'Design', ja: 'デザイン', ko: '디자인', de: 'Design', fr: 'Design', es: 'Diseño', ru: 'Дизайн' } },
    { id: 'writing', name: { zh: '写作助手', en: 'Writing', ja: '執筆', ko: '글쓰기', de: 'Schreiben', fr: 'Écriture', es: 'Escritura', ru: 'Письмо' } },
    { id: 'media', name: { zh: '音视频', en: 'Media', ja: 'メディア', ko: '미디어', de: 'Medien', fr: 'Médias', es: 'Medios', ru: 'Медиа' } },
    { id: 'marketing', name: { zh: '营销工具', en: 'Marketing', ja: 'マーケティング', ko: '마케팅', de: 'Marketing', fr: 'Marketing', es: 'Marketing', ru: 'Маркетинг' } },
    { id: 'app', name: { zh: '应用', en: 'App', ja: 'アプリ', ko: '앱', de: 'App', fr: 'App', es: 'App', ru: 'Приложение' } },
  ];

  // 按分类筛选工具
  const getToolsByCategory = (category: string) => {
    if (category === 'all') return aiTools;
    return aiTools.filter(tool => tool.type === category);
  };

  // 精选工具
  const featuredTools = aiTools.filter(tool => tool.featured).slice(0, 10);

  return (
    <>
      <SEO 
        title="SoniceAI - Discover the Best AI Tools and Websites"
        description="Explore AI tools for chatbots, image generation, coding, and productivity. Find the perfect AI solution for your needs with our comprehensive collection."
        keywords="AI tools, artificial intelligence, chatbot, image generation, coding, productivity"
        ogImage="/og-image.jpg"
        ogType="website"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-[#181825]">
        {/* 主要内容区域 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 分类筛选按钮 */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <h3 className="sr-only">Filter by Category</h3>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {category.name[lang] || category.name.en}
              </button>
            ))}
          </div>

          <div className="flex gap-8">
            {/* 左侧主内容区 */}
            <div className="flex-1">
              {/* 按分类显示工具 */}
              {categories.slice(1).map((category) => {
                const categoryTools = getToolsByCategory(category.id);
                if (categoryTools.length === 0) return null;
                
                return (
                  <section key={category.id} id={category.id} className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      {category.name[lang] || category.name.en}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryTools.slice(0, 6).map((tool) => (
                        <Link
                          key={tool.id}
                          href={`/tools/${tool.id}`}
                          className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700 overflow-hidden group"
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">
                                  {tool.name[lang] || tool.name.en}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                  {tool.desc[lang] || tool.desc.en}
                                </p>
                              </div>
                              <div className="flex-shrink-0 ml-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center text-2xl">
                                  {tool.icon}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm mb-3">
                              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                                {category.name[lang] || category.name.en}
                              </span>
                              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <span className="text-yellow-500">⭐</span>
                                  <span className="font-semibold">{tool.rating}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="text-blue-500">👥</span>
                                  <span className="font-semibold">{tool.users}</span>
                                </span>
                              </div>
                            </div>

                            {/* 标签 */}
                            {tool.tags && tool.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                <h4 className="sr-only">Tool Tags</h4>
                                {tool.tags.slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    {/* 查看全部链接 */}
                    {categoryTools.length > 6 && (
                      <div className="text-center mt-6">
                        <Link
                          href={`/categories/${category.id}`}
                          className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                          {t('view_all', 'View All')} {category.name[lang] || category.name.en}
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            {/* 右侧边栏 - Featured AI Tools */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('featured_ai_tools', 'Featured AI Tools')}
                </h3>
                <div className="space-y-4">
                  {featuredTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.id}`}
                      className="block"
                    >
                      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center text-lg">
                          {tool.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {tool.name[lang] || tool.name.en}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                            {tool.desc[lang] || tool.desc.en}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {/* 查看所有工具链接 */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="sr-only">View All Tools</h3>
                  <Link
                    href="/tools"
                    className="block w-full text-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    {t('view_all_tools', 'View All Tools')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
