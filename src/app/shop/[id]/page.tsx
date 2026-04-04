'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronDown, ChevronLeft, ChevronRight, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/shop/product-grid';
import { getProductById, products } from '@/data/products';
import { useCartStore } from '@/store/cart';
import { useLanguage } from '@/context/language-context';
import type { Product } from '@/types';

const formatPrice = (priceInCents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(priceInCents / 100);
};

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const AccordionItem = ({ title, children, defaultOpen = false }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b-2 border-foreground">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold uppercase tracking-widest transition-colors hover:text-accent"
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <div className="font-mono text-sm text-gray-600">{children}</div>
      </div>
    </div>
  );
};

const getRelatedProducts = (currentProduct: Product, limit: number = 4): Product[] => {
  return products
    .filter((p) => p.id !== currentProduct.id && p.inStock)
    .slice(0, limit);
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = getProductById(productId);
  const addItem = useCartStore((state) => state.addItem);
  const { t } = useLanguage();
  const isHat = product?.category === 'hats';

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(isHat ? -1 : 0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const SIZES = product?.category === 'women' ? ['S', 'M', 'L', 'XL'] : ['S', 'M', 'L', 'XL', '2XL'];

  // Hats: show the selected variant's images (main + brim)
  // Clothing with variants: show one image per variant
  // No variants: show product images
  const displayImages = product?.variants
    ? isHat
      ? (product.variants[selectedVariantIndex]?.images ?? [])
      : product.variants.map((v) => v.images[0] ?? '')
    : product?.images ?? [];

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-black uppercase">Product Not Found</h1>
        <Link href="/shop" className="mt-4 text-accent hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product);

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="border-b-2 border-foreground">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest transition-colors hover:text-accent"
          >
            <ArrowLeft size={16} />
            {t.product.backToShop}
          </Link>
        </div>
      </div>

      {/* Product Section */}
      <section className="border-b-2 border-foreground py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden border-2 border-foreground">
                {displayImages[selectedImageIndex] ? (
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="relative h-full w-full cursor-zoom-in"
                  >
                    <Image
                      src={displayImages[selectedImageIndex]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </button>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 pointer-events-none">
                    <span className="text-2xl font-bold uppercase tracking-widest text-white">
                      Sold Out
                    </span>
                  </div>
                )}

                {/* Image Navigation Arrows */}
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev === 0 ? displayImages.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-foreground/70 transition-all hover:text-foreground hover:scale-110"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={32} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev === displayImages.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-foreground/70 transition-all hover:text-foreground hover:scale-110"
                      aria-label="Next image"
                    >
                      <ChevronRight size={32} strokeWidth={2.5} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {displayImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-accent'
                          : 'border-foreground hover:border-accent'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <p className="text-xs uppercase tracking-widest text-gray-500">
                {product.category}
              </p>
              <h1 className="mt-2 text-3xl font-black uppercase tracking-tight md:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 font-mono text-3xl font-bold">
                {formatPrice(product.priceInCents)}
              </p>

              <p className="mt-6 font-mono text-sm leading-relaxed text-gray-600">
                {t.productDescriptions[product.id as keyof typeof t.productDescriptions] ?? product.description}
              </p>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 1 && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3">
                    {t.product.selectStyle} —{' '}
                    <span className="text-accent">
                      {product.variants[selectedVariantIndex]?.label ?? ''}
                    </span>
                  </p>

                  {isHat ? (
                    /* Dropdown for hats */
                    <select
                      value={selectedVariantIndex}
                      onChange={(e) => {
                        setSelectedVariantIndex(Number(e.target.value));
                        setSelectedImageIndex(0);
                      }}
                      className="w-full border-2 border-foreground bg-background px-3 py-2.5 text-sm font-semibold uppercase tracking-widest focus:border-accent focus:outline-none"
                    >
                      {product.variants.map((variant, index) => (
                        <option key={index} value={index}>
                          {variant.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    /* Thumbnail buttons for clothing */
                    <div className="flex gap-2">
                      {product.variants.map((variant, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedVariantIndex(index);
                            setSelectedImageIndex(index);
                          }}
                          title={variant.label}
                          className={`relative h-16 w-16 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                            selectedVariantIndex === index
                              ? 'border-accent'
                              : 'border-foreground hover:border-accent'
                          }`}
                        >
                          <Image
                            src={variant.images[0] ?? ''}
                            alt={variant.label}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Size Selector — clothing only */}
              {product.category !== 'hats' && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3">
                    {t.product.selectSize}
                    {selectedSize && (
                      <span className="ml-2 text-accent">— {selectedSize}</span>
                    )}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`border-2 px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${
                          selectedSize === size
                            ? 'border-accent bg-accent text-background'
                            : 'border-foreground hover:border-accent'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {!selectedSize && (
                    <p className="mt-2 text-xs font-mono text-gray-400">{t.product.selectSizePrompt}</p>
                  )}
                </div>
              )}

              {/* Add to Cart */}
              <div className="mt-8">
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    const variantLabel = product.variants?.[selectedVariantIndex]?.label;
                    const label = selectedSize
                      ? variantLabel ? `${variantLabel} / ${selectedSize}` : selectedSize
                      : variantLabel;
                    addItem(product, label);
                  }}
                  disabled={
                    !product.inStock ||
                    (product.category === 'hats' && !product.variants?.[selectedVariantIndex]?.label) ||
                    (product.category !== 'hats' && !selectedSize)
                  }
                >
                  {product.inStock ? t.product.addToCart : t.product.soldOut}
                </Button>
              </div>

              {/* Accordions */}
              <div className="mt-8 border-t-2 border-foreground">
                {/* Size Guide — hidden until official size specs are confirmed
                <AccordionItem title={t.product.sizeGuide}>
                  {product.category === 'hats' ? (
                    <div className="space-y-2">
                      <p><strong>{t.product.oneSizeFitsAll}</strong></p>
                      <p>{t.product.oneSizeAdjustable}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p><strong>S:</strong> Chest 36-38" | Length 27"</p>
                      <p><strong>M:</strong> Chest 38-40" | Length 28"</p>
                      <p><strong>L:</strong> Chest 40-42" | Length 29"</p>
                      <p><strong>XL:</strong> Chest 42-44" | Length 30"</p>
                      <p><strong>XXL:</strong> Chest 44-46" | Length 31"</p>
                    </div>
                  )}
                </AccordionItem>
                */}

                <AccordionItem title={t.product.shippingInfo}>
                  <div className="space-y-2">
                    <p>{t.product.shippingFree}</p>
                    <p>{t.product.shippingStandard}</p>
                    <p>{t.product.shippingExpress}</p>
                    <p>{t.product.shippingIntl}</p>
                  </div>
                </AccordionItem>

                <AccordionItem title={t.product.contactUs}>
                  <div className="space-y-2">
                    <p>{t.product.contactBody}</p>
                    <a
                      href="mailto:g.erabrand21@gmail.com"
                      className="inline-block mt-1 text-accent font-semibold uppercase tracking-widest hover:underline"
                    >
                      g.erabrand21@gmail.com
                    </a>
                  </div>
                </AccordionItem>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-center text-2xl font-black uppercase tracking-tight">
              {t.product.relatedTitle}
            </h2>
            <p className="mt-2 text-center font-mono text-sm uppercase tracking-widest text-gray-500">
              {t.product.relatedSubtitle}
            </p>
            <div className="mt-8">
              <ProductGrid products={relatedProducts} />
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && displayImages[selectedImageIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Lightbox Image */}
          <div
            className="relative h-[80vh] w-[90vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={displayImages[selectedImageIndex]}
              alt={product.name}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Close Button - positioned above image with larger touch target */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
            className="absolute right-2 top-2 z-10 p-4 text-white/80 transition-colors hover:text-white active:text-white"
            aria-label="Close lightbox"
          >
            <X size={36} strokeWidth={2.5} />
          </button>

          {/* Navigation Arrows - larger touch targets for mobile */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) =>
                    prev === 0 ? displayImages.length - 1 : prev - 1
                  );
                }}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 p-3 text-black transition-all hover:scale-110 active:scale-95"
                aria-label="Previous image"
              >
                <ChevronLeft size={40} strokeWidth={3} className="drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) =>
                    prev === displayImages.length - 1 ? 0 : prev + 1
                  );
                }}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 p-3 text-black transition-all hover:scale-110 active:scale-95"
                aria-label="Next image"
              >
                <ChevronRight size={40} strokeWidth={3} className="drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
