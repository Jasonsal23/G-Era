'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { getProductById } from '@/data/products';

interface AddToCartMessage {
  type: 'GERA_ADD_TO_CART';
  productId: string;
  variantLabel?: string; // size for clothing (e.g. "L"), style for hats (e.g. "Grey Logo")
  quantity?: number;
}

export const ChatbotCartBridge = () => {
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only handle our specific message type
      if (!event.data || event.data.type !== 'GERA_ADD_TO_CART') return;

      const { productId, variantLabel, quantity = 1 } = event.data as AddToCartMessage;

      const product = getProductById(productId);

      if (!product) {
        event.source?.postMessage(
          { type: 'GERA_ADD_TO_CART_RESULT', success: false, error: `Product "${productId}" not found` },
          { targetOrigin: '*' }
        );
        return;
      }

      if (!product.inStock) {
        event.source?.postMessage(
          { type: 'GERA_ADD_TO_CART_RESULT', success: false, error: `"${product.name}" is sold out` },
          { targetOrigin: '*' }
        );
        return;
      }

      // Add the item — repeat for quantity > 1
      for (let i = 0; i < quantity; i++) {
        addItem(product, variantLabel);
      }

      // Open the cart drawer so the customer sees it
      setCartOpen(true);

      // Send confirmation back to the chatbot widget
      event.source?.postMessage(
        {
          type: 'GERA_ADD_TO_CART_RESULT',
          success: true,
          product: {
            id: product.id,
            name: product.name,
            priceInCents: product.priceInCents,
            variantLabel: variantLabel ?? null,
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
