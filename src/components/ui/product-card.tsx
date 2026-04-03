'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from './button';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cart';
import { useLanguage } from '@/context/language-context';

const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { t } = useLanguage();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');

  const isHat = product.category === 'hats';
  const hatVariants = product.variants ?? [];

  const selectedVariantData = hatVariants.find((v) => v.label === selectedVariant);
  const displayImage = isHat
    ? (selectedVariantData?.images[0] ?? product.images[0])
    : (product.variants?.[0]?.images[0] ?? product.images[0]);

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceInCents / 100);
  };

  const handleAddToCart = () => {
    if (isHat && !selectedVariant) return;
    if (!isHat && !selectedSize) return;
    addItem(product, isHat ? selectedVariant : selectedSize);
  };

  const canAdd = product.inStock && (isHat ? !!selectedVariant : !!selectedSize);

  return (
    <div className="group flex flex-col border-2 border-foreground bg-background">
      <Link href={`/shop/${product.id}`} className="relative block aspect-square overflow-hidden">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <span className="text-lg font-bold uppercase tracking-widest text-white">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col border-t-2 border-foreground p-3">
        <p className="text-xs uppercase tracking-widest text-gray-500">
          {product.category}
        </p>
        <Link href={`/shop/${product.id}`}>
          <h3 className="mt-1 transition-colors hover:text-accent">
            <span className="block text-[11.5px] sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-tight leading-tight whitespace-nowrap overflow-hidden">
              {product.name.split(' — ')[0]}
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 leading-tight mt-0.5">
              {isHat ? t.product.oneSize : (product.name.split(' — ')[1] ?? '\u00A0')}
            </span>
          </h3>
        </Link>

        <p className="mt-2 font-mono text-xl font-bold">
          {formatPrice(product.priceInCents)}
        </p>

        {/* Style dropdown for hats / Size dropdown for clothing */}
        <div className="mt-3 flex gap-2">
          <select
            value={isHat ? selectedVariant : selectedSize}
            onChange={(e) => isHat ? setSelectedVariant(e.target.value) : setSelectedSize(e.target.value)}
            className="flex-1 min-w-0 border-2 border-foreground bg-background px-1 py-2 text-[10px] font-bold uppercase tracking-normal sm:tracking-widest focus:border-accent focus:outline-none"
          >
            <option value="">{isHat ? t.product.style : t.product.size}</option>
            {isHat
              ? hatVariants.map((v) => (
                  <option key={v.label} value={v.label}>{v.label}</option>
                ))
              : SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))
            }
          </select>
          <Button
            variant="accent"
            size="md"
            className="flex-1 min-w-0 flex items-center justify-center"
            onClick={handleAddToCart}
            disabled={!canAdd}
          >
            <span className="hidden sm:inline whitespace-nowrap">
              {product.inStock ? t.product.addToCart : t.product.soldOut}
            </span>
            <ShoppingBag size={16} className="sm:hidden" />
          </Button>
        </div>
      </div>
    </div>
  );
};
