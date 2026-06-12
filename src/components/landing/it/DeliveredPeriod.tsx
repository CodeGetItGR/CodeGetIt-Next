'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { EASE } from './beat';

/**
 * The period a finished thing has earned — a delivered It. Static teal that
 * never registers with the traveler: delivered Its don't move. Hovering a
 * parent `.group` plays the single pulse (globals.css `deliveredPulse`).
 */
export function DeliveredPeriod({
  show = true,
  delay = 0,
  className,
}: {
  /** Gate the pop on the section's in-view state — IO on a scale(0) span is unreliable. */
  show?: boolean;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      initial={reduced ? false : { scale: 0 }}
      animate={show ? { scale: 1 } : {}}
      transition={{ duration: 0.24, ease: EASE, delay }}
      className={cn(
        // min sizes floor the em-tracked dot at 4px on small title scales
        'delivered-period ml-[0.14em] inline-block h-[0.12em] min-h-1 w-[0.12em] min-w-1 rounded-full bg-brand-600 align-baseline',
        className,
      )}
    />
  );
}
