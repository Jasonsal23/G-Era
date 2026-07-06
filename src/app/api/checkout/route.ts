import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { validateStock } from '@/lib/inventory';
import type { CheckoutRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Validate stock before creating Stripe session
    const stockError = await validateStock(
      body.items.map((item) => ({
        productId: item.productId,
        variantLabel: item.variantLabel ?? '',
        quantity: item.quantity,
      }))
    );

    if (stockError) {
      return NextResponse.json({ error: stockError }, { status: 400 });
    }

    const lineItems = body.items.map((item) => ({
      price: item.priceId,
      quantity: item.quantity,
    }));

    // Build metadata — product IDs and variants so the webhook can decrement inventory
    const metadata: Record<string, string> = {};
    body.items.forEach((item, index) => {
      metadata[`item_${index}_product_id`] = item.productId;
      if (item.variantLabel) {
        metadata[`item_${index}_variant`] = item.variantLabel;
      }
      if (item.productName) {
        metadata[`item_${index}_name`] = item.productName;
      }
    });

    // Free standard shipping on all orders; express available for upgrade
    const shippingOptions = [
      { shipping_rate: 'shr_1THuPfJwIdpAFh8r456b2cd0' }, // free
      { shipping_rate: 'shr_1THuM2JwIdpAFh8rcvpQXce5' }, // express
    ];

    const session = await createCheckoutSession(
      lineItems,
      `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      `${origin}/shop`,
      shippingOptions,
      Object.keys(metadata).length > 0 ? metadata : undefined
    );

    return NextResponse.json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
