import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import type { MouseEvent } from 'react';

import { useLocale } from '@/i18n/UseLocale';
import { Spotlight } from '@/components/ui/Spotlight';

import { HeroBadge, HeroCards, HeroCtas, HeroHeadline } from './hero';

const STATS = [
  { value: '50+', label: 'Projects' },
  { value: '30+', label: 'Clients' },
  { value: '5+', label: 'Years' },
] as const;

export function HeroSection() {
  const { t } = useLocale();
  const copy = t.landing.hero;

  // Cursor glow — MotionValues never trigger React re-renders
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorGlow = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(45,212,191,0.045), transparent 70%)`;

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-[100dvh] overflow-hidden flex flex-col justify-center"
    >
      {/* Aceternity spotlight — fades in via animate-spotlight keyframe */}
      <Spotlight
        className="-top-40 left-0 md:left-48 md:-top-20"
        fill="#2dd4bf"
      />

      {/* Cursor-tracked radial glow — pure GPU, zero state updates */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ background: cursorGlow }}
        aria-hidden="true"
      />

      {/* Static ambient tint — single soft gradient, no blobs */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 65% 48% at 14% 54%, rgba(45,212,191,0.055) 0%, transparent 62%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">

          {/* ── Left column: copy ── */}
          <div className="flex flex-col items-start">
            <HeroBadge text={copy.badge} />

            <HeroHeadline
              prefix={copy.headline.prefix}
              highlight={copy.headline.highlight}
              suffix={copy.headline.suffix}
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.2 }}
              className="mb-9 max-w-[50ch] text-[1.05rem] leading-[1.72] text-zinc-400 text-pretty"
            >
              {copy.subtitle}
            </motion.p>

            <HeroCtas copy={copy.ctas} />

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 28, delay: 0.44 }}
              className="mt-10 flex items-center"
              aria-label="Key numbers"
            >
              {STATS.map((stat, i) => (
                <div key={stat.label} className="flex items-center">
                  {i !== 0 && (
                    <span className="mx-5 h-4 w-px flex-shrink-0 bg-white/[0.08]" aria-hidden="true" />
                  )}
                  <div>
                    <p className="text-[18px] font-bold tracking-tight text-white tabular-nums">
                      {stat.value}
                    </p>
                    <p className="text-[10.5px] font-medium uppercase tracking-widest text-zinc-600">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right column: cards (desktop only) ── */}
          <motion.div
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 28, delay: 0.16 }}
            className="hidden lg:flex lg:flex-col lg:items-stretch"
          >
            <HeroCards cards={copy.cards} />
          </motion.div>
        </div>

        {/* Cards below content on mobile */}
        <div className="mt-10 lg:hidden">
          <HeroCards cards={copy.cards} />
        </div>
      </div>
    </section>
  );
}
