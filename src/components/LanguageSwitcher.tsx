import { useRouter } from 'next/router';

const langs = [
  { code: 'zh', label: '中' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日' },
  { code: 'ko', label: '韩' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
  { code: 'es', label: 'ES' },
  { code: 'ru', label: 'RU' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const currentLang = router.locale || 'en';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    router.push(
      { pathname: router.pathname, query: router.query },
      undefined,
      { locale: newLang }
    );
  };

  return (
    <select
      value={currentLang}
      onChange={handleChange}
      className="w-16 h-9 rounded-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm font-bold text-center text-gray-900 dark:text-white"
      title="切换语言"
    >
      {langs.map(l => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
} 