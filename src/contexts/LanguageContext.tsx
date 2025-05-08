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

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
} 