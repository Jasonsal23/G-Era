import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | G.Era',
  description: 'How we collect, use, and protect your personal information',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b-2 border-foreground py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">
            Privacy Policy
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
                Information We Collect
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                We collect information you provide directly to us, such as when you create an
                account, make a purchase, subscribe to our newsletter, or contact us for support.
                This information may include your name, email address, shipping address, payment
                information, and phone number.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                How We Use Your Information
              </h2>
              <ul className="mt-4 space-y-3 font-mono text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Process and fulfill your orders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Send order confirmations and shipping updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Respond to your comments, questions, and requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Send promotional communications (with your consent)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Improve our website and customer experience</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Information Sharing
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                We do not sell, trade, or rent your personal information to third parties. We may
                share your information with trusted service providers who assist us in operating
                our website, processing payments, and delivering orders. These parties are
                obligated to keep your information confidential.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Data Security
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                We implement appropriate security measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. All payment
                transactions are processed through secure, encrypted connections.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Cookies
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                We use cookies and similar technologies to enhance your browsing experience,
                analyze site traffic, and personalize content. You can control cookie settings
                through your browser preferences.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Your Rights
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                You have the right to access, correct, or delete your personal information.
                You may also opt out of marketing communications at any time. To exercise
                these rights, please contact us at g.erabrand21@gmail.com.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Contact Us
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                If you have questions about this Privacy Policy, please contact us:
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
