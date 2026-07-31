import { SquareClient, SquareEnvironment } from 'square';
import type { Order, OrderLineItem } from 'square';

let squareInstance: SquareClient | null = null;

const getSquareClient = (): SquareClient => {
  if (!squareInstance) {
    if (!process.env.SQUARE_ACCESS_TOKEN) {
      throw new Error('SQUARE_ACCESS_TOKEN is not set in environment variables');
    }
    squareInstance = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment:
        process.env.SQUARE_ENVIRONMENT === 'production'
          ? SquareEnvironment.Production
          : SquareEnvironment.Sandbox,
    });
  }
  return squareInstance;
};

export const square = {
  get instance() {
    return getSquareClient();
  },
};

export const getOrder = async (orderId: string) => {
  const response = await getSquareClient().orders.get({ orderId });
  return response.order;
};

export interface CheckoutLineItemInput {
  name: string;
  quantity: number;
  basePriceInCents: number;
  productId: string;
  variantLabel: string;
}

export interface PromoDiscountInput {
  code: string;
  label: string;
  percentOff: number;
}

export const createCheckoutLink = async (
  items: CheckoutLineItemInput[],
  shippingLabel: string,
  shippingInCents: number,
  taxPercent: number,
  redirectUrl: string,
  referenceId: string,
  promo?: PromoDiscountInput
) => {
  const locationId = process.env.SQUARE_LOCATION_ID;
  if (!locationId) {
    throw new Error('SQUARE_LOCATION_ID is not set in environment variables');
  }

  const lineItems: OrderLineItem[] = items.map((item) => ({
    name: item.name,
    quantity: String(item.quantity),
    basePriceMoney: { amount: BigInt(item.basePriceInCents), currency: 'USD' },
    metadata: {
      product_id: item.productId,
      variant_label: item.variantLabel,
    },
  }));

  const order: Order = {
    locationId,
    referenceId,
    lineItems,
    serviceCharges:
      shippingInCents > 0
        ? [
            {
              name: shippingLabel,
              amountMoney: { amount: BigInt(shippingInCents), currency: 'USD' },
              calculationPhase: 'SUBTOTAL_PHASE',
              taxable: false,
            },
          ]
        : undefined,
    taxes:
      taxPercent > 0
        ? [
            {
              name: 'Sales Tax',
              percentage: String(taxPercent),
              scope: 'ORDER',
            },
          ]
        : undefined,
    discounts: promo
      ? [
          {
            name: promo.label,
            type: 'FIXED_PERCENTAGE',
            percentage: String(promo.percentOff),
            scope: 'ORDER',
          },
        ]
      : undefined,
    metadata: promo ? { promo_code: promo.code } : undefined,
  };

  const response = await getSquareClient().checkout.paymentLinks.create({
    idempotencyKey: referenceId,
    order,
    checkoutOptions: {
      redirectUrl,
      askForShippingAddress: true,
      enableCoupon: false,
    },
  });

  return response.paymentLink;
};
