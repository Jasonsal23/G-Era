'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { ProductCategory } from '@/data/products';
import { useLanguage } from '@/context/language-context';

interface CategoryFilterProps {
  categories: { value: ProductCategory; label: string }[];
  activeCategory: ProductCategory;
}

export const CategoryFilter = ({ categories, activeCategory }: CategoryFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const handleCategoryChange = (category: ProductCategory) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }

    const queryString = params.toString();
    router.push(queryString ? `/shop?${queryString}` : '/shop', { scroll: false });
  };

  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryChange(category.value)}
            className={`border-2 px-6 py-3 font-semibold uppercase tracking-wider transition-all duration-200 ${
              activeCategory === category.value
                ? 'border-foreground bg-foreground text-background'
                : 'border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background'
            }`}
          >
            {t.categories[category.value as keyof typeof t.categories] ?? category.label}
          </button>
        ))}
      </div>
    </div>
  );
};
