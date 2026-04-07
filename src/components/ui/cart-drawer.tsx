'use client';

import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { Button } from './button';
import { useCartStore } from '@/store/cart';
import { useLanguage } from '@/context/language-context';

const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

export const CartDrawer = () => {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, updateItemVariant } = useCartStore();
  const { t } = useLanguage();

  const totalPriceInCents = items.reduce(
    (total, item) => total + item.product.priceInCents * item.quantity,
    0
  );

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceInCents / 100);
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            priceId: item.product.stripePriceId,
            productId: item.product.id,
            quantity: item.quantity,
            priceInCents: item.product.priceInCents,
            productName: item.product.name,
            variantLabel: item.selectedVariant,
          })),
        }),
      });

      const data = await response.json();

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => setCartOpen(false)}
      />
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l-2 border-foreground bg-background">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b-2 border-foreground p-4">
            <div className="flex items-center gap-2">
              <ShoppingBag size={24} />
              <h2 className="text-lg font-bold uppercase tracking-wider">
                {t.cart.title} ({items.length})
              </h2>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-2 transition-colors hover:bg-foreground hover:text-background"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag size={64} className="mb-4 text-gray-300" />
                <p className="text-lg font-bold uppercase">{t.cart.empty}</p>
                <p className="mt-2 text-sm text-gray-500">{t.cart.emptySubtitle}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}:${item.selectedVariant ?? ''}`}
                    className="flex gap-4 border-2 border-foreground p-3"
                  >
                    <div className="relative h-20 w-20 shrink-0">
                      {(() => {
                        const variantImg = item.product.category === 'hats'
                          ? item.product.variants?.find((v) => v.label === item.selectedVariant)?.images[0]
                          : undefined;
                        const imgSrc = variantImg ?? item.product.images[0];
                        return imgSrc ? (
                          <Image
                            src={imgSrc}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100">
                            <span className="text-xs text-gray-400">No img</span>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-bold uppercase text-sm">
                          {item.product.name}
                        </h3>
                        {item.product.category === 'hats' ? (
                          <select
                            value={item.selectedVariant ?? ''}
                            onChange={(e) => updateItemVariant(item.product.id, item.selectedVariant, e.target.value)}
                            className="mt-1 border border-foreground bg-background px-1 py-0.5 text-[10px] font-bold uppercase tracking-widest focus:border-accent focus:outline-none"
                          >
                            {item.product.variants?.map((v) => (
                              <option key={v.label} value={v.label}>{v.label}</option>
                            ))}
                          </select>
                        ) : (
                          <select
                            value={item.selectedVariant ?? ''}
                            onChange={(e) => updateItemVariant(item.product.id, item.selectedVariant, e.target.value)}
                            className="mt-1 border border-foreground bg-background px-1 py-0.5 text-[10px] font-bold uppercase tracking-widest focus:border-accent focus:outline-none"
                          >
                            {SIZES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        )}
                        <p className="font-mono text-sm mt-1">
                          {formatPrice(item.product.priceInCents)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border-2 border-foreground">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)
                            }
                            className="p-1 transition-colors hover:bg-foreground hover:text-background"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 font-mono text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant)
                            }
                            className="p-1 transition-colors hover:bg-foreground hover:text-background"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedVariant)}
                          className="text-sm uppercase tracking-wider text-gray-500 hover:text-foreground"
                        >
                          {t.cart.remove}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t-2 border-foreground p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-bold uppercase">{t.cart.total}</span>
                <span className="font-mono text-xl font-bold">
                  {formatPrice(totalPriceInCents)}
                </span>
              </div>
              <Button
                variant="accent"
                size="lg"
                className="w-full"
                onClick={handleCheckout}
              >
                {t.cart.checkout}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
