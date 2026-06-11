'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { useLocale } from '@/i18n/UseLocale';

import { HeroCtas } from './hero';
import { ActLine, fadeRise, T } from './it';

/**
 * Act I — "You bring it". A paper field, ink type, and the period that arrives:
 * the dot lent by the navbar wordmark lands at the end of the declaration just
 * after the last word settles. Art direction contract: docs/creative-direction-it.md.
 */
export function HeroSection() {
  const { t } = useLocale();
  const copy = t.landing.hero;
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-dvh flex-col">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-20 pt-28 lg:px-10">
        <motion.p
          {...fadeRise(0.05, reduced)}
          className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400"
        >
          {copy.actLabel}
        </motion.p>

        <ActLine
          as="h1"
          trigger="load"
          text={copy.line}
          restId="act-bring"
          delay={T.words}
          className="mt-5 text-[clamp(3rem,12.5vw,9rem)] leading-[0.98]"
        />

        {/* The explanation steps aside — the declaration owns the left margin */}
        <div className="mt-10 max-w-[46ch] lg:ml-[38%] lg:mt-14">
          <motion.p
            {...fadeRise(T.sub, reduced)}
            className="text-[1.06rem] leading-[1.75] text-slate-500 text-pretty"
          >
            {copy.sub}
          </motion.p>

          <motion.div {...fadeRise(T.ctas, reduced)} className="mt-9">
            <HeroCtas copy={copy.ctas} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
