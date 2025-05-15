import { useRef } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { useTranslation } from 'next-i18next';
import { withTranslationReady } from './hoc/withTranslationReady';

export default withTranslationReady(function Hero() {
  const { keyword, setKeyword } = useSearch();
  const { t } = useTranslation('common');
  // 滚动到 ToolGrid
  const handleSearch = () => {
    const el = document.getElementById('toolgrid-anchor');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="w-full bg-[#ede9fe] dark:bg-[#232136] py-16">
      <section className="max-w-7xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">{t('hero_title')}</h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8 max-w-2xl mx-auto">
          {t('hero_desc')}
        </p>
        <div className="flex justify-center mb-8">
          <input
            className="rounded-l-lg px-4 py-3 border-0 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none w-80 max-w-full shadow"
            placeholder={t('hero_placeholder')}
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => { if (e.key === t('auto_enter_f1851d')) handleSearch(); }}
          />
          <button
            className="rounded-r-lg bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 font-semibold transition shadow"
            onClick={handleSearch}
          >
            {t('hero_search')}
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-purple-700 dark:text-purple-300 text-base font-medium">
          <span className="flex items-center gap-2"><span className="text-xl">🛠️</span> {t('hero_stats_tools')}</span>
          <span className="flex items-center gap-2"><span className="text-xl">📚</span> {t('hero_stats_cats')}</span>
          <span className="flex items-center gap-2"><span className="text-xl">👥</span> {t('hero_stats_users')}</span>
        </div>
      </section>
    </div>
  );
}); 