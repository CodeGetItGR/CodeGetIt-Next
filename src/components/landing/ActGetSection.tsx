'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { useLocale } from '@/i18n/UseLocale';

import { ActLine, ItRest, fadeRiseInView, useIt } from './it';

/**
 * Act III — "You get it". The dot re-enters after its absence, pauses one beat
 * at the declaration's period, then docks inside the ink pill: the handover.
 * Hovering the pill squashes the docked dot — it's ready.
 */
export function ActGetSection() {
  const { t } = useLocale();
  const copy = t.landing.story.get;
  const reduced = useReducedMotion();
  const { pulse } = useIt();

  return (
    <section className="relative py-28 lg:py-40 ambient-gold">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 text-center lg:px-10">
        <motion.p
          {...fadeRiseInView(0, reduced)}
          className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400"
        >
          {copy.actLabel}
        </motion.p>

        <ActLine
          text={copy.line}
          restId="act-get"
          className="mt-5 text-[clamp(2.8rem,9vw,7rem)] leading-none"
        />

        <motion.p
          {...fadeRiseInView(0.15, reduced)}
          className="mt-7 max-w-[44ch] text-[1.06rem] leading-[1.75] text-slate-500 text-pretty"
        >
          {copy.sub}
        </motion.p>

        <motion.div {...fadeRiseInView(0.3, reduced)} className="mt-12">
          <a
            href="#contact"
            onMouseEnter={() => pulse('act-get-cta')}
            className="group inline-flex cursor-pointer items-center gap-3 rounded-full bg-brand-600 py-4 pl-6 pr-8 text-[17px] font-semibold tracking-[-0.01em] text-white no-underline transition-colors duration-300 hover:bg-brand-700"
          >
            {/* The dock — the journey ends in your hands */}
            <ItRest id="act-get-cta" className="h-2.5 w-2.5" />
            {copy.cta}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
