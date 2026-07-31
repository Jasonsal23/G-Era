import { supabaseAdmin } from './supabase';

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  variantLabel: string;
  quantity: number;
  priceInCents: number;
}

export interface PendingOrderInput {
  referenceId: string;
  squareOrderId?: string;
  items: OrderItemSnapshot[];
  subtotalInCents: number;
  shippingInCents: number;
  discountInCents: number;
  taxInCents: number;
  totalInCents: number;
  shippingMethod: string;
  promoCode?: string;
}

export interface OrderRecord extends PendingOrderInput {
  status: 'pending' | 'completed';
  createdAt: string;
}

interface OrderRow {
  reference_id: string;
  square_order_id: string | null;
  items: OrderItemSnapshot[];
  subtotal_in_cents: number;
  shipping_in_cents: number;
  discount_in_cents: number;
  tax_in_cents: number;
  total_in_cents: number;
  shipping_method: string;
  promo_code: string | null;
  status: 'pending' | 'completed';
  created_at: string;
}

export const createPendingOrder = async (order: PendingOrderInput): Promise<void> => {
  await supabaseAdmin.from('orders').insert({
    reference_id: order.referenceId,
    square_order_id: order.squareOrderId,
    items: order.items,
    subtotal_in_cents: order.subtotalInCents,
    shipping_in_cents: order.shippingInCents,
    discount_in_cents: order.discountInCents,
    tax_in_cents: order.taxInCents,
    total_in_cents: order.totalInCents,
    shipping_method: order.shippingMethod,
    promo_code: order.promoCode,
    status: 'pending',
  });
};

const mapRow = (data: OrderRow): OrderRecord => ({
  referenceId: data.reference_id,
  squareOrderId: data.square_order_id ?? undefined,
  items: data.items,
  subtotalInCents: data.subtotal_in_cents,
  shippingInCents: data.shipping_in_cents,
  discountInCents: data.discount_in_cents,
  taxInCents: data.tax_in_cents,
  totalInCents: data.total_in_cents,
  shippingMethod: data.shipping_method,
  promoCode: data.promo_code ?? undefined,
  status: data.status,
  createdAt: data.created_at,
});

// Returns the updated record so the caller (the webhook) can build a
// confirmation email from it without a second round trip.
export const markOrderCompleted = async (squareOrderId: string): Promise<OrderRecord | null> => {
  const { data } = await supabaseAdmin
    .from('orders')
    .update({ status: 'completed' })
    .eq('square_order_id', squareOrderId)
    .select()
    .single();

  return data ? mapRow(data) : null;
};

export const getOrderByReferenceId = async (referenceId: string): Promise<OrderRecord | null> => {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('reference_id', referenceId)
    .single();

  return data ? mapRow(data) : null;
};
