import type { Metadata } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/ui/header';
import { AnnouncementBar } from '@/components/ui/announcement-bar';
import { ChatbotCartBridge } from '@/components/ui/chatbot-cart-bridge';
import { CartDrawer } from '@/components/ui/cart-drawer';
import { Footer } from '@/components/ui/footer';
import { EmailPopup } from '@/components/ui/email-popup';
import { LanguageProvider } from '@/context/language-context';
import { InventoryLoader } from '@/components/ui/inventory-loader';
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
          <InventoryLoader />
          <CartDrawer />
          <EmailPopup />
          <ChatbotCartBridge />
          <Footer />
        </LanguageProvider>
        <script src="https://ai-chat-service-production-9741.up.railway.app/widget.js" data-client-id="g-era" data-server="https://ai-chat-service-production-9741.up.railway.app"></script>
      </body>
    </html>
  );
}
