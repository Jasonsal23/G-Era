'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProductsByCategory, categories, type ProductCategory } from '@/data/products';
import { ProductGrid } from '@/components/shop/product-grid';
import { CategoryFilter } from '@/components/shop/category-filter';
import { useLanguage } from '@/context/language-context';

const EmptyState = ({ category }: { category: string }) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center border-2 border-foreground">
        <span className="text-4xl font-bold">0</span>
      </div>
      <h2 className="text-2xl font-bold uppercase tracking-tight">{t.shop.noProducts}</h2>
      <p className="mt-2 font-mono text-sm uppercase tracking-widest text-gray-500">
        {t.shop.noProductsIn.replace('{category}', category)}
      </p>
    </div>
  );
};

const ShopContent = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') as ProductCategory | null;
  const activeCategory: ProductCategory =
    categoryParam && categories.some((c) => c.value === categoryParam) ? categoryParam : 'all';
  const products = getProductsByCategory(activeCategory);

  return (
    <>
      <CategoryFilter categories={categories} activeCategory={activeCategory} />
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <EmptyState category={activeCategory} />
      )}
    </>
  );
};

export default function ShopPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="border-b-2 border-foreground py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-5xl font-black uppercase tracking-tighter md:text-6xl">
            {t.shop.title}
          </h1>
          <p className="mt-4 font-mono text-sm uppercase tracking-widest text-gray-500">
            {t.shop.subtitle}
          </p>
        </div>
      </section>

      {/* Filter + Grid Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <Suspense fallback={<div className="h-12" />}>
            <ShopContent />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
