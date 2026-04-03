'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b-2 border-foreground py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-500">G.Era</p>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tighter md:text-5xl">
            Returns
          </h1>
          <p className="mt-4 font-mono text-sm uppercase tracking-widest text-gray-500">
            We keep it simple. No hassle, no runaround.
          </p>
        </div>
      </section>

      {/* Policy */}
      <section className="border-b-2 border-foreground py-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="border-2 border-foreground p-6">
              <p className="text-3xl font-black uppercase tracking-tighter">30</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-gray-500">Day Return Window</p>
              <p className="mt-3 font-mono text-sm text-gray-600">From the date your order was delivered.</p>
            </div>
            <div className="border-2 border-foreground p-6">
              <p className="text-3xl font-black uppercase tracking-tighter">Unworn</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-gray-500">Items Only</p>
              <p className="mt-3 font-mono text-sm text-gray-600">Original tags attached, original packaging.</p>
            </div>
            <div className="border-2 border-foreground p-6">
              <p className="text-3xl font-black uppercase tracking-tighter">5–7</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-gray-500">Days for Refund</p>
              <p className="mt-3 font-mono text-sm text-gray-600">Processed once we receive and inspect the item.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Start a Return */}
      <section className="border-b-2 border-foreground py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter">How to Start a Return</h2>
          <p className="mt-3 font-mono text-sm text-gray-600">
            Send an email to{' '}
            <a
              href="mailto:g.erabrand21@gmail.com"
              className="text-accent hover:underline"
            >
              g.erabrand21@gmail.com
            </a>{' '}
            using the format below. We&apos;ll get back to you within 1–2 business days with return instructions.
          </p>

          {/* Email Format */}
          <div className="mt-8 border-2 border-foreground">
            <div className="border-b-2 border-foreground bg-foreground px-4 py-2">
              <p className="font-mono text-xs uppercase tracking-widest text-background">Email Format</p>
            </div>
            <div className="space-y-4 p-6 font-mono text-sm">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">Subject Line</p>
                <p className="mt-1 border-b border-gray-200 pb-2">Return Request — Order #[YOUR ORDER NUMBER]</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">Body</p>
                <div className="mt-2 space-y-2 text-gray-600">
                  <p><span className="font-bold text-foreground">Order Number:</span> [Your Stripe order reference]</p>
                  <p><span className="font-bold text-foreground">Item(s) Returning:</span> [Product name, size, style]</p>
                  <p><span className="font-bold text-foreground">Reason for Return:</span> [Wrong size / Defective / Changed my mind / Other]</p>
                  <p><span className="font-bold text-foreground">Your Name:</span> [Full name]</p>
                  <p><span className="font-bold text-foreground">Email Used at Checkout:</span> [Email address]</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <a href="mailto:g.erabrand21@gmail.com?subject=Return Request — Order #">
              <Button variant="accent" size="lg">
                Email Us to Start a Return
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* What We Don't Accept */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter">We Do Not Accept Returns On</h2>
          <ul className="mt-4 space-y-2 font-mono text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">—</span>
              Items that have been worn, washed, or altered
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">—</span>
              Items without original tags or packaging
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">—</span>
              Items returned after 30 days of delivery
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">—</span>
              Final sale items marked as non-returnable
            </li>
          </ul>

          <div className="mt-10 border-t-2 border-foreground pt-8 text-center">
            <p className="font-mono text-sm text-gray-500">Questions? Reach us at{' '}
              <a href="mailto:g.erabrand21@gmail.com" className="text-accent hover:underline">
                g.erabrand21@gmail.com
              </a>
            </p>
            <div className="mt-6">
              <Link href="/shop">
                <Button variant="primary" size="md">Back to Shop</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
