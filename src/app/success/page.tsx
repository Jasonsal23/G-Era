'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { useLanguage } from '@/context/language-context';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart, setCartOpen } = useCartStore();
  const { t } = useLanguage();

  useEffect(() => {
    if (sessionId) {
      clearCart();
      setCartOpen(false);
    }
  }, [sessionId, clearCart, setCartOpen]);

  return (
    <div className="min-h-screen">
      <section className="flex min-h-[70vh] items-center justify-center py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center border-2 border-accent">
            <CheckCircle size={48} className="text-accent" />
          </div>

          <h1 className="text-4xl font-black uppercase tracking-tighter md:text-5xl">
            {t.success.title}
          </h1>

          <p className="mt-4 font-mono text-lg text-gray-600">{t.success.subtitle}</p>

          <p className="mt-6 font-mono text-sm text-gray-500">{t.success.body}</p>

          {sessionId && (
            <p className="mt-4 font-mono text-xs text-gray-400">
              {t.success.orderRef}: {sessionId.slice(0, 20)}...
            </p>
          )}

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/shop">
              <Button variant="accent" size="lg">
                {t.success.continueShopping}
              </Button>
            </Link>
            <Link href="/">
              <Button variant="primary" size="lg">
                {t.success.returnHome}
              </Button>
            </Link>
          </div>

          <div className="mt-16 border-t-2 border-foreground pt-8">
            <h3 className="text-lg font-bold uppercase tracking-tight">{t.success.whatsNext}</h3>
            <ul className="mt-4 space-y-3 font-mono text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-accent">1.</span>
                <span>{t.success.step1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">2.</span>
                <span>{t.success.step2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">3.</span>
                <span>{t.success.step3}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
