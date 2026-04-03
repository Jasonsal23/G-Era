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
  stripePriceId: string;
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
  stripeSessionId: string;
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

export interface CheckoutRequest {
  items: {
    priceId: string;
    quantity: number;
    priceInCents: number;
    productName?: string;
    variantLabel?: string;
  }[];
}

export interface CheckoutResponse {
  sessionUrl: string;
}
