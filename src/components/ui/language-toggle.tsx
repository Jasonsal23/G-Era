'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/language-context';
import type { Locale } from '@/data/translations';

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'es', label: 'ES', flag: '🇲🇽' },
];

export const LanguageToggle = () => {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === locale) ?? languages[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 border-2 border-foreground px-2 py-1 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background"
        aria-label="Select language"
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 border-2 border-foreground bg-background">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background ${
                locale === lang.code ? 'bg-foreground text-background' : ''
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
