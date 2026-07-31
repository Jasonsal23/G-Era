import { NextRequest, NextResponse } from 'next/server';
import { WebhooksHelper } from 'square';
import { Resend } from 'resend';
import { getOrder } from '@/lib/square';
import { decrementInventory } from '@/lib/inventory';
import { markPromoCodeUsed } from '@/lib/promo';
import { markOrderCompleted, type OrderRecord } from '@/lib/orders';

const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
const notificationUrl = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL;
const resend = new Resend(process.env.RESEND_API_KEY);

// Square's raw webhook JSON is the unprocessed wire format (snake_case) —
// unlike SDK method calls (e.g. `orders.get()`), which the SDK deserializes
// into camelCase for us. We parse this body ourselves, so it stays snake_case.
interface SquareWebhookEvent {
  type: string;
  data: {
    id: string;
    object: {
      payment?: {
        id: string;
        status?: string;
        order_id?: string;
        buyer_email_address?: string;
      };
    };
  };
}

export async function POST(request: NextRequest) {
  if (!signatureKey || !notificationUrl) {
    console.error('SQUARE_WEBHOOK_SIGNATURE_KEY or SQUARE_WEBHOOK_NOTIFICATION_URL is not set');
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('x-square-hmacsha256-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  const isValid = await WebhooksHelper.verifySignature({
    requestBody: body,
    signatureHeader: signature,
    signatureKey,
    notificationUrl,
  });

  if (!isValid) {
    console.error('Webhook signature verification failed');
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  const event: SquareWebhookEvent = JSON.parse(body);

  switch (event.type) {
    case 'payment.updated': {
      const payment = event.data.object.payment;
      if (payment?.status === 'COMPLETED' && payment.order_id) {
        await handlePaymentCompleted(payment.order_id, payment.buyer_email_address);
      }
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentCompleted(orderId: string, buyerEmail?: string) {
  console.log('Payment completed for order:', orderId);

  const order = await getOrder(orderId);

  const itemsToDecrement: { productId: string; variantLabel: string; quantity: number }[] = [];

  order?.lineItems?.forEach((lineItem) => {
    const productId = lineItem.metadata?.product_id;
    const variantLabel = lineItem.metadata?.variant_label ?? '';
    const quantity = Number(lineItem.quantity ?? '1');

    if (productId) {
      itemsToDecrement.push({ productId, variantLabel, quantity });
    }
  });

  if (itemsToDecrement.length > 0) {
    await decrementInventory(itemsToDecrement);
    console.log('Inventory decremented for', itemsToDecrement.length, 'items');
  }

  const promoCode = order?.metadata?.promo_code;
  if (promoCode) {
    await markPromoCodeUsed(promoCode, orderId);
    console.log('Promo code marked used:', promoCode);
  }

  const completedOrder = await markOrderCompleted(orderId);

  if (completedOrder && buyerEmail) {
    await sendOrderConfirmationEmail(buyerEmail, completedOrder);
  } else if (completedOrder && !buyerEmail) {
    console.log('No buyer email on payment — skipping confirmation email for order', orderId);
  }
}

const formatPrice = (priceInCents: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    priceInCents / 100
  );
};

async function sendOrderConfirmationEmail(email: string, order: OrderRecord) {
  const orderNumber = order.referenceId.slice(0, 8).toUpperCase();

  const itemRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;font-family:monospace;font-size:13px;color:#333333;">
            ${item.name}${item.variantLabel ? ` — ${item.variantLabel}` : ''} × ${item.quantity}
          </td>
          <td style="padding:8px 0;font-family:monospace;font-size:13px;color:#333333;text-align:right;">
            ${formatPrice(item.priceInCents * item.quantity)}
          </td>
        </tr>`
    )
    .join('');

  try {
    await resend.emails.send({
      from: 'G.Era <hello@g-era.com>',
      to: email,
      subject: `Order Confirmed — G.Era #${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin:0;padding:0;background:#ffffff;font-family:monospace;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;padding:40px 24px;">
              <tr>
                <td>
                  <h1 style="font-size:32px;font-weight:900;text-transform:uppercase;letter-spacing:-1px;margin:0 0 8px 0;color:#000000;">
                    G.ERA
                  </h1>
                  <p style="font-size:11px;text-transform:uppercase;letter-spacing:4px;color:#888888;margin:0 0 32px 0;font-family:monospace;">
                    Order Confirmed
                  </p>

                  <p style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 8px 0;font-family:monospace;">
                    Thanks for your order. Here's what's coming:
                  </p>
                  <p style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888888;margin:0 0 24px 0;font-family:monospace;">
                    Order #${orderNumber}
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;border-top:1px solid #eeeeee;">
                    ${itemRows}
                  </table>

                  <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eeeeee;padding-top:12px;">
                    <tr>
                      <td style="padding:4px 0;font-family:monospace;font-size:12px;color:#888888;">Subtotal</td>
                      <td style="padding:4px 0;font-family:monospace;font-size:12px;color:#888888;text-align:right;">${formatPrice(order.subtotalInCents)}</td>
                    </tr>
                    ${
                      order.discountInCents > 0
                        ? `<tr>
                            <td style="padding:4px 0;font-family:monospace;font-size:12px;color:#D4AF37;">Discount${order.promoCode ? ` (${order.promoCode})` : ''}</td>
                            <td style="padding:4px 0;font-family:monospace;font-size:12px;color:#D4AF37;text-align:right;">-${formatPrice(order.discountInCents)}</td>
                          </tr>`
                        : ''
                    }
                    <tr>
                      <td style="padding:4px 0;font-family:monospace;font-size:12px;color:#888888;">Shipping</td>
                      <td style="padding:4px 0;font-family:monospace;font-size:12px;color:#888888;text-align:right;">${order.shippingInCents === 0 ? 'Free' : formatPrice(order.shippingInCents)}</td>
                    </tr>
                    ${
                      order.taxInCents > 0
                        ? `<tr>
                            <td style="padding:4px 0;font-family:monospace;font-size:12px;color:#888888;">Tax</td>
                            <td style="padding:4px 0;font-family:monospace;font-size:12px;color:#888888;text-align:right;">${formatPrice(order.taxInCents)}</td>
                          </tr>`
                        : ''
                    }
                    <tr>
                      <td style="padding:12px 0 0 0;font-family:monospace;font-size:14px;font-weight:900;color:#000000;">Total</td>
                      <td style="padding:12px 0 0 0;font-family:monospace;font-size:14px;font-weight:900;color:#000000;text-align:right;">${formatPrice(order.totalInCents)}</td>
                    </tr>
                  </table>

                  <div style="text-align:center;margin:32px 0;">
                    <a href="https://g-era.com/shop" style="display:inline-block;background:#D4AF37;color:#000000;font-family:monospace;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:4px;padding:16px 32px;text-decoration:none;">
                      Shop Again
                    </a>
                  </div>

                  <p style="font-size:11px;color:#aaaaaa;font-family:monospace;text-align:center;line-height:1.6;margin:0;">
                    Questions about your order? <a href="mailto:g.erabrand21@gmail.com" style="color:#D4AF37;">g.erabrand21@gmail.com</a>
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });
    console.log('Order confirmation email sent to', email);
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }
}
