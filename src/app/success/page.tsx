'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { useLanguage } from '@/context/language-context';
import type { OrderRecord } from '@/lib/orders';

const formatPrice = (priceInCents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(priceInCents / 100);
};

const SuccessContent = () => {
  const searchParams = useSearchParams();
  // Square's redirect isn't guaranteed to preserve our own ?ref= param — it
  // may append its own (checkoutId/orderId/transactionId) instead. Treat any
  // of these as proof a real checkout redirect happened, so the cart still
  // clears even if our custom param doesn't survive the round trip.
  const refId =
    searchParams.get('ref') ??
    searchParams.get('orderId') ??
    searchParams.get('transactionId') ??
    searchParams.get('checkoutId');
  // Order lookup only works with our own ?ref= — the fallback params above
  // aren't keys into our `orders` table.
  const ownRefId = searchParams.get('ref');
  const { clearCart, setCartOpen } = useCartStore();
  const { t } = useLanguage();
  const [order, setOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (refId) {
      clearCart();
      setCartOpen(false);
    }
  }, [refId, clearCart, setCartOpen]);

  useEffect(() => {
    if (!ownRefId) return;
    fetch(`/api/order/${ownRefId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOrder(data?.order ?? null))
      .catch(() => setOrder(null));
  }, [ownRefId]);

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

          {refId && (
            <p className="mt-4 font-mono text-xs text-gray-400">
              {t.success.orderRef}: {refId.slice(0, 20).toUpperCase()}...
            </p>
          )}

          {order && (
            <div className="mt-10 border-2 border-foreground text-left">
              <div className="flex items-center justify-between border-b-2 border-foreground p-4">
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  {t.success.orderNumber} {order.referenceId.slice(0, 8).toUpperCase()}
                </h2>
                <span className="border-2 border-foreground px-2 py-1 text-xs font-bold uppercase tracking-wide">
                  {order.status === 'completed' ? t.success.statusConfirmed : t.success.statusConfirming}
                </span>
              </div>

              <div className="space-y-3 p-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-bold uppercase">{item.name}</p>
                      <p className="font-mono text-xs text-gray-500">
                        {item.variantLabel ? `${item.variantLabel} · ` : ''}Qty {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono">{formatPrice(item.priceInCents * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-foreground p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="uppercase text-gray-500">{t.checkout.subtotal}</span>
                  <span className="font-mono">{formatPrice(order.subtotalInCents)}</span>
                </div>
                {order.discountInCents > 0 && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="uppercase text-gray-500">{t.checkout.discount}</span>
                    <span className="font-mono text-accent">-{formatPrice(order.discountInCents)}</span>
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <span className="uppercase text-gray-500">{t.checkout.shipping}</span>
                  <span className="font-mono">
                    {order.shippingInCents === 0 ? t.checkout.free : formatPrice(order.shippingInCents)}
                  </span>
                </div>
                {order.taxInCents > 0 && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="uppercase text-gray-500">{t.success.tax}</span>
                    <span className="font-mono">{formatPrice(order.taxInCents)}</span>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between border-t-2 border-foreground pt-4">
                  <span className="text-base font-bold uppercase">{t.checkout.total}</span>
                  <span className="font-mono text-lg font-bold">{formatPrice(order.totalInCents)}</span>
                </div>
              </div>
            </div>
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
};

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
