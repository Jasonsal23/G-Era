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
  title: {
    default: 'G.Era | Street Luxe. No Apologies.',
    template: '%s | G.Era',
  },
  description: 'G.Era is a street luxury brand bringing blinged-out, belico energy to premium apparel and hats. Shop exclusive tees, hoodies, and snapbacks.',
  keywords: ['G.Era', 'street luxury', 'streetwear', 'blinged out', 'belico', 'hats', 'snapback', 'hoodies', 'tees', 'urban fashion'],
  metadataBase: new URL('https://g-era.com'),
  openGraph: {
    type: 'website',
    siteName: 'G.Era',
    title: 'G.Era | Street Luxe. No Apologies.',
    description: 'G.Era is a street luxury brand bringing blinged-out, belico energy to premium apparel and hats.',
    url: 'https://g-era.com',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'G.Era — Street Luxe. No Apologies.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'G.Era | Street Luxe. No Apologies.',
    description: 'G.Era is a street luxury brand bringing blinged-out, belico energy to premium apparel and hats.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
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
