'use client';

import type { Ref } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { EASE } from './beat';
import { ItRest } from './ItSystem';

interface ActLineProps {
  /** The declaration — set without a trailing period; It is the period. */
  text: string;
  /** Rest id for the period slot at the end of the line — registers with the global It. */
  restId?: string;
  /**
   * Local period slot for self-managed scenes (e.g. the pinned Act II): renders
   * a bare ref'd span instead of registering a global rest.
   */
  periodRef?: Ref<HTMLSpanElement>;
  as?: 'h1' | 'h2';
  /** 'load' animates on mount (hero); 'view' animates when scrolled into view. */
  trigger?: 'load' | 'view';
  delay?: number;
  className?: string;
  /** Override the period size (defaults to 0.13em — tracks the font). */
  restClassName?: string;
}

/**
 * An act declaration: Syne extrabold words rising out of masks, ending in an
 * ItRest instead of a period glyph. The sentence cannot finish without It.
 */
export function ActLine({
  text,
  restId,
  periodRef,
  as: Tag = 'h2',
  trigger = 'view',
  delay = 0,
  className,
  restClassName,
}: ActLineProps) {
  const reduced = useReducedMotion();
  const words = text.split(' ');
  const MotionTag = Tag === 'h1' ? motion.h1 : motion.h2;

  // The masked words are fully clipped at y:112%, so they can never trigger
  // their own whileInView (IntersectionObserver sees nothing) — the unclipped
  // heading triggers and the variants propagate down to the words.
  const headingAnim = reduced
    ? {}
    : trigger === 'load'
      ? { initial: 'hidden' as const, animate: 'visible' as const }
      : {
          initial: 'hidden' as const,
          whileInView: 'visible' as const,
          viewport: { once: true, margin: '0px 0px -15% 0px' },
        };

  return (
    <MotionTag
      {...headingAnim}
      className={cn(
        'font-display font-extrabold tracking-[-0.03em] text-balance text-slate-900',
        className,
      )}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          {/* pb/-mb keep descenders ("g", "y") outside the clip without adding leading */}
          <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className="inline-block will-change-transform"
              variants={
                reduced
                  ? undefined
                  : {
                      hidden: { y: '112%' },
                      visible: {
                        y: '0%',
                        transition: { duration: 0.85, ease: EASE, delay: delay + i * 0.09 },
                      },
                    }
              }
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
      {periodRef ? (
        <span
          ref={periodRef}
          aria-hidden
          className={cn(
            'ml-[0.12em] inline-block h-[0.13em] w-[0.13em] rounded-full align-baseline',
            reduced ? 'bg-brand-600' : 'bg-transparent',
            restClassName,
          )}
        />
      ) : restId ? (
        <ItRest id={restId} className={cn('ml-[0.12em] h-[0.13em] w-[0.13em]', restClassName)} />
      ) : null}
    </MotionTag>
  );
}
