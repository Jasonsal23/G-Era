import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createCheckoutLink } from '@/lib/square';
import { validateStock } from '@/lib/inventory';
import { SHIPPING_RATES } from '@/lib/shipping';
import { validatePromoCode } from '@/lib/promo';
import { createPendingOrder } from '@/lib/orders';
import { getProductById } from '@/data/products';
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

    const shipping = SHIPPING_RATES[body.shippingMethod];
    if (!shipping) {
      return NextResponse.json(
        { error: 'Invalid shipping method' },
        { status: 400 }
      );
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Validate stock before creating the Square order
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

    // Resolve price server-side from product data — never trust a client-sent price.
    const lineItems = body.items.map((item) => {
      const product = getProductById(item.productId);
      if (!product) {
        throw new Error(`Unknown product: ${item.productId}`);
      }
      return {
        name: item.variantLabel ? `${product.name} — ${item.variantLabel}` : product.name,
        quantity: item.quantity,
        basePriceInCents: product.priceInCents,
        productId: item.productId,
        variantLabel: item.variantLabel ?? '',
      };
    });

    const taxPercent = Number(process.env.SQUARE_TAX_RATE_PERCENT ?? '0');
    const referenceId = randomUUID();

    // Re-validate the promo code server-side — never trust a discount the client claims was applied.
    const promo = body.promoCode ? await validatePromoCode(body.promoCode) : null;

    const paymentLink = await createCheckoutLink(
      lineItems,
      shipping.label,
      shipping.costInCents,
      taxPercent,
      `${origin}/success?ref=${referenceId}`,
      referenceId,
      promo ? { code: promo.code, label: promo.label, percentOff: promo.percentOff } : undefined
    );

    if (!paymentLink?.url) {
      throw new Error('Square did not return a checkout URL');
    }

    const subtotalInCents = lineItems.reduce(
      (total, item) => total + item.basePriceInCents * item.quantity,
      0
    );
    const discountInCents = promo ? Math.round((subtotalInCents * promo.percentOff) / 100) : 0;
    const taxInCents = Math.round(((subtotalInCents - discountInCents) * taxPercent) / 100);
    const totalInCents = subtotalInCents - discountInCents + shipping.costInCents + taxInCents;

    await createPendingOrder({
      referenceId,
      squareOrderId: paymentLink.orderId,
      items: lineItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        variantLabel: item.variantLabel,
        quantity: item.quantity,
        priceInCents: item.basePriceInCents,
      })),
      subtotalInCents,
      shippingInCents: shipping.costInCents,
      discountInCents,
      taxInCents,
      totalInCents,
      shippingMethod: body.shippingMethod,
      promoCode: promo?.code,
    });

    return NextResponse.json({ sessionUrl: paymentLink.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
