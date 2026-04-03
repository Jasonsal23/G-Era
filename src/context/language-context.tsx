'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Locale } from '@/data/translations';

interface LanguageContextValue {
  locale: Locale;
  t: typeof translations.en;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('gera-locale') as Locale | null;
    if (saved === 'en' || saved === 'es') {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('gera-locale', newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};
