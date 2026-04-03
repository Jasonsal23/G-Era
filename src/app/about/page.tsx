'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';

export default function AboutPage() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b-2 border-foreground py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-gray-500">{a.est}</p>
          <h1 className="mt-4 text-5xl font-black uppercase tracking-tighter md:text-7xl">
            {a.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            {a.intro}
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3">
            <div className="border-b-2 border-foreground p-8 md:border-b-0 md:border-r-2">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">01</p>
              <h3 className="mt-4 text-2xl font-black uppercase tracking-tight">{a.qualityLabel}</h3>
              <p className="mt-4 text-gray-600">{a.qualityText}</p>
            </div>
            <div className="border-b-2 border-foreground p-8 md:border-b-0 md:border-r-2">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">02</p>
              <h3 className="mt-4 text-2xl font-black uppercase tracking-tight">{a.styleLabel}</h3>
              <p className="mt-4 text-gray-600">{a.styleText}</p>
            </div>
            <div className="p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">03</p>
              <h3 className="mt-4 text-2xl font-black uppercase tracking-tight">{a.limitedLabel}</h3>
              <p className="mt-4 text-gray-600">{a.limitedText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Statement */}
      <section className="border-b-2 border-foreground bg-foreground py-20 text-background">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <blockquote className="text-2xl font-bold uppercase leading-relaxed tracking-tight md:text-4xl">
            {a.manifesto}
          </blockquote>
          <p className="mt-6 font-mono text-sm uppercase tracking-widest text-gray-400">
            {a.manifestoBy}
          </p>
        </div>
      </section>

      {/* The Details Section */}
      <section className="border-b-2 border-foreground py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-3xl font-black uppercase tracking-tight">{a.builtTitle}</h2>
          <p className="mt-2 text-center font-mono text-sm uppercase tracking-widest text-gray-500">
            {a.builtSubtitle}
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="border-2 border-foreground p-6">
              <h4 className="text-lg font-black uppercase tracking-tight">{a.heavyweightTitle}</h4>
              <p className="mt-2 text-sm text-gray-600">{a.heavyweightText}</p>
            </div>
            <div className="border-2 border-foreground p-6">
              <h4 className="text-lg font-black uppercase tracking-tight">{a.graphicsTitle}</h4>
              <p className="mt-2 text-sm text-gray-600">{a.graphicsText}</p>
            </div>
            <div className="border-2 border-foreground p-6">
              <h4 className="text-lg font-black uppercase tracking-tight">{a.priceTitle}</h4>
              <p className="mt-2 text-sm text-gray-600">{a.priceText}</p>
            </div>
            <div className="border-2 border-foreground p-6">
              <h4 className="text-lg font-black uppercase tracking-tight">{a.exclusiveTitle}</h4>
              <p className="mt-2 text-sm text-gray-600">{a.exclusiveText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tight">{a.contactTitle}</h2>
          <p className="mt-4 text-gray-600">{a.contactText}</p>

          <div className="mt-8 space-y-4 font-mono text-sm uppercase tracking-widest">
            <p>
              <span className="text-gray-500">{a.emailLabel}:</span>{' '}
              <a href="mailto:g.erabrand21@gmail.com" className="hover:text-accent transition-colors">
                g.erabrand21@gmail.com
              </a>
            </p>
            <p>
              <span className="text-gray-500">{a.instagramLabel}:</span>{' '}
              <a
                href="https://instagram.com/g.era21"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                @g.era21
              </a>
            </p>
          </div>

          <div className="mt-10">
            <Link href="/shop">
              <Button variant="accent" size="lg">
                {a.shopBtn}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
