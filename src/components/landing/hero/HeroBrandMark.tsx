'use client';

import { useId } from 'react';
import { useReducedMotion } from 'framer-motion';

import { MorphingText } from '@/components/ui';
import { cn } from '@/lib/utils';

// Chevron glyphs — mirror the teal `<` and orange `>` from Logo.tsx (CHEVRON_LEFT / CHEVRON_RIGHT_B).
const CHEVRON_LEFT =
  'M133.14,81.42c-1.5-1.5-1.5-3.94,0-5.44l24.53-24.53c1.71-1.71,1.71-4.49,0-6.2l-14.22-14.22c-1.71-1.71-4.49-1.71-6.2,0l-25.45,25.45.04.04-14.94,14.94c-4.05,4.05-4.05,10.62,0,14.67l10.68,10.68c.08.05.16.11.24.15l29.06,29.06c1.71,1.71,4.49,1.71,6.2,0l14.22-14.22c1.71-1.71,1.71-4.49,0-6.2l-24.16-24.16Z';
const CHEVRON_RIGHT =
  'M214.6,96.62l10.5-10.5c4.05-4.05,4.05-10.62,0-14.67l-10.96-10.96s-.04-.03-.07-.04l-28.93-28.93c-1.71-1.71-4.49-1.71-6.2,0l-14.22,14.22c-1.71,1.71-1.71,4.49,0,6.2l24.03,24.03c1.5,1.5,1.5,3.94,0,5.44l-24.82,24.82c-1.71,1.71-1.71,4.49,0,6.2l14.22,14.22c1.71,1.71,4.49,1.71,6.2,0l29.71-29.71c.18-.1.36-.21.53-.33Z';

interface HeroBrandMarkProps {
  className?: string;
}

/**
 * The kinetic brand signature: the wordmark "Code Get It" morphs word-by-word while the two
 * brand chevrons orbit in a band directly beneath it. The animation is decorative (aria-hidden);
 * a single visually-hidden label carries the real name for assistive tech.
 */
export function HeroBrandMark({ className }: HeroBrandMarkProps) {
  const reduceMotion = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const tealId = `bm-teal-${uid}`;
  const orangeId = `bm-orange-${uid}`;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <span className="sr-only">Code Get It</span>

      <div aria-hidden="true" className="w-full">
        {reduceMotion ? (
          <span className="block text-center font-display text-[clamp(52px,9.6vw,124px)] font-extrabold leading-none tracking-[-0.03em] text-slate-900">
            Code Get It
          </span>
        ) : (
          <MorphingText
            texts={['Code', 'Get', 'It']}
            className="h-[1.1em] font-display text-[clamp(52px,9.6vw,124px)] font-extrabold tracking-[-0.03em] text-slate-900"
          />
        )}
      </div>

      {/* Orbiting </> mark */}
      <div className="brand-orbit-stage" aria-hidden="true">
        <span className="brand-chev brand-chev--teal">
          <svg viewBox="95 29 65 99" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id={tealId} x1="-5.66" y1="-5.13" x2="215" y2="219.64" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#1cbcc0" />
                <stop offset=".18" stopColor="#1cb8bc" />
                <stop offset=".66" stopColor="#008092" />
                <stop offset=".94" stopColor="#1cbcc0" />
              </linearGradient>
            </defs>
            <path fill={`url(#${tealId})`} d={CHEVRON_LEFT} />
          </svg>
        </span>

        <span className="brand-chev brand-chev--orange">
          <svg viewBox="162 29 66 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id={orangeId} x1="48.31" y1="-54.25" x2="284.19" y2="181.63" gradientUnits="userSpaceOnUse">
                <stop offset=".47" stopColor="#fff568" />
                <stop offset=".99" stopColor="#f68956" />
              </linearGradient>
            </defs>
            <path fill={`url(#${orangeId})`} d={CHEVRON_RIGHT} />
          </svg>
        </span>
      </div>
    </div>
  );
}
