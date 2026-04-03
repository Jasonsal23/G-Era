import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility | G.Era',
  description: 'Our commitment to accessibility and inclusive design',
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b-2 border-foreground py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">
            Accessibility
          </h1>
          <p className="mt-4 font-mono text-sm uppercase tracking-widest text-gray-500">
            Our commitment to inclusive design
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Our Commitment
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                G.Era is committed to ensuring digital accessibility for people with disabilities.
                We are continually improving the user experience for everyone and applying the
                relevant accessibility standards to ensure we provide equal access to all users.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Accessibility Features
              </h2>
              <ul className="mt-4 space-y-3 font-mono text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Keyboard navigation support throughout the website</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Alt text descriptions for all product images</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>High contrast color schemes for readability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Responsive design for all screen sizes and devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Clear and consistent navigation structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Form labels and error messages for screen readers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Skip navigation links for keyboard users</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Standards Compliance
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
                standards. These guidelines explain how to make web content more accessible to
                people with disabilities, including those with visual, auditory, physical, speech,
                cognitive, language, learning, and neurological disabilities.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Assistive Technologies
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                Our website is designed to be compatible with the following assistive technologies:
              </p>
              <ul className="mt-4 space-y-2 font-mono text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Screen readers (JAWS, NVDA, VoiceOver)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Screen magnification software</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Speech recognition software</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Keyboard-only navigation</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Feedback
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                We welcome your feedback on the accessibility of the G.Era website. If you
                encounter any accessibility barriers or have suggestions for improvement,
                please contact us:
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

            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Continuous Improvement
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-gray-600">
                We are committed to ongoing accessibility improvements. Our team regularly
                reviews and updates our website to ensure compliance with accessibility
                standards and best practices. This statement was last updated in January 2025.
              </p>
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
