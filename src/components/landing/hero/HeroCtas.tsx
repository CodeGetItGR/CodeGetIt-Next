'use client';

import React from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

import { cn } from '@/lib';

import { Socket } from '../it';

import type { HeroCopy } from './hero.types';

interface HeroCtasProps {
  copy: HeroCopy['ctas'];
}

interface MagneticCtaProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function MagneticCta({ href, children, className }: MagneticCtaProps) {
  const reduced = useReducedMotion();
  const x  = useMotionValue(0);
  const y  = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 20 });
  const sy = useSpring(y, { stiffness: 180, damping: 20 });

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width  / 2)) * 0.28);
    y.set((e.clientY - (rect.top  + rect.height / 2)) * 0.28);
  }

  function onLeave() { x.set(0); y.set(0); }

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

/**
 * Ink-only CTAs — the color law says teal belongs to It, so buttons are ink.
 * Entrance choreography is owned by the parent (HeroSection's fadeRise).
 */
export function HeroCtas({ copy }: HeroCtasProps) {
  return (
    <div className="flex flex-row flex-wrap items-center gap-3">
      {/* Primary — magnetic + button-in-button arrow */}
      <MagneticCta
        href="#contact"
        className={cn(
          'group cta-polish',
          'inline-flex cursor-pointer items-center gap-2 rounded-full border-none',
          'bg-brand-600 py-2.5 pr-2 pl-5 no-underline',
          'text-[15px] font-semibold tracking-[-0.01em] text-white',
          'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-brand-700 active:scale-[0.98]',
        )}
      >
        <Socket />
        {copy.primary}
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </span>
      </MagneticCta>

      {/* Secondary — ghost slate border */}
      <motion.a
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        href="#projects"
        className={cn(
          'cursor-pointer rounded-full border border-slate-900/12 bg-transparent px-6 py-2.5',
          'text-[15px] font-medium text-slate-600 no-underline',
          'transition-all duration-200 hover:border-slate-900/20 hover:text-slate-900',
        )}
      >
        {copy.secondary}
      </motion.a>
    </div>
  );
}
