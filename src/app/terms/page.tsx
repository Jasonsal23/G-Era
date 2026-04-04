import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | G.Era',
  description: 'Terms and conditions for using the G.Era website and services',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b-2 border-foreground py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">
            Terms of Service
          </h1>
          <p className="mt-4 font-mono text-sm uppercase tracking-widest text-gray-500">
            Last updated: January 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Agreement to Terms
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                By accessing or using the G.Era website and services, you agree to be bound
                by these Terms of Service. If you do not agree to these terms, please do not
                use our website or services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Products and Orders
              </h2>
              <ul className="mt-4 space-y-3 font-mono text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>All products are subject to availability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Prices are subject to change without notice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>We reserve the right to limit quantities or refuse orders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Product images are for illustration purposes; actual products may vary slightly</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Payment
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                We accept major credit cards and other payment methods as displayed at checkout.
                All payments are processed securely through our payment provider. You agree to
                provide accurate and complete payment information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Shipping and Delivery
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                We offer free shipping on all orders — no code needed. Shipping times vary by
                location. Standard shipping is 5-7 business days; express shipping is 2-3
                business days. We are not responsible for delays caused by shipping carriers
                or customs processing.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Questions & Orders
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                Any questions or concerns about your order? Contact us directly at{' '}
                <a href="mailto:g.erabrand21@gmail.com" className="text-accent hover:underline">
                  g.erabrand21@gmail.com
                </a>{' '}
                and we&apos;ll take care of you.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Intellectual Property
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                All content on this website, including text, graphics, logos, images, and
                software, is the property of G.Era and protected by intellectual property
                laws. You may not reproduce, distribute, or create derivative works without
                our written permission.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                User Conduct
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                You agree not to use our website for any unlawful purpose, to interfere with
                the website&apos;s operation, or to attempt unauthorized access to our systems.
                We reserve the right to terminate access for users who violate these terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Limitation of Liability
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                G.Era shall not be liable for any indirect, incidental, special, or consequential
                damages arising from your use of our website or products. Our total liability
                shall not exceed the amount paid for the products in question.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Changes to Terms
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                We may update these Terms of Service from time to time. Changes will be posted
                on this page with an updated revision date. Your continued use of our website
                after changes constitutes acceptance of the new terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Contact Us
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 space-y-2 font-mono text-sm">
                <p>
                  <span className="text-gray-500">Email:</span>{' '}
                  <a href="mailto:g.erabrand21@gmail.com" className="text-accent hover:underline">
                    g.erabrand21@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/">
              <Button variant="accent" size="lg">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
