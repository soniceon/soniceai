import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const LANGS = ['zh', 'en', 'ja', 'ko', 'de', 'fr', 'es', 'ru'] as const;
type Lang = typeof LANGS[number];

const categories = [
  { type: 'chatbot', icon: "💬", label: { zh: "聊天机器人", en: "Chatbot", ja: "チャットボット", ko: "챗봇", de: "Chatbot", fr: "Chatbot", es: "Chatbot", ru: "Чат-бот" }, color: "text-cyan-500" },
  { type: 'image', icon: "🖼️", label: { zh: "图像生成", en: "Image Generation", ja: "画像生成", ko: "이미지 생성", de: "Bildgenerierung", fr: "Génération d'image", es: "Generación de imágenes", ru: "Генерация изображений" }, color: "text-orange-400" },
  { type: 'coding', icon: "💻", label: { zh: "代码助手", en: "Coding", ja: "コーディング", ko: "코딩", de: "Programmierung", fr: "Codage", es: "Codificación", ru: "Кодинг" }, color: "text-blue-500" },
  { type: 'productivity', icon: "📝", label: { zh: "效率工具", en: "Productivity", ja: "生産性", ko: "생산성", de: "Produktivität", fr: "Productivité", es: "Productividad", ru: "Продуктивность" }, color: "text-orange-500" },
  { type: 'design', icon: "🎨", label: { zh: "设计", en: "Design", ja: "デザイン", ko: "디자인", de: "Design", fr: "Design", es: "Diseño", ru: "Дизайн" }, color: "text-gray-700" },
  { type: 'writing', icon: "✍️", label: { zh: "写作", en: "Writing", ja: "執筆", ko: "글쓰기", de: "Schreiben", fr: "Écriture", es: "Escritura", ru: "Письмо" }, color: "text-green-500" },
  { type: 'media', icon: "🎬", label: { zh: "音视频", en: "Media", ja: "メディア", ko: "미디어", de: "Medien", fr: "Médias", es: "Medios", ru: "Медиа" }, color: "text-pink-500" },
  { type: 'marketing', icon: "📢", label: { zh: "营销", en: "Marketing", ja: "マーケティング", ko: "마케팅", de: "Marketing", fr: "Marketing", es: "Marketing", ru: "Маркетинг" }, color: "text-red-500" },
  { type: 'security', icon: "🔒", label: { zh: "安全", en: "Security", ja: "セキュリティ", ko: "보안", de: "Sicherheit", fr: "Sécurité", es: "Seguridad", ru: "Безопасность" }, color: "text-black" },
];

import Link from 'next/link';

export default function Sidebar() {
  const { lang } = useLanguage();
  const safeLang = (LANGS.includes(lang as Lang) ? lang : 'en') as Lang;
  const [hover, setHover] = useState(false);

  return (
    <aside
      className="hidden md:flex fixed top-20 left-0 z-40 h-[calc(100vh-2rem)] w-24 hover:w-64 bg-white shadow-lg rounded-r-2xl flex-col py-2 gap-1 border-r border-gray-100 dark:bg-gray-900 dark:border-gray-800 group transition-all duration-200 overflow-y-auto"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {categories.map((cat, idx) => (
        <Link
          key={cat.type}
          href={`/#${cat.type}`}
          className="flex items-center gap-2 px-5 py-1.5 font-medium transition rounded-l-full group"
        >
          <span className={`text-lg ${cat.color}`}>{cat.icon}</span>
          <span
            className={`text-sm text-gray-700 dark:text-gray-200 transition-all duration-200 truncate
              ${hover ? 'opacity-100 ml-2' : 'opacity-0 ml-[-8px] w-0 overflow-hidden'}
            `}
            style={{ minWidth: hover ? 60 : 0 }}
          >
            {cat.label[safeLang]}
          </span>
        </Link>
      ))}
    </aside>
  );
} 