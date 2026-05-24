import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

import { cn } from '@/lib';

import type { HeroCopy } from './hero.types';

interface HeroCtasProps {
  copy: HeroCopy['ctas'];
}

// ─── Magnetic CTA ─────────────────────────────────────────────────────────────
// Uses MotionValues + spring physics — zero React re-renders on mouse move.

interface MagneticCtaProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function MagneticCta({ href, children, className }: MagneticCtaProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 20 });
  const sy = useSpring(y, { stiffness: 180, damping: 20 });

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.28);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.28);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function HeroCtas({ copy }: HeroCtasProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.28 }}
      className="flex flex-col items-start gap-4"
    >
      <div className="flex flex-row items-center gap-3">
        {/* Primary — magnetic pull + sheen on hover via .cta-polish */}
        <MagneticCta
          href="#contact"
          className={cn(
            'cta-polish',
            'cursor-pointer rounded-[10px] border-none bg-white px-7 py-3',
            'text-[15px] font-semibold tracking-[-0.01em] text-[#080910] no-underline',
            'hover:opacity-90',
          )}
        >
          {copy.primary}
        </MagneticCta>

        {/* Secondary — subtle hover lift */}
        <motion.a
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          href="#projects"
          className={cn(
            'cursor-pointer rounded-[10px] border border-white/10 bg-transparent px-5 py-3',
            'text-[15px] font-medium text-zinc-500 no-underline',
            'transition-all duration-200 hover:border-white/20 hover:text-zinc-300',
          )}
        >
          {copy.secondary}
        </motion.a>
      </div>

      {/* Trust note */}
      {copy.note && (
        <p className="text-[12px] font-medium tracking-wide text-zinc-600">{copy.note}</p>
      )}
    </motion.div>
  );
}
