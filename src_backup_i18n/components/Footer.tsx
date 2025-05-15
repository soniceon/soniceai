import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'next-i18next';

export default function Footer() {
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation('common');
  const siteName = t('auto_soniceai_3c5c91');
  const langs = [
    { code: 'zh', label: '简体中文' },
    { code: 'en', label: t('auto_english_78463a') },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'de', label: t('auto_deutsch_8f0ca2') },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'ru', label: 'Русский' },
  ];
  const copyright = {
    zh: '版权所有',
    en: t('auto_all_rights_reserved_1efc10'),
    ja: '全著作権所有。',
    ko: '판권 소유.',
    de: t('auto_alle_rechte_vorbehalten_e642c4'),
    fr: 'Tous droits réservés.',
    es: t('auto_todos_los_derechos_reservados_5577b0'),
    ru: 'Все права защищены.'
  } as const;
  type LangKey = keyof typeof copyright;
  const langKey = (['zh','en','ja','ko','de','fr','es','ru'].includes(lang) ? lang : 'en') as LangKey;

  return (
    <footer className="bg-[#ede9fe] dark:bg-[#232136] border-t border-gray-200 dark:border-gray-800 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2">
        <div className="text-2xl font-bold text-purple-700">{siteName}</div>
        <div className="flex flex-wrap justify-center gap-3 text-gray-500 text-sm mb-1">
          {langs.map(l => (
            <span
              key={l.code}
              className={`hover:text-purple-700 cursor-pointer underline-offset-2 transition font-bold ${lang === l.code ? 'text-purple-700 dark:text-purple-300 underline' : ''}`}
              onClick={() => setLang(l.code)}
            >
              {l.label}
            </span>
          ))}
        </div>
        <div className="text-gray-400 dark:text-gray-500 text-xs">© 2025 {siteName}. {copyright[langKey]}</div>
      </div>
    </footer>
  );
} 