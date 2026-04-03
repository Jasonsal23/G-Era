import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

const getStripe = (): Stripe => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    });
  }
  return stripeInstance;
};

export const stripe = {
  get instance() {
    return getStripe();
  },
};

export const getStripeSession = async (sessionId: string) => {
  return getStripe().checkout.sessions.retrieve(sessionId);
};

export const createCheckoutSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  successUrl: string,
  cancelUrl: string,
  shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[],
  metadata?: Record<string, string>
) => {
  return getStripe().checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'MX'],
    },
    shipping_options: shippingOptions,
    ...(metadata && { metadata }),
  });
};
