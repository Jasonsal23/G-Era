'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cart';
import { useLanguage } from '@/context/language-context';
import { ProductCard } from './product-card';

const AUTO_SCROLL_PX_PER_FRAME = 0.5;
const RESUME_DELAY_MS = 2500;

export const CheckoutUpsellReel = () => {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draggingRef = useRef(false);
  const draggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  // Freeze the suggestion list at mount so adding an item from the reel
  // doesn't yank it out mid-spin.
  const [suggestions] = useState(() => {
    const cartProductIds = new Set(useCartStore.getState().items.map((item) => item.product.id));
    return products.filter((product) => product.inStock && !cartProductIds.has(product.id));
  });

  const reelItems = [...suggestions, ...suggestions];

  const pause = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  }, []);

  const scheduleResume = useCallback(() => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY_MS);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || suggestions.length === 0) return;

    // Track the true (fractional) scroll position ourselves rather than
    // reading track.scrollLeft back each frame — many mobile browsers only
    // report/store scrollLeft as an integer, so repeatedly adding a
    // sub-pixel increment to a rounded read-back value never accumulates
    // and the scroll position appears to never move at all.
    let scrollPos = track.scrollLeft;

    const step = () => {
      if (!pausedRef.current) {
        scrollPos += AUTO_SCROLL_PX_PER_FRAME;
        const halfWidth = track.scrollWidth / 2;
        if (scrollPos >= halfWidth) {
          scrollPos -= halfWidth;
        }
        track.scrollLeft = scrollPos;
      } else {
        // Stay in sync with wherever manual/native scrolling left it so
        // resuming continues smoothly instead of jumping.
        scrollPos = track.scrollLeft;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    // Mobile browsers hand touch-driven scrolls (including momentum) off to
    // native scrolling, which fires touchcancel instead of touchend — and
    // sometimes skips both. Watching scrollLeft itself is what's actually
    // reliable: as long as we're in a paused state, any further scroll
    // movement means the user (or momentum) is still active, so keep
    // pushing the resume timer out until it genuinely stops.
    const handleScroll = () => {
      if (pausedRef.current) {
        scheduleResume();
      }
    };
    track.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      track.removeEventListener('scroll', handleScroll);
    };
  }, [suggestions.length, scheduleResume]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pause();
    if (e.pointerType === 'touch') return; // native touch scrolling handles mobile drag
    draggingRef.current = true;
    draggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = trackRef.current?.scrollLeft ?? 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || !trackRef.current) return;
    const delta = e.clientX - dragStartXRef.current;
    if (Math.abs(delta) > 3) draggedRef.current = true;
    trackRef.current.scrollLeft = dragStartScrollRef.current - delta;
  };

  const endDrag = () => {
    draggingRef.current = false;
    scheduleResume();
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    // A drag shouldn't also register as a click on the card underneath it.
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (suggestions.length === 0) return null;

  return (
    <section>
      <h2 className="px-4 text-xs font-bold uppercase tracking-wider text-gray-500">
        {t.checkout.lastMinuteTitle}
      </h2>
      <div
        ref={trackRef}
        className="scrollbar-hide mt-4 flex cursor-grab select-none gap-4 overflow-x-auto px-4 active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onTouchStart={pause}
        onTouchEnd={scheduleResume}
        onTouchCancel={scheduleResume}
        onFocus={pause}
        onBlur={scheduleResume}
        onWheel={() => {
          pause();
          scheduleResume();
        }}
        onClickCapture={handleClickCapture}
      >
        {reelItems.map((product, index) => (
          <div key={`${product.id}-${index}`} className="w-48 shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
