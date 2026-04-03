'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/shop/product-grid';
import { getFeaturedProducts } from '@/data/products';
import { useLanguage } from '@/context/language-context';


export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center border-b-2 border-foreground">
        {/* Background Image */}
        <Image
          src="/images/Aimodelbackground.jpg"
          alt=""
          fill
          className="object-cover object-[center_43%]"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-6xl font-black uppercase tracking-tighter text-white md:text-8xl">
            G.Era
          </h1>
          <p className="mt-4 font-mono text-lg uppercase tracking-widest text-white/80">
            {t.home.tagline}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/shop">
              <Button variant="accent" size="lg">
                {t.home.shopBtn}
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="accent" size="lg">
                {t.home.storyBtn}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="border-b-2 border-foreground py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-black uppercase tracking-tight">
            {t.home.featuredTitle}
          </h2>
          <p className="mt-2 text-center font-mono text-sm uppercase tracking-widest text-gray-500">
            {t.home.featuredSubtitle}
          </p>
          <div className="mt-12">
            <ProductGrid products={getFeaturedProducts(4)} />
          </div>
          <div className="mt-8 text-center">
            <Link href="/shop">
              <Button variant="primary" size="lg">
                {t.home.viewAll}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Statement */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <blockquote className="text-2xl font-bold uppercase leading-relaxed tracking-tight md:text-3xl">
            {t.home.quote}
          </blockquote>
          <p className="mt-6 font-mono text-sm uppercase tracking-widest text-gray-500">
            {t.home.quoteAuthor}
          </p>
        </div>
      </section>

    </div>
  );
}
