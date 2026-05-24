import React from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

import { cn } from '@/lib/utils';

import type { HeroCopy } from './hero.types';

interface HeroCardsProps {
  cards: HeroCopy['cards'];
}

// ─── Animation variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.34 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 280, damping: 24 },
  },
};

// ─── Moving conic-gradient border beam ────────────────────────────────────────
// Isolated + memoized so it never causes parent re-renders.

const MovingBeam = React.memo(function MovingBeam() {
  const rotate = useMotionValue(0);

  useAnimationFrame((t) => {
    rotate.set((t / 40) % 360);
  });

  const bg = useMotionTemplate`conic-gradient(from ${rotate}deg at 50% 50%, transparent 0deg, rgba(45,212,191,0.55) 52deg, rgba(45,212,191,0) 104deg)`;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ background: bg }}
      aria-hidden="true"
    />
  );
});

// ─── 3-D perspective tilt ─────────────────────────────────────────────────────

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

function TiltCard({ children, className }: TiltCardProps) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 280,
    damping: 30,
  });
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]), {
    stiffness: 280,
    damping: 30,
  });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <div style={{ perspective: '900px' }}>
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY }}
        className={cn('relative w-full', className)}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── In-card previews ─────────────────────────────────────────────────────────

/** Light-mode mini browser window — shows a stylised client website */
function SitePreview() {
  return (
    <div className="mt-3.5 overflow-hidden rounded-[8px] border border-white/[0.07]">
      {/* macOS titlebar */}
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-[#0a0e28] px-2.5 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5F57]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#FFBC2E]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#28C840]" />
        <div className="mx-auto flex h-3 w-28 items-center justify-center rounded-sm bg-white/[0.05]">
          <span className="text-[6px] font-medium text-zinc-700">clientsite.com</span>
        </div>
      </div>

      {/* Light-mode website mockup */}
      <div className="bg-zinc-50/95 p-2.5">
        {/* Nav strip */}
        <div className="mb-2 flex items-center justify-between">
          <div className="h-1.5 w-9 rounded-full bg-zinc-800/70" />
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-1 w-4 rounded-full bg-zinc-300/80" />
            ))}
          </div>
        </div>

        {/* Hero area */}
        <div className="mb-2 rounded-sm bg-white p-2 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="mb-0.5 h-2 w-16 rounded-full bg-zinc-800/80" />
          <div className="mb-2 h-1.5 w-24 rounded-full bg-zinc-400/50" />
          <div className="flex h-4 w-14 items-center justify-center rounded-sm bg-teal-500/80">
            <div className="h-1 w-5 rounded-full bg-white/80" />
          </div>
        </div>

        {/* Metric pills */}
        <div className="grid grid-cols-3 gap-1">
          {[
            { v: '+23%', l: 'Revenue' },
            { v: '1.2k', l: 'Visits' },
            { v: '4.9★', l: 'Rating' },
          ].map((s) => (
            <div key={s.l} className="rounded-sm bg-zinc-100 p-1.5">
              <p className="text-[7px] font-bold text-teal-600">{s.v}</p>
              <p className="text-[5.5px] text-zinc-500">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Dark metrics panel — shows a client portal dashboard */
function MetricsPanel() {
  return (
    <div className="mt-3.5 overflow-hidden rounded-[8px] border border-white/[0.07]">
      <div className="border-b border-white/[0.05] bg-white/[0.03] px-3 py-1.5">
        <span className="text-[8px] font-semibold uppercase tracking-widest text-zinc-600">
          Portal metrics
        </span>
      </div>
      <div className="bg-[#080c22]/70 px-3 py-2">
        {[
          { label: 'Active clients', value: '127', trend: '+8 this mo.' },
          { label: 'Satisfaction', value: '94.3%', trend: null },
          { label: 'Avg response', value: '1.4h', trend: '↓ 0.2h' },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            className={cn(
              'flex items-center justify-between py-1.5',
              i < arr.length - 1 && 'border-b border-white/[0.04]',
            )}
          >
            <span className="text-[10px] text-zinc-600">{row.label}</span>
            <div className="flex items-center gap-1.5">
              {row.trend && (
                <span className="text-[8px] font-medium text-teal-400/60">{row.trend}</span>
              )}
              <span className="tabular-nums text-[11px] font-semibold text-zinc-300">
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

type IconProps = { className?: string };

function BusinessIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function CustomerIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

const CARD_ICONS = [BusinessIcon, CustomerIcon] as const;
const CARD_PREVIEWS = [SitePreview, MetricsPanel] as const;

// ─── Public component ─────────────────────────────────────────────────────────

export function HeroCards({ cards }: HeroCardsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex w-full flex-col gap-4"
    >
      {cards.map((card, index) => {
        const Icon = CARD_ICONS[index % CARD_ICONS.length];
        const Preview = CARD_PREVIEWS[index % CARD_PREVIEWS.length];

        return (
          <motion.div key={card.title} variants={cardVariants}>
            <TiltCard>
              {/*
               * Outer wrapper: rounded-[14px] overflow-hidden p-[1px]
               * The MovingBeam fills this layer — visible as a 1px animated border.
               * Inner content sits on top with rounded-[13px] bg.
               */}
              <div className="relative overflow-hidden rounded-[14px] p-[1px]">
                <MovingBeam />

                <div className="relative rounded-[13px] bg-[#0b0f28]/95 p-5">
                  {/* Icon + title row */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-teal-500/20 bg-teal-500/[0.09]">
                      <Icon className="text-teal-400/80" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold leading-snug text-zinc-200">
                        {card.title}
                      </p>
                      <p className="mt-0.5 text-[12px] leading-[1.55] text-zinc-600">{card.sub}</p>
                    </div>
                  </div>

                  {/* Visual preview panel */}
                  <Preview />
                </div>
              </div>
            </TiltCard>
          </motion.div>
        );
      })}

      {/* Availability pulse */}
      <motion.div
        variants={cardVariants}
        className="flex items-center gap-2 px-1 pt-0.5"
      >
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
        </span>
        <span className="text-[11px] font-medium text-zinc-600">
          Currently taking on new work
        </span>
      </motion.div>
    </motion.div>
  );
}
