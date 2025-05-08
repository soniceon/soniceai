import { useRef } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { useLanguage } from '@/contexts/LanguageContext';

const messages = {
  title: {
    zh: '发现最佳AI工具',
    en: 'Discover the Best AI Tools',
    ja: '最高のAIツールを発見',
    ko: '최고의 AI 도구 발견',
    de: 'Entdecke die besten KI-Tools',
    fr: 'Découvrez les meilleurs outils IA',
    es: 'Descubre las mejores herramientas de IA',
    ru: 'Откройте лучшие AI-инструменты',
  },
  desc: {
    zh: '探索、对比并使用顶级AI工具，提升你的工作与创造力',
    en: 'Explore, compare and use top AI tools to enhance your work and creativity',
    ja: '仕事や創造性を高めるために、トップAIツールを探索、比較、活用しましょう',
    ko: '작업과 창의성을 향상시키기 위해 최고의 AI 도구를 탐색, 비교 및 사용하세요',
    de: 'Erkunde, vergleiche und nutze Top-KI-Tools, um deine Arbeit und Kreativität zu verbessern',
    fr: 'Explorez, comparez et utilisez les meilleurs outils IA pour améliorer votre travail et votre créativité',
    es: 'Explora, compara y utiliza las mejores herramientas de IA para potenciar tu trabajo y creatividad',
    ru: 'Изучайте, сравнивайте и используйте лучшие AI-инструменты для повышения эффективности и творчества',
  },
  placeholder: {
    zh: '搜索AI工具、模型或用例...',
    en: 'Search AI tools, models or use cases...',
    ja: 'AIツール、モデルまたはユースケースを検索...',
    ko: 'AI 도구, 모델 또는 사용 사례 검색...',
    de: 'KI-Tools, Modelle oder Anwendungsfälle suchen...',
    fr: 'Recherchez des outils IA, des modèles ou des cas d\'utilisation...',
    es: 'Buscar herramientas IA, modelos o casos de uso...',
    ru: 'Поиск AI-инструментов, моделей или кейсов...'
  },
  search: {
    zh: '搜索',
    en: 'Search',
    ja: '検索',
    ko: '검색',
    de: 'Suchen',
    fr: 'Recherche',
    es: 'Buscar',
    ru: 'Поиск'
  },
  stats: {
    tools: {
      zh: '20,000+ 款AI工具',
      en: '20,000+ AI tools',
      ja: '20,000+ AIツール',
      ko: '20,000+ AI 도구',
      de: '20.000+ KI-Tools',
      fr: '20 000+ outils IA',
      es: '20.000+ herramientas IA',
      ru: '20 000+ AI-инструментов',
    },
    cats: {
      zh: '150+ 分类',
      en: '150+ categories',
      ja: '150+ カテゴリ',
      ko: '150+ 카테고리',
      de: '150+ Kategorien',
      fr: '150+ catégories',
      es: '150+ categorías',
      ru: '150+ категорий',
    },
    users: {
      zh: '100万+ 专业用户',
      en: 'Used by 1M+ professionals',
      ja: '100万+ プロユーザー',
      ko: '100만+ 전문가 사용',
      de: 'Von 1M+ Profis genutzt',
      fr: 'Utilisé par 1M+ professionnels',
      es: 'Usado por 1M+ profesionales',
      ru: 'Используется 1M+ профессионалами',
    }
  }
} as const;

type LangKey = keyof typeof messages.title;

export default function Hero() {
  const { keyword, setKeyword } = useSearch();
  const { lang } = useLanguage();
  const langKey = (['zh','en','ja','ko','de','fr','es','ru'].includes(lang) ? lang : 'en') as LangKey;
  // 滚动到 ToolGrid
  const handleSearch = () => {
    const el = document.getElementById('toolgrid-anchor');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="w-full bg-[#ede9fe] dark:bg-[#232136] py-16">
      <section className="max-w-7xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">{messages.title[langKey]}</h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8 max-w-2xl mx-auto">
          {messages.desc[langKey]}
        </p>
        <div className="flex justify-center mb-8">
          <input
            className="rounded-l-lg px-4 py-3 border-0 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none w-80 max-w-full shadow"
            placeholder={messages.placeholder[langKey]}
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
          />
          <button
            className="rounded-r-lg bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 font-semibold transition shadow"
            onClick={handleSearch}
          >
            {messages.search[langKey]}
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-purple-700 dark:text-purple-300 text-base font-medium">
          <span className="flex items-center gap-2"><span className="text-xl">🛠️</span> {messages.stats.tools[langKey]}</span>
          <span className="flex items-center gap-2"><span className="text-xl">📚</span> {messages.stats.cats[langKey]}</span>
          <span className="flex items-center gap-2"><span className="text-xl">👥</span> {messages.stats.users[langKey]}</span>
        </div>
      </section>
    </div>
  );
} 