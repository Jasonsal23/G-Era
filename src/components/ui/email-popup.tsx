'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Mail, CheckCircle } from 'lucide-react';
import { Button } from './button';
import { useLanguage } from '@/context/language-context';

const DISCOUNT_CODE = 'GERA10';
const STORAGE_KEY = 'gera-email-subscribed';
const DISMISSED_KEY = 'gera-popup-dismissed';

type PopupState = 'hidden' | 'open' | 'minimized' | 'subscribed';

export const EmailPopup = () => {
  const { t } = useLanguage();
  const p = t.emailPopup;
  const [state, setState] = useState<PopupState>('hidden');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Never show if already subscribed
    if (localStorage.getItem(STORAGE_KEY) === 'true') return;

    // If dismissed before, start minimized
    if (localStorage.getItem(DISMISSED_KEY) === 'true') {
      setState('minimized');
      return;
    }

    // First visit — open after 2s delay
    const timer = setTimeout(() => setState('open'), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Focus input when popup opens
  useEffect(() => {
    if (state === 'open') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [state]);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setState('minimized');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Still show success even if email fails — don't block the user
    }

    localStorage.setItem(STORAGE_KEY, 'true');
    setSubmitted(true);
  };

  const handleSuccessClose = () => {
    setState('hidden');
  };

  if (state === 'hidden') return null;

  return (
    <>
      {/* Full Popup Modal */}
      {state === 'open' && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/60"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <div className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 border-2 border-foreground bg-background">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute right-3 top-3 p-1 text-gray-400 transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="p-8 pt-10">
              {!submitted ? (
                <>
                  {/* Header */}
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border-2 border-accent">
                      <Mail size={24} className="text-accent" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">
                      {p.heading}
                    </h2>
                    <p className="mt-1 font-mono text-xs uppercase tracking-widest text-gray-500">
                      {p.subheading}
                    </p>
                  </div>

                  {/* Incentive */}
                  <div className="mb-6 border-2 border-accent bg-accent/10 px-4 py-3 text-center">
                    <p className="text-sm font-bold uppercase tracking-wide">
                      {p.incentive}
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      ref={inputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={p.placeholder}
                      required
                      className="w-full border-2 border-foreground bg-background px-4 py-3 font-mono text-sm outline-none placeholder:text-gray-400 focus:border-accent"
                    />
                    <Button
                      type="submit"
                      variant="accent"
                      size="lg"
                      className="w-full"
                    >
                      {p.submit}
                    </Button>
                  </form>

                  <p className="mt-3 text-center font-mono text-xs text-gray-400">
                    {p.disclaimer}
                  </p>
                </>
              ) : (
                /* Success State */
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border-2 border-accent">
                    <CheckCircle size={28} className="text-accent" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">
                    {p.successTitle}
                  </h2>
                  <p className="mt-3 font-mono text-sm text-gray-500">{p.successBody}</p>
                  <div className="my-4 border-2 border-foreground bg-foreground px-6 py-3 text-center">
                    <span className="font-mono text-2xl font-black tracking-widest text-background">
                      {DISCOUNT_CODE}
                    </span>
                  </div>
                  <p className="mb-6 font-mono text-xs text-gray-400">{p.successNote}</p>
                  <Link href="/shop" onClick={handleSuccessClose}>
                    <Button variant="accent" size="lg" className="w-full">
                      {p.successBtn}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Minimized Badge (bottom-left floater) */}
      {(state === 'minimized') && (
        <button
          onClick={() => setState('open')}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 border-2 border-foreground bg-background px-4 py-3 text-xs font-bold uppercase tracking-widest shadow-lg transition-all hover:bg-foreground hover:text-background"
        >
          <Mail size={16} className="text-accent" />
          <span>{p.badge}</span>
        </button>
      )}
    </>
  );
};
