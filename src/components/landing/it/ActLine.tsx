'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { EASE } from './beat';
import { ItRest } from './ItSystem';

interface ActLineProps {
  /** The declaration — set without a trailing period; It is the period. */
  text: string;
  /** Rest id for the period slot at the end of the line. */
  restId: string;
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
  as: Tag = 'h2',
  trigger = 'view',
  delay = 0,
  className,
  restClassName,
}: ActLineProps) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  return (
    <Tag
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
              initial={reduced ? false : { y: '112%' }}
              {...(trigger === 'load'
                ? { animate: reduced ? undefined : { y: '0%' } }
                : {
                    whileInView: reduced ? undefined : { y: '0%' },
                    viewport: { once: true, margin: '0px 0px -15% 0px' },
                  })}
              transition={{ duration: 0.85, ease: EASE, delay: delay + i * 0.09 }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
      <ItRest id={restId} className={cn('ml-[0.12em] h-[0.13em] w-[0.13em]', restClassName)} />
    </Tag>
  );
}
