import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about G.Era — a street luxury brand born from belico culture, blinged-out style, and zero apologies.',
  openGraph: {
    title: 'About | G.Era',
    description: 'Learn about G.Era — a street luxury brand born from belico culture.',
    url: 'https://g-era.com/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
