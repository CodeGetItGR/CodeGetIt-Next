'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { useLocale } from '@/i18n/UseLocale';
import { cn } from '@/lib/utils';

import { ActLine, ItRest, fadeRiseInView, useIt } from './it';

/**
 * Act II — "We code it". The dot becomes the working point: it hops down the
 * build list as each line's period. Only the line being read gets to finish
 * its sentence; after this section the dot is absent — it is in the shop.
 */
export function ActCodeSection() {
  const { t } = useLocale();
  const copy = t.landing.story.code;
  const reduced = useReducedMotion();
  const { activeId } = useIt();

  return (
    <section className="relative py-28 lg:py-36">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <motion.p
          {...fadeRiseInView(0, reduced)}
          className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400"
        >
          {copy.actLabel}
        </motion.p>

        <ActLine
          text={copy.line}
          restId="act-code"
          className="mt-5 text-[clamp(2.5rem,7vw,5rem)] leading-[1.02]"
        />

        <motion.p
          {...fadeRiseInView(0.15, reduced)}
          className="mt-6 max-w-[52ch] text-[1.02rem] leading-[1.75] text-slate-500 text-pretty"
        >
          {copy.sub}
        </motion.p>

        {/* The hop list — the dot serves as each line's period in turn */}
        <ul className="mt-14 space-y-5 lg:ml-[34%] lg:mt-20">
          {copy.list.map((item, i) => {
            const id = `act-code-${i}`;
            const isActive = activeId === id;
            return (
              <motion.li key={item} {...fadeRiseInView(0.1 + i * 0.08, reduced)}>
                <span
                  className={cn(
                    'font-display text-[clamp(1.5rem,3.6vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.02em] transition-colors duration-500',
                    isActive ? 'text-slate-900' : 'text-slate-400/60',
                  )}
                >
                  {item}
                  <ItRest id={id} className="ml-[0.14em] h-[0.13em] w-[0.13em]" />
                </span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
