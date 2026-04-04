'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/language-context';

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t-2 border-foreground py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-6">
          <p className="text-xl font-black uppercase tracking-tighter">G.Era</p>
          <div className="flex items-center gap-4">
            <a href="https://instagram.com/g.era21" target="_blank" rel="noopener noreferrer" className="p-2 transition-colors hover:text-accent" aria-label="Follow us on Instagram">
              <InstagramIcon size={24} />
            </a>
            <a href="https://tiktok.com/@g.era75" target="_blank" rel="noopener noreferrer" className="p-2 transition-colors hover:text-accent" aria-label="Follow us on TikTok">
              <TikTokIcon size={24} />
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs uppercase tracking-widest text-gray-500">
            <Link href="/accessibility" className="transition-colors hover:text-accent">{t.footer.accessibility}</Link>
            <span className="hidden sm:inline">|</span>
            <Link href="/privacy" className="transition-colors hover:text-accent">{t.footer.privacy}</Link>
            <span className="hidden sm:inline">|</span>
            <Link href="/terms" className="transition-colors hover:text-accent">{t.footer.terms}</Link>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
            &copy; {new Date().getFullYear()} G.Era. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};
