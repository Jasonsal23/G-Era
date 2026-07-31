'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckoutUpsellReel } from '@/components/ui/checkout-upsell-reel';
import { useCartStore } from '@/store/cart';
import { useInventoryStore } from '@/store/inventory';
import { useLanguage } from '@/context/language-context';
import { SHIPPING_RATES } from '@/lib/shipping';
import type { ShippingMethod } from '@/types';

const SHIPPING_METHODS: ShippingMethod[] = ['free', 'express'];
const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, updateItemVariant } = useCartStore();
  const getStock = useInventoryStore((s) => s.getStock);
  const { t } = useLanguage();
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('free');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percentOff: number; label: string } | null>(null);
  const [promoStatus, setPromoStatus] = useState<'idle' | 'checking' | 'invalid'>('idle');

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceInCents / 100);
  };

  const subtotalInCents = items.reduce(
    (total, item) => total + item.product.priceInCents * item.quantity,
    0
  );
  const shippingCostInCents = SHIPPING_RATES[shippingMethod].costInCents;
  const discountInCents = appliedPromo
    ? Math.round((subtotalInCents * appliedPromo.percentOff) / 100)
    : 0;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoStatus('checking');
    try {
      const response = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoInput }),
      });
      const data = await response.json();
      if (data.valid) {
        setAppliedPromo({ code: data.code, percentOff: data.percentOff, label: data.label });
        setPromoStatus('idle');
      } else {
        setAppliedPromo(null);
        setPromoStatus('invalid');
      }
    } catch (err) {
      console.error('Promo validation error:', err);
      setAppliedPromo(null);
      setPromoStatus('invalid');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoStatus('idle');
  };

  const handleContinue = async () => {
    setIsSubmitting(true);
    setError(false);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            priceInCents: item.product.priceInCents,
            productName: item.product.name,
            variantLabel: item.selectedVariant,
          })),
          shippingMethod,
          promoCode: appliedPromo?.code,
        }),
      });

      const data = await response.json();

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        setError(true);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(true);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={64} className="mb-4 text-gray-300" />
        <p className="text-lg font-bold uppercase">{t.checkout.empty}</p>
        <p className="mt-2 text-sm text-gray-500">{t.checkout.emptySubtitle}</p>
        <Link href="/shop" className="mt-6">
          <Button variant="accent" size="lg">
            {t.checkout.shopBtn}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl px-4">
      <h1 className="text-3xl font-black uppercase tracking-tighter md:text-4xl">
        {t.checkout.title}
      </h1>

      <section className="mt-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          {t.checkout.orderSummary}
        </h2>
        <div className="mt-3 space-y-3">
          {items.map((item) => (
            <div
              key={`${item.product.id}:${item.selectedVariant ?? ''}`}
              className="flex gap-4 border-2 border-foreground p-3"
            >
              <div className="relative h-16 w-16 shrink-0">
                {(() => {
                  const variantImg = item.product.category === 'hats'
                    ? item.product.variants?.find((v) => v.label === item.selectedVariant)?.images[0]
                    : undefined;
                  const imgSrc = variantImg ?? item.product.images[0];
                  return imgSrc ? (
                    <Image src={imgSrc} alt={item.product.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <span className="text-xs text-gray-400">No img</span>
                    </div>
                  );
                })()}
              </div>
              <div className="flex flex-1 flex-col justify-between gap-2">
                <div className="flex items-start justify-between">
                  <p className="font-bold uppercase text-sm">{item.product.name}</p>
                  <p className="font-mono text-sm font-bold">
                    {formatPrice(item.product.priceInCents * item.quantity)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {item.product.category === 'hats' ? (
                    <select
                      value={item.selectedVariant ?? ''}
                      onChange={(e) => updateItemVariant(item.product.id, item.selectedVariant, e.target.value)}
                      className="border border-foreground bg-background px-1 py-0.5 text-[10px] font-bold uppercase tracking-widest focus:border-accent focus:outline-none"
                    >
                      {item.product.variants?.map((v) => (
                        <option key={v.label} value={v.label}>{v.label}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={item.selectedVariant ?? ''}
                      onChange={(e) => updateItemVariant(item.product.id, item.selectedVariant, e.target.value)}
                      className="border border-foreground bg-background px-1 py-0.5 text-[10px] font-bold uppercase tracking-widest focus:border-accent focus:outline-none"
                    >
                      {SIZES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  )}

                  {(() => {
                    const stock = getStock(item.product.id, item.selectedVariant ?? '');
                    const atMax = item.quantity >= stock;
                    return (
                      <div className="flex flex-col">
                        <div className="flex items-center border-2 border-foreground">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
                            className="p-1 transition-colors hover:bg-foreground hover:text-background"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-2 font-mono text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant)}
                            disabled={atMax}
                            className="p-1 transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        {atMax && (
                          <p className="mt-0.5 text-[9px] uppercase tracking-wide text-gray-400">
                            {t.cart.maxStock}
                          </p>
                        )}
                      </div>
                    );
                  })()}

                  <button
                    onClick={() => removeItem(item.product.id, item.selectedVariant)}
                    className="text-xs uppercase tracking-wider text-gray-500 hover:text-foreground"
                  >
                    {t.cart.remove}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          {t.checkout.shipping}
        </h2>
        <div className="mt-3 space-y-2">
          {SHIPPING_METHODS.map((method) => {
            const rate = SHIPPING_RATES[method];
            return (
              <label
                key={method}
                className="flex cursor-pointer items-center justify-between border-2 border-foreground px-4 py-3 text-sm font-bold uppercase tracking-wide has-[:checked]:bg-foreground has-[:checked]:text-background"
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={method}
                    checked={shippingMethod === method}
                    onChange={() => setShippingMethod(method)}
                    className="accent-accent"
                  />
                  {rate.label}
                </span>
                <span>{rate.costInCents === 0 ? t.checkout.free : formatPrice(rate.costInCents)}</span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          {t.checkout.promoCode}
        </h2>
        {appliedPromo ? (
          <div className="mt-3 flex items-center justify-between border-2 border-accent bg-accent/10 px-4 py-3 text-sm font-bold uppercase tracking-wide">
            <span>{appliedPromo.code} — {appliedPromo.label} {t.checkout.promoApplied}</span>
            <button
              onClick={handleRemovePromo}
              className="text-xs uppercase tracking-wider text-gray-500 hover:text-foreground"
            >
              {t.checkout.promoRemove}
            </button>
          </div>
        ) : (
          <div className="mt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  if (promoStatus === 'invalid') setPromoStatus('idle');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyPromo();
                  }
                }}
                placeholder={t.checkout.promoPlaceholder}
                className="flex-1 border-2 border-foreground bg-background px-4 py-3 text-sm uppercase tracking-wide focus:border-accent focus:outline-none"
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleApplyPromo}
                disabled={promoStatus === 'checking' || !promoInput.trim()}
              >
                {promoStatus === 'checking' ? t.checkout.promoChecking : t.checkout.promoApply}
              </Button>
            </div>
            {promoStatus === 'invalid' && (
              <p className="mt-2 text-xs font-bold text-red-600">{t.checkout.promoInvalid}</p>
            )}
          </div>
        )}
      </section>

      <section className="mt-8 border-t-2 border-foreground pt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="uppercase text-gray-500">{t.checkout.subtotal}</span>
          <span className="font-mono">{formatPrice(subtotalInCents)}</span>
        </div>
        {appliedPromo && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="uppercase text-gray-500">{t.checkout.discount}</span>
            <span className="font-mono text-accent">-{formatPrice(discountInCents)}</span>
          </div>
        )}
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="uppercase text-gray-500">{t.checkout.shipping}</span>
          <span className="font-mono">
            {shippingCostInCents === 0 ? t.checkout.free : formatPrice(shippingCostInCents)}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t-2 border-foreground pt-4">
          <span className="text-lg font-bold uppercase">{t.checkout.total}</span>
          <span className="font-mono text-xl font-bold">
            {formatPrice(subtotalInCents - discountInCents + shippingCostInCents)}
          </span>
        </div>

        {error && (
          <p className="mt-4 text-sm font-bold text-red-600">{t.checkout.error}</p>
        )}

        <Button
          variant="accent"
          size="lg"
          className="mt-6 w-full"
          onClick={handleContinue}
          disabled={isSubmitting}
        >
          {isSubmitting ? t.checkout.processing : t.checkout.continueToPayment}
        </Button>
        <Link href="/shop" className="mt-3 block text-center text-sm uppercase tracking-wider text-gray-500 hover:text-foreground">
          {t.checkout.backToCart}
        </Link>
      </section>
      </div>

      <div className="mt-12 border-t-2 border-foreground pt-8">
        <CheckoutUpsellReel />
      </div>
    </div>
  );
}
