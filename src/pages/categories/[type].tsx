import { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '@/components/SEO';
import { aiTools } from '@/data/aiTools';

// 定义所有可用的工具类型
const toolTypes = ['chatbot', 'image', 'coding', 'productivity', 'design', 'writing', 'media', 'marketing'];

export default function CategoryPage() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { type } = router.query;
  const lang = i18n.language as 'zh' | 'en' | 'ja' | 'ko' | 'de' | 'fr' | 'es' | 'ru';
  
  // 过滤当前分类的工具
  const categoryTools = aiTools.filter(tool => tool.type === type);

  // 获取分类的图标和名称
  const getCategoryInfo = (type: string) => {
    const icons: { [key: string]: string } = {
      chatbot: '💬',
      image: '🖼️',
      coding: '💻',
      productivity: '📝',
      design: '🎨',
      writing: '✍️',
      media: '🎬',
      marketing: '📢'
    };
    
    const names: { [key: string]: { [lang: string]: string } } = {
      chatbot: { zh: '聊天机器人', en: 'Chatbot', ja: 'チャットボット', ko: '챗봇', de: 'Chatbot', fr: 'Chatbot', es: 'Chatbot', ru: 'Чат-бот' },
      image: { zh: '图像生成', en: 'Image Generation', ja: '画像生成', ko: '이미지 생성', de: 'Bildgenerierung', fr: 'Génération d\'images', es: 'Generación de imágenes', ru: 'Генерация изображений' },
      coding: { zh: '编程助手', en: 'Coding Assistant', ja: 'コーディングアシスタント', ko: '코딩 어시스턴트', de: 'Programmierassistent', fr: 'Assistant de programmation', es: 'Asistente de programación', ru: 'Помощник по программированию' },
      productivity: { zh: '生产力工具', en: 'Productivity Tools', ja: '生産性ツール', ko: '생산성 도구', de: 'Produktivitätstools', fr: 'Outils de productivité', es: 'Herramientas de productividad', ru: 'Инструменты продуктивности' },
      design: { zh: '设计工具', en: 'Design Tools', ja: 'デザインツール', ko: '디자인 도구', de: 'Designtools', fr: 'Outils de design', es: 'Herramientas de diseño', ru: 'Инструменты дизайна' },
      writing: { zh: '写作工具', en: 'Writing Tools', ja: '執筆ツール', ko: '작성 도구', de: 'Schreibwerkzeuge', fr: 'Outils d\'écriture', es: 'Herramientas de escritura', ru: 'Инструменты для письма' },
      media: { zh: '媒体工具', en: 'Media Tools', ja: 'メディアツール', ko: '미디어 도구', de: 'Medientools', fr: 'Outils média', es: 'Herramientas de medios', ru: 'Медиа-инструменты' },
      marketing: { zh: '营销工具', en: 'Marketing Tools', ja: 'マーケティングツール', ko: '마케팅 도구', de: 'Marketing-Tools', fr: 'Outils de marketing', es: 'Herramientas de marketing', ru: 'Маркетинговые инструменты' }
    };

    return {
      icon: icons[type] || '🔧',
      name: names[type] || { en: type }
    };
  };

  const categoryInfo = getCategoryInfo(type as string);

  if (!type || !toolTypes.includes(type as string)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#181825] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            分类不存在
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            请返回 <Link href="/categories" className="text-purple-600 hover:text-purple-700">分类页面</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${categoryInfo.name[lang] || categoryInfo.name.en} - SoniceAI`}
        description={`探索最好的${categoryInfo.name[lang] || categoryInfo.name.en}工具，包括各种AI驱动的解决方案`}
        keywords={`${categoryInfo.name[lang] || categoryInfo.name.en}, AI工具, 人工智能, 机器学习`}
        type="website"
        section={`${categoryInfo.name[lang] || categoryInfo.name.en}分类`}
        tags={[`${categoryInfo.name[lang] || categoryInfo.name.en}`, 'AI工具', '人工智能']}
        publishedTime={new Date().toISOString()}
        modifiedTime={new Date().toISOString()}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-[#181825] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {categoryInfo.name[lang] || categoryInfo.name.en}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('category_description', '探索最先进的AI工具')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {tool.name[lang] || tool.name.en}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
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
                      {categoryInfo.name[lang] || categoryInfo.name.en}
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

                  {tool.tags && tool.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
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

                  <div className="mt-4">
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      {t('visit_website', '访问网站')}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = toolTypes.map((type) => ({
    params: { type },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}; 