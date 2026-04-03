'use client';

import { useState } from 'react';
import { ShoppingBag, ChevronDown, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { categories } from '@/data/products';
import { useLanguage } from '@/context/language-context';
import { LanguageToggle } from './language-toggle';

export const Header = () => {
  const { toggleCart, items } = useCartStore();
  const { t } = useLanguage();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopExpanded, setShopExpanded] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setShopExpanded(false);
  };

  const categoryLabel = (value: string) => {
    const key = value as keyof typeof t.categories;
    return t.categories[key] ?? value;
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b-2 border-foreground bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="G.Era"
              width={48}
              height={48}
              className="h-10 w-auto md:h-12"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <div className="group relative">
              <Link
                href="/shop"
                className="flex items-center gap-1 text-sm font-semibold uppercase tracking-widest hover:text-accent transition-colors"
              >
                {t.nav.shop}
                <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
              </Link>
              <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="min-w-[160px] border-2 border-foreground bg-background">
                  {categories.map((category) => (
                    <Link
                      key={category.value}
                      href={category.value === 'all' ? '/shop' : `/shop?category=${category.value}`}
                      className="block px-4 py-3 text-sm font-semibold uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background"
                    >
                      {categoryLabel(category.value)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href="/about"
              className="text-sm font-semibold uppercase tracking-widest hover:text-accent transition-colors"
            >
              {t.nav.about}
            </Link>
          </nav>

          {/* Right Side: Language Toggle + Cart + Hamburger */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={toggleCart}
              className="relative p-2 transition-colors hover:bg-foreground hover:text-background"
            >
              <ShoppingBag size={24} />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-accent text-xs font-bold text-black">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger Button - Mobile Only */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 transition-colors hover:bg-foreground hover:text-background md:hidden"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu Slide-out Panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-72 transform border-l-2 border-foreground bg-background transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-4">
          <span className="text-lg font-black uppercase tracking-tighter">{t.nav.menu}</span>
          <button
            onClick={closeMobileMenu}
            className="p-2 transition-colors hover:bg-foreground hover:text-background"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <nav className="flex flex-col">
          {/* Shop with Expandable Categories */}
          <div>
            <button
              onClick={() => setShopExpanded(!shopExpanded)}
              className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background"
            >
              {t.nav.shop}
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${shopExpanded ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                shopExpanded ? 'max-h-96' : 'max-h-0'
              }`}
            >
              {categories.map((category) => (
                <Link
                  key={category.value}
                  href={category.value === 'all' ? '/shop' : `/shop?category=${category.value}`}
                  onClick={closeMobileMenu}
                  className="block border-t border-foreground/20 bg-foreground/5 px-10 py-3 text-sm font-medium uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background"
                >
                  {categoryLabel(category.value)}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/about"
            onClick={closeMobileMenu}
            className="border-t-2 border-foreground px-6 py-4 text-sm font-semibold uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background"
          >
            {t.nav.about}
          </Link>
        </nav>
      </div>
    </>
  );
};
