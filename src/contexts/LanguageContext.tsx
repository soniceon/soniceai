import { createContext, useContext, useState, useEffect } from 'react';
import { LANGS } from '@/locales';

const defaultLang = 'en';

export const LanguageContext = createContext({
  lang: defaultLang,
  setLang: (l: string) => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState(defaultLang);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const navLang = navigator.language?.split('-')[0];
      const supported = ['zh','en','ja','ko','de','fr','es','ru'];
      if (supported.includes(navLang) && navLang !== lang) {
        setLang(navLang);
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
} 