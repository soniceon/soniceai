import { aiTools } from '@/data/aiTools';
import { useLanguage } from '@/contexts/LanguageContext';
const categories = [
  { type: 'chatbot', label: { zh: '聊天机器人', en: 'Chatbot', ja: 'チャットボット', ko: '챗봇', de: 'Chatbot', fr: 'Chatbot', es: 'Chatbot', ru: 'Чат-бот' }, icon: '💬' },
  { type: 'image', label: { zh: '图像生成', en: 'Image Generation', ja: '画像生成', ko: '이미지 생성', de: 'Bildgenerierung', fr: 'Génération d\'image', es: 'Generación de imágenes', ru: 'Генерация изображений' }, icon: '🖼️' },
  { type: 'coding', label: { zh: '代码助手', en: 'Coding', ja: 'コーディング', ko: '코딩', de: 'Programmierung', fr: 'Codage', es: 'Codificación', ru: 'Кодинг' }, icon: '💻' },
  { type: 'productivity', label: { zh: '效率工具', en: 'Productivity', ja: '生産性', ko: '생산성', de: 'Produktivität', fr: 'Productivité', es: 'Productividad', ru: 'Продуктивность' }, icon: '📝' },
  { type: 'design', label: { zh: '设计', en: 'Design', ja: 'デザイン', ko: '디자인', de: 'Design', fr: 'Design', es: 'Diseño', ru: 'Дизайн' }, icon: '🎨' },
  { type: 'writing', label: { zh: '写作', en: 'Writing', ja: '執筆', ko: '글쓰기', de: 'Schreiben', fr: 'Écriture', es: 'Escritura', ru: 'Письмо' }, icon: '✍️' },
  { type: 'media', label: { zh: '音视频', en: 'Media', ja: 'メディア', ko: '미디어', de: 'Medien', fr: 'Médias', es: 'Medios', ru: 'Медиа' }, icon: '🎬' },
  { type: 'marketing', label: { zh: '营销', en: 'Marketing', ja: 'マーケティング', ko: '마케팅', de: 'Marketing', fr: 'Marketing', es: 'Marketing', ru: 'Маркетинг' }, icon: '📢' },
];
type LangKey = keyof typeof categories[0]['label'];
type Tool = typeof aiTools[number];
export default function CategoryRanking() {
  const { lang } = useLanguage();
  const langKey: LangKey = (Object.keys(categories[0].label).includes(lang) ? lang : 'en') as LangKey;
  return (
    <div className="py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">{lang === 'zh' ? 'AI分类榜' : 'Category Ranking'}</h1>
      {categories.map(cat => {
        const tools = aiTools.filter((t: Tool) => t.type === cat.type);
        if (!tools.length) return null;
        return (
          <div key={cat.type} className="mb-10">
            <div className="flex items-center gap-2 mb-4 text-xl font-semibold">
              <span>{cat.icon}</span>
              <span>{cat.label[langKey]}</span>
              <span className="text-xs text-gray-400">({tools.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tools.map((tool: Tool, idx: number) => (
                <div key={tool.id} className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-lg font-bold">
                    <span>{tool.icon}</span>
                    <span>{tool.name[langKey] || tool.name.en}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">{tool.desc[langKey] || tool.desc.en}</div>
                  <div className="text-xs text-gray-400">⭐ {tool.rating} | 👥 {tool.users}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
} 