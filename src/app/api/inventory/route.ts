import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Public endpoint — returns all inventory rows so the frontend can track stock
export async function GET() {
  const { data, error } = await supabase
    .from('inventory')
    .select('product_id, variant_label, quantity');

  if (error) {
    console.error('Inventory fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }

  return NextResponse.json({ inventory: data });
}
