import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/ui/header';
import { AnnouncementBar } from '@/components/ui/announcement-bar';
import { CartDrawer } from '@/components/ui/cart-drawer';
import { Footer } from '@/components/ui/footer';
import { EmailPopup } from '@/components/ui/email-popup';
import { LanguageProvider } from '@/context/language-context';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'G.Era',
  description: 'Premium merchandise with minimalist editorial design',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          <AnnouncementBar />
          <Header />
          <main>{children}</main>
          <CartDrawer />
          <EmailPopup />
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
