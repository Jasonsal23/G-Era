import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { decrementInventory } from '@/lib/inventory';
import type Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.instance.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session);
      break;
    }
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', paymentIntent.id);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id);
  console.log('Customer email:', session.customer_details?.email);
  console.log('Amount total:', session.amount_total);

  // Retrieve line items to get product quantities
  const lineItems = await stripe.instance.checkout.sessions.listLineItems(session.id, {
    limit: 100,
  });

  // Build decrement list from session metadata
  // metadata keys are product names, values are variant labels
  // We also need product IDs — stored as item_0_product_id, item_1_product_id in metadata
  const itemsToDecrement: { productId: string; variantLabel: string; quantity: number }[] = [];

  lineItems.data.forEach((lineItem, index) => {
    const productId = session.metadata?.[`item_${index}_product_id`];
    const variantLabel = session.metadata?.[`item_${index}_variant`] ?? '';
    const quantity = lineItem.quantity ?? 1;

    if (productId) {
      itemsToDecrement.push({ productId, variantLabel, quantity });
    }
  });

  if (itemsToDecrement.length > 0) {
    await decrementInventory(itemsToDecrement);
    console.log('Inventory decremented for', itemsToDecrement.length, 'items');
  }
}
