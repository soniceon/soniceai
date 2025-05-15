import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

interface LanguageSwitcherProps {
  onClose: () => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ onClose }) => {
  const router = useRouter();
  const { pathname, asPath, query } = router;
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation('common');
  
  // Handle click outside to close the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const languages = [
    { code: 'en', name: t('auto_english_78463a'), flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'de', name: t('auto_deutsch_8f0ca2'), flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];
  
  const handleLanguageChange = (locale: string) => {
    router.push({ pathname, query }, asPath, { locale });
    setIsOpen(false);
    onClose();
  };
  
  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#232136] text-white hover:bg-[#393552] shadow transition"
      >
        <span>{router.locale ? languages.find(l => l.code === router.locale)?.flag : '🌐'}</span>
        <span className="font-semibold">{router.locale ? languages.find(l => l.code === router.locale)?.name : t('auto_language_4994a8')}</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-2xl bg-[#232136] border border-[#393552] py-2 z-50 animate-fade-in">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`flex items-center gap-2 w-full px-4 py-2 text-base rounded-lg transition ${
                router.locale === language.code
                  ? 'bg-[#393552] text-purple-300 font-bold'
                  : 'text-gray-200 hover:bg-[#393552] hover:text-purple-200'
              }`}
            >
              <span className="w-6 text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;