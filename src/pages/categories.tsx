import { aiTools } from '@/data/aiTools';
import { useLanguage } from '@/contexts/LanguageContext';

const categories = [
  { type: 'chatbot', icon: '💬', label: { zh: '聊天机器人', en: 'Chatbot', ja: 'チャットボット', ko: '챗봇', de: 'Chatbot', fr: 'Chatbot', es: 'Chatbot', ru: 'Чат-бот' } },
  { type: 'image', icon: '🖼️', label: { zh: '图像生成', en: 'Image Generation', ja: '画像生成', ko: '이미지 생성', de: 'Bildgenerierung', fr: 'Génération d\'image', es: 'Generación de imágenes', ru: 'Генерация изображений' } },
  { type: 'coding', icon: '💻', label: { zh: '代码助手', en: 'Coding', ja: 'コーディング', ko: '코딩', de: 'Programmierung', fr: 'Codage', es: 'Codificación', ru: 'Кодинг' } },
  { type: 'productivity', icon: '📝', label: { zh: '效率工具', en: 'Productivity', ja: '生産性', ko: '생산성', de: 'Produktivität', fr: 'Productivité', es: 'Productividad', ru: 'Продуктивность' } },
  { type: 'design', icon: '🎨', label: { zh: '设计', en: 'Design', ja: 'デザイン', ko: '디자인', de: 'Design', fr: 'Design', es: 'Diseño', ru: 'Дизайн' } },
  { type: 'writing', icon: '✍️', label: { zh: '写作', en: 'Writing', ja: '執筆', ko: '글쓰기', de: 'Schreiben', fr: 'Écriture', es: 'Escritura', ru: 'Письмо' } },
  { type: 'media', icon: '🎬', label: { zh: '音视频', en: 'Media', ja: 'メディア', ko: '미디어', de: 'Medien', fr: 'Médias', es: 'Medios', ru: 'Медиа' } },
  { type: 'marketing', icon: '📢', label: { zh: '营销', en: 'Marketing', ja: 'マーケティング', ko: '마케팅', de: 'Marketing', fr: 'Marketing', es: 'Marketing', ru: 'Маркетинг' } },
];

export default function CategoriesPage() {
  const { lang } = useLanguage();
  const langKey = (['zh','en','ja','ko','de','fr','es','ru'].includes(lang) ? lang : 'en') as keyof typeof categories[0]['label'];

  return (
    <div className="max-w-7xl mx-auto w-full px-4">
      <h1 className="text-3xl font-bold mb-6 mt-8">{langKey === 'zh' ? 'AI工具分类' : langKey === 'en' ? 'AI Tool Categories' : langKey === 'ja' ? 'AIツールカテゴリ' : langKey === 'ko' ? 'AI 도구 분류' : langKey === 'de' ? 'KI-Tool-Kategorien' : langKey === 'fr' ? 'Catégories d\'outils IA' : langKey === 'es' ? 'Categorías de herramientas IA' : langKey === 'ru' ? 'Категории AI-инструментов' : 'AI Tool Categories'}</h1>
      <div className="space-y-16">
        {categories.map(cat => {
          const tools = aiTools.filter(t => t.type === cat.type);
          return (
            <section key={cat.type} id={cat.type} className="mb-12">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-purple-700 dark:text-purple-300">
                <span className="text-xl">{cat.icon}</span>
                {cat.label[langKey]}
              </h2>
              {tools.length === 0 ? (
                <div className="text-gray-400 mb-8">{langKey === 'zh' ? '暂无该分类工具' : 'No tools in this category yet.'}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                  {tools.map(tool => (
                    <div key={tool.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col items-start border border-gray-100 dark:border-gray-800">
                      <span className="text-3xl mb-2">{tool.icon}</span>
                      <div className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{tool.name[langKey]}</div>
                      <div className="text-xs text-purple-600 dark:text-purple-300 mb-2">{cat.label[langKey]}</div>
                      <div className="text-gray-500 dark:text-gray-300 text-sm mb-3 line-clamp-2">{tool.desc[langKey]}</div>
                      <div className="flex gap-2 text-xs text-gray-400 dark:text-gray-400 mb-2">
                        <span>⭐ {tool.rating}</span>
                        <span>👥 {tool.users}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {tool.tags.map(tag => (
                          <span key={tag} className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 px-2 py-0.5 rounded text-xs">{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
} 