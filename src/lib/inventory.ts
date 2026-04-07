import { supabaseAdmin } from './supabase';

export interface InventoryRow {
  product_id: string;
  variant_label: string;
  quantity: number;
}

// Decrement inventory after a successful order.
// Called from the webhook after checkout.session.completed.
export async function decrementInventory(
  items: { productId: string; variantLabel: string; quantity: number }[]
) {
  for (const item of items) {
    const { data, error } = await supabaseAdmin
      .from('inventory')
      .select('quantity')
      .eq('product_id', item.productId)
      .eq('variant_label', item.variantLabel)
      .single();

    if (error || !data) {
      console.error(`Inventory row not found: ${item.productId} / ${item.variantLabel}`);
      continue;
    }

    const newQty = Math.max(0, data.quantity - item.quantity);

    await supabaseAdmin
      .from('inventory')
      .update({ quantity: newQty })
      .eq('product_id', item.productId)
      .eq('variant_label', item.variantLabel);
  }
}

// Check if all cart items have sufficient stock.
// Returns null if OK, or a string describing the first problem.
export async function validateStock(
  items: { productId: string; variantLabel: string; quantity: number }[]
): Promise<string | null> {
  for (const item of items) {
    const { data, error } = await supabaseAdmin
      .from('inventory')
      .select('quantity')
      .eq('product_id', item.productId)
      .eq('variant_label', item.variantLabel)
      .single();

    if (error || !data) {
      return `${item.productId} / ${item.variantLabel} not found in inventory`;
    }

    if (data.quantity < item.quantity) {
      return `${item.variantLabel} is out of stock`;
    }
  }
  return null;
}
