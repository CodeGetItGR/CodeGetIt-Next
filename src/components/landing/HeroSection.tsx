'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { useLocale } from '@/i18n/UseLocale';

import { ArtifactPlate } from './ArtifactPlate';
import { HeroCtas } from './hero';
import { ActLine, fadeRise, T } from './it';

/**
 * Act I - "You bring it". The artifact stack makes the early-stage promise
 * tangible: messy input gets shaped before it becomes product work.
 */
export function HeroSection() {
  const { t } = useLocale();
  const copy = t.landing.hero;
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-dvh flex-col">
      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-6 pb-20 pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div>
          <motion.p
            {...fadeRise(0.05, reduced)}
            className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500"
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

          <div className="mt-10 max-w-[46ch] lg:ml-[24%] lg:mt-14">
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

        <motion.div
          {...fadeRise(T.ctas + 0.1, reduced)}
          className="relative mx-auto w-full max-w-[430px] lg:mx-0 lg:justify-self-end"
        >
          <div className="absolute -left-5 top-10 hidden h-28 w-24 rotate-[-5deg] border border-slate-900/10 bg-white/80 shadow-sm lg:block" />
          <ArtifactPlate
            variant="brief"
            plate="Plate 00"
            eyebrow="you bring it"
            caption="A rough thought, exactly as it comes."
            compact
            depth
            className="relative rotate-[1deg]"
            delay={T.ctas + 0.18}
          />
          <ArtifactPlate
            variant="wireframe"
            plate="Plate 01"
            eyebrow="first shape"
            caption="Structure forms around the idea."
            compact
            depth
            className="-mt-10 ml-auto max-w-[86%] rotate-[-1deg]"
            delay={T.ctas + 0.28}
          />
        </motion.div>
      </div>
    </section>
  );
}
