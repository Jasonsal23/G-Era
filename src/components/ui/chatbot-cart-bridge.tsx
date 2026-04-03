'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { getProductById, products } from '@/data/products';
import type { Product } from '@/types';

interface AddToCartMessage {
  type: 'GERA_ADD_TO_CART';
  productId: string;
  variantLabel?: string;
  quantity?: number;
}

// Normalize a string for fuzzy matching — lowercase, strip punctuation/spaces
const normalize = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]/g, '');

// Try to resolve a product + variantLabel from whatever the chatbot sends.
// Priority:
//   1. Direct productId match (e.g. "bart-hats")
//   2. productId matches a variant label across all products (fuzzy)
//   3. variantLabel fuzzy matches a variant within the found product
const resolveCartItem = (
  productId: string,
  variantLabel?: string
): { product: Product; resolvedVariant: string | undefined } | null => {
  // 1. Direct match
  const direct = getProductById(productId);
  if (direct) {
    // If variantLabel was sent, try to fuzzy-match it to a real variant label
    const resolvedVariant = resolveVariant(direct, variantLabel);
    return { product: direct, resolvedVariant };
  }

  // 2. productId might actually be a style name the AI made up
  // Search all product variants for a fuzzy match on productId or variantLabel
  const needle = normalize(productId);
  for (const product of products) {
    if (!product.variants) continue;
    for (const variant of product.variants) {
      if (normalize(variant.label).includes(needle) || needle.includes(normalize(variant.label).slice(0, 6))) {
        return { product, resolvedVariant: variant.label };
      }
    }
    // Also check if productId fuzzy-matches the product name
    if (normalize(product.name).includes(needle) || normalize(product.id).includes(needle)) {
      const resolvedVariant = resolveVariant(product, variantLabel);
      return { product, resolvedVariant };
    }
  }

  // 3. Search by variantLabel alone across all products
  if (variantLabel) {
    const varNeedle = normalize(variantLabel);
    for (const product of products) {
      if (!product.variants) continue;
      for (const variant of product.variants) {
        if (normalize(variant.label).includes(varNeedle) || varNeedle.includes(normalize(variant.label).slice(0, 6))) {
          return { product, resolvedVariant: variant.label };
        }
      }
    }
  }

  return null;
};

// Fuzzy-match a variantLabel string to the closest real variant on a product
const resolveVariant = (product: Product, variantLabel?: string): string | undefined => {
  if (!variantLabel || !product.variants) return variantLabel;
  const needle = normalize(variantLabel);
  // Exact match first
  const exact = product.variants.find((v) => normalize(v.label) === needle);
  if (exact) return exact.label;
  // Partial match
  const partial = product.variants.find(
    (v) => normalize(v.label).includes(needle) || needle.includes(normalize(v.label).slice(0, 6))
  );
  return partial ? partial.label : variantLabel;
};

export const ChatbotCartBridge = () => {
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || event.data.type !== 'GERA_ADD_TO_CART') return;

      const { productId, variantLabel, quantity = 1 } = event.data as AddToCartMessage;

      const resolved = resolveCartItem(productId, variantLabel);

      if (!resolved) {
        event.source?.postMessage(
          {
            type: 'GERA_ADD_TO_CART_RESULT',
            success: false,
            error: `Product "${productId}" not found. Valid IDs: ${products.map((p) => p.id).join(', ')}`,
          },
          { targetOrigin: '*' }
        );
        return;
      }

      const { product, resolvedVariant } = resolved;

      if (!product.inStock) {
        event.source?.postMessage(
          { type: 'GERA_ADD_TO_CART_RESULT', success: false, error: `"${product.name}" is sold out` },
          { targetOrigin: '*' }
        );
        return;
      }

      for (let i = 0; i < quantity; i++) {
        addItem(product, resolvedVariant);
      }

      setCartOpen(true);

      event.source?.postMessage(
        {
          type: 'GERA_ADD_TO_CART_RESULT',
          success: true,
          product: {
            id: product.id,
            name: product.name,
            priceInCents: product.priceInCents,
            variantLabel: resolvedVariant ?? null,
            quantity,
          },
        },
        { targetOrigin: '*' }
      );
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [addItem, setCartOpen]);

  return null;
};
