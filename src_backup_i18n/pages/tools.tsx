import { aiTools } from '@/data/aiTools';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function ToolsPage() {
  const { lang } = useLanguage();
  const { t } = useTranslation('common');
  const langKey = (['zh','en','ja','ko','de','fr','es','ru'].includes(lang) ? lang : 'en') as keyof typeof aiTools[0]['name'];
  const sorted = [...aiTools].sort((a, b) => a.name[langKey].localeCompare(b.name[langKey]));
  return (
    <div className="max-w-7xl mx-auto w-full px-4">
      <h1 className="text-3xl font-bold mb-6 mt-8">{t('all_ai_tools')}</h1>
      {sorted.length === 0 ? (
        <div className="text-gray-400 mb-8">{t('no_tools')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
          {sorted.map(tool => (
            <Link key={tool.id} href={`/tools/${tool.id}`} className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col items-start border border-gray-100 dark:border-gray-800 hover:shadow-xl transition">
              <span className="text-3xl mb-2">{tool.icon}</span>
              <div className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{tool.name[langKey]}</div>
              <div className="text-xs text-purple-600 dark:text-purple-300 mb-2">{t(`type_${tool.type}`)}</div>
              <div className="text-gray-500 dark:text-gray-300 text-sm mb-3 line-clamp-2">{tool.desc[langKey]}</div>
              <div className="flex gap-2 text-xs text-gray-400 dark:text-gray-400 mb-2">
                <span>{t('rating')}: {tool.rating}</span>
                <span>{t('users')}: {tool.users}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-auto">
                {tool.tags.map(tag => (
                  <span key={tag} className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 px-2 py-0.5 rounded text-xs">{t(`tag_${tag}`) === `tag_${tag}` ? tag : t(`tag_${tag}`)}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 