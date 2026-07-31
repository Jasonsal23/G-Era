export interface ProductVariant {
  label: string;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  images: string[];
  variants?: ProductVariant[];
  category: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalInCents: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  squareOrderId: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type ShippingMethod = 'free' | 'express';

export interface CheckoutRequest {
  items: {
    productId: string;
    quantity: number;
    priceInCents: number;
    productName?: string;
    variantLabel?: string;
  }[];
  shippingMethod: ShippingMethod;
  promoCode?: string;
}

export interface CheckoutResponse {
  sessionUrl: string;
}
