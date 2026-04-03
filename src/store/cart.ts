'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, variantLabel?: string) => void;
  removeItem: (productId: string, variantLabel?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantLabel?: string) => void;
  updateItemVariant: (productId: string, oldVariant: string | undefined, newVariant: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  getTotalItems: () => number;
  getTotalPriceInCents: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product, variantLabel?: string) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.product.id === product.id && item.selectedVariant === variantLabel
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.product.id === product.id && item.selectedVariant === variantLabel
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { product, quantity: 1, selectedVariant: variantLabel }] });
        }
      },

      removeItem: (productId: string, variantLabel?: string) => {
        set({
          items: get().items.filter(
            (item) => !(item.product.id === productId && item.selectedVariant === variantLabel)
          ),
        });
      },

      updateQuantity: (productId: string, quantity: number, variantLabel?: string) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantLabel);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId && item.selectedVariant === variantLabel
              ? { ...item, quantity }
              : item
          ),
        });
      },

      updateItemVariant: (productId: string, oldVariant: string | undefined, newVariant: string) => {
        set({
          items: get().items.map((item) =>
            item.product.id === productId && item.selectedVariant === oldVariant
              ? { ...item, selectedVariant: newVariant }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      setCartOpen: (isOpen: boolean) => {
        set({ isOpen });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPriceInCents: () => {
        return get().items.reduce(
          (total, item) => total + item.product.priceInCents * item.quantity,
          0
        );
      },
    }),
    {
      name: 'g-era-cart',
    }
  )
);
