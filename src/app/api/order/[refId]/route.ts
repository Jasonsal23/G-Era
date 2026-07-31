import { NextRequest, NextResponse } from 'next/server';
import { getOrderByReferenceId } from '@/lib/orders';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ refId: string }> }
) {
  const { refId } = await params;
  const order = await getOrderByReferenceId(refId);

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ order });
}
