import type { ShippingMethod } from '@/types';

export const SHIPPING_RATES: Record<ShippingMethod, { label: string; costInCents: number }> = {
  free: { label: 'Standard Shipping', costInCents: 0 },
  express: { label: 'Express Shipping', costInCents: 1200 },
};
