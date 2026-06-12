'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { fadeRiseInView } from './beat';

/**
 * A status whisper — the parenthetical voice that keeps It alive while it's
 * in the shop. Copy never ends in a period (sentences can't finish while It
 * is away) and lives in `landing.whispers`. Pure theater: hidden from
 * assistive tech, never interactive.
 */
export function Whisper({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.p
      {...fadeRiseInView(0, reduced)}
      aria-hidden
      className={cn('text-sm italic text-slate-400', className)}
    >
      {text}
    </motion.p>
  );
}
