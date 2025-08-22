import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SEO from '@/components/SEO';
import { aiTools } from '@/data/aiTools';
import Link from 'next/link';

export default function ToolDetailPage() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const lang = i18n.language as 'zh' | 'en' | 'ja' | 'ko' | 'de' | 'fr' | 'es' | 'ru';
  
  const tool = aiTools.find(t => t.id === id);

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#181825] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            工具不存在
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            请返回 <Link href="/tools" className="text-purple-600 hover:text-purple-700">工具页面</Link>
          </p>
        </div>
      </div>
    );
  }

  // 获取分类信息
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

  const categoryInfo = getCategoryInfo(tool.type);

  return (
    <>
      <SEO
        title={`${tool.name[lang] || tool.name.en} - SoniceAI`}
        description={tool.desc[lang] || tool.desc.en}
        keywords={`${tool.name[lang] || tool.name.en}, ${categoryInfo.name[lang] || categoryInfo.name.en}, AI工具, 人工智能`}
        type="website"
        section={`${categoryInfo.name[lang] || categoryInfo.name.en}`}
        tags={tool.tags}
        publishedTime={new Date().toISOString()}
        modifiedTime={new Date().toISOString()}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-[#181825] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 面包屑导航 */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
            <Link href="/" className="hover:text-purple-600">首页</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-purple-600">分类</Link>
            <span>/</span>
            <Link href={`/categories/${tool.type}`} className="hover:text-purple-600">
              {categoryInfo.name[lang] || categoryInfo.name.en}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">{tool.name[lang] || tool.name.en}</span>
          </nav>

          {/* 工具详情 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center text-4xl">
                {tool.icon}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {tool.name[lang] || tool.name.en}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  {tool.desc[lang] || tool.desc.en}
                </p>
                <div className="flex items-center gap-6">
                  <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                    {categoryInfo.name[lang] || categoryInfo.name.en}
                  </span>
                  <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      <span className="text-yellow-500 text-lg">⭐</span>
                      <span className="font-semibold">{tool.rating}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-blue-500 text-lg">👥</span>
                      <span className="font-semibold">{tool.users}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 标签 */}
            {tool.tags && tool.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 访问按钮 */}
            <div className="text-center">
              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-lg font-semibold transition-colors hover:scale-105"
              >
                {t('visit_website', '访问网站')}
              </a>
            </div>
          </div>

          {/* 相关工具推荐 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">相关工具</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiTools
                .filter(t => t.type === tool.type && t.id !== tool.id)
                .slice(0, 4)
                .map(relatedTool => (
                  <Link
                    key={relatedTool.id}
                    href={`/tools/${relatedTool.id}`}
                    className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center text-2xl">
                        {relatedTool.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {relatedTool.name[lang] || relatedTool.name.en}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {relatedTool.desc[lang] || relatedTool.desc.en}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = aiTools.map((tool) => ({
    params: { id: tool.id },
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