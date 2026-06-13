'use client';

import { cn } from '@/lib/utils';

import { ItRest } from './ItSystem';

interface DotlessWordmarkProps {
  /** Everything before the final "it" — "CodeGet" (navbar) or "codeget" (footer). */
  before: string;
  /**
   * Register the tittle slot as the journey's origin (navbar only): the logo
   * lends its dot to the page on load. Without it, the wordmark is simply —
   * permanently — dotless: the footer's "(you have it now.)".
   */
  origin?: boolean;
  className?: string;
}

/** The brand wordmark set with a dotless ı. The missing tittle IS the concept. */
export function DotlessWordmark({ before, origin = false, className }: DotlessWordmarkProps) {
  return (
    <span className={cn('inline-block whitespace-nowrap', className)}>
      {before}
      <span className="relative inline-block">
        ı
        {origin && (
          <ItRest
            id="it-origin"
            role="origin"
            className="absolute left-1/2 top-[0.13em] h-[0.16em] w-[0.16em] -translate-x-1/2"
          />
        )}
      </span>
      t
    </span>
  );
}
