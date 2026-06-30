'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';

import { useLocale } from '@/i18n/UseLocale';
import type { Translations } from '@/i18n/types';
import { cn } from '@/lib/utils';

import { ArtifactPlate, type ArtifactVariant } from './ArtifactPlate';
import { ACT2, ActLine, EASE, fadeRiseInView } from './it';

type CodeCopy = Translations['landing']['story']['code'];
type CodeItem = CodeCopy['items'][number];

/* ── Spec-card glyphs ──────────────────────────────────────────────────────
 * Hairline ink line-work, deliberately rectilinear: the only circle on the
 * page is It, and color belongs to It — so the glyphs stay ink and angular.
 */

type Shape =
  | { kind: 'rect'; x: number; y: number; w: number; h: number }
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { kind: 'path'; d: string };

const GLYPHS: Shape[][] = [
  // Full-stack applications — interface above, engine below, one wire between
  [
    { kind: 'rect', x: 3.75, y: 3.75, w: 16.5, h: 6.25 },
    { kind: 'rect', x: 3.75, y: 14, w: 16.5, h: 6.25 },
    { kind: 'line', x1: 12, y1: 10, x2: 12, y2: 14 },
  ],
  // Custom websites — a typeset page: headline rule, body rules
  [
    { kind: 'rect', x: 4.75, y: 3.25, w: 14.5, h: 17.5 },
    { kind: 'line', x1: 8, y1: 8.5, x2: 16, y2: 8.5 },
    { kind: 'line', x1: 8, y1: 12, x2: 16, y2: 12 },
    { kind: 'line', x1: 8, y1: 15.5, x2: 12.5, y2: 15.5 },
  ],
  // Landing pages — the descent onto a baseline
  [
    { kind: 'line', x1: 12, y1: 3.5, x2: 12, y2: 14.5 },
    { kind: 'path', d: 'M8 10.5 12 14.5 16 10.5' },
    { kind: 'line', x1: 5, y1: 19.5, x2: 19, y2: 19.5 },
  ],
  // Web platforms — four modules
  [
    { kind: 'rect', x: 4.25, y: 4.25, w: 6.5, h: 6.5 },
    { kind: 'rect', x: 13.25, y: 4.25, w: 6.5, h: 6.5 },
    { kind: 'rect', x: 4.25, y: 13.25, w: 6.5, h: 6.5 },
    { kind: 'rect', x: 13.25, y: 13.25, w: 6.5, h: 6.5 },
  ],
];

const drawShape = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.5, ease: EASE, delay },
      opacity: { duration: 0.01, delay },
    },
  }),
};

/**
 * `tiled` echoes the dot with a soft teal tile + lift behind the glyph — the
 * same bg-brand-600/8 + text-brand-600 chip language already used for icons
 * in the interior sections (Services factors, Comparison rows), brought onto
 * the spine by explicit request. The glyph itself stays rectilinear ink
 * line-work; only its color and the tile around it carry the accent.
 */
function Glyph({ shapes, animated, delay = 0, tiled = false }: { shapes: Shape[]; animated: boolean; delay?: number; tiled?: boolean }) {
  const svg = (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-9 w-9 lg:h-10 lg:w-10', tiled ? 'text-slate-700' : 'text-slate-900')}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      aria-hidden
    >
      {shapes.map((shape, i) => {
        const anim = {
          variants: drawShape,
          initial: animated ? ('hidden' as const) : (false as const),
          animate: 'visible' as const,
          custom: delay + 0.15 + i * 0.1,
        };
        if (shape.kind === 'rect') {
          return <motion.rect key={i} x={shape.x} y={shape.y} width={shape.w} height={shape.h} {...anim} />;
        }
        if (shape.kind === 'line') {
          return <motion.line key={i} x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} {...anim} />;
        }
        return <motion.path key={i} d={shape.d} {...anim} />;
      })}
    </svg>
  );

  if (!tiled) return svg;

  return (
    <span className="inline-flex rounded-2xl bg-slate-900/6 p-4 ring-1 ring-slate-900/10 soft-shadow">
      {svg}
    </span>
  );
}

/* ── Pinned-scene pieces ─────────────────────────────────────────────────── */

/**
 * The card swap. Enter waits out ACT2.cardEnterDelay so the ink visibly takes
 * first — dot, then title, then card. Direction lives in the rolling index.
 * A slight rotateY/scale gives the swap real depth (the tiled glyph above is
 * the other half of that — by explicit request, this is the one place on the
 * spine where Law 4 is relaxed alongside Law 1).
 */
const cardVariants = {
  enter: { opacity: 0, x: -48, rotateY: -10, scale: 0.97 },
  center: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    transition: { duration: ACT2.cardEnter, ease: EASE, delay: ACT2.cardEnterDelay },
  },
  exit: { opacity: 0, x: 40, rotateY: 10, scale: 0.97, transition: { duration: ACT2.cardExit, ease: EASE } },
};

const ACT2_ARTIFACTS: ArtifactVariant[] = ['tierStatic', 'tierApp', 'tierFull'];

/** The persistent counter — the active digit rolls in the scroll direction. */
function RollingIndex({ index, dir, total }: { index: number; dir: number; total: number }) {
  return (
    <span className="inline-flex items-baseline text-[11px] font-medium tracking-[0.18em] text-slate-500 tabular-nums">
      <span className="inline-flex h-[1.2em] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.span
            key={index}
            initial={{ y: `${dir * 110}%` }}
            animate={{ y: '0%' }}
            exit={{ y: `${dir * -110}%` }}
            transition={{ duration: 0.4, ease: EASE }}
            className="inline-block"
          >
            {String(index + 1).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="ml-1">/ {String(total).padStart(2, '0')}</span>
    </span>
  );
}

function SpecCard({ item, index }: { item: CodeItem; index: number }) {
  // Children count time from the card's mount (after the old card's exit) —
  // adding the enter delay keeps them synced to the card's actual arrival.
  const base = ACT2.cardEnterDelay;
  return (
    <motion.div variants={cardVariants} initial="enter" animate="center" exit="exit" style={{ transformPerspective: 1000 }}>
      <ArtifactPlate
        variant={ACT2_ARTIFACTS[index % ACT2_ARTIFACTS.length]}
        plate={`Plate ${String(index + 2).padStart(2, '0')}`}
        eyebrow="shop artifact"
        caption={item.title}
        compact
        delay={base}
      />

      {/* Left-to-right wipe — the sentence is typeset in front of you */}
      <motion.p
        initial={{ clipPath: 'inset(0 100% 0 0)', x: -10 }}
        animate={{ clipPath: 'inset(0 -2% 0 0)', x: 0 }}
        transition={{ duration: 0.55, ease: EASE, delay: base + 0.12 }}
        className="mt-5 max-w-[42ch] text-[0.95rem] leading-[1.7] text-slate-600 text-pretty lg:text-[0.98rem]"
      >
        {item.description}
      </motion.p>

      <div className="mt-6 flex flex-wrap gap-2">
        {item.deliverables.map((tag, i) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: base + 0.24 + i * 0.06 }}
            className="rounded-full bg-brand-600/6 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-brand-700 ring-1 ring-brand-600/15"
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/** The resolution — fills the card slot while the dot returns to the line. */
function ClosingNote({ text }: { text: string }) {
  return (
    <motion.p
      aria-hidden
      initial={{ opacity: 0, x: -16 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: { duration: 0.45, ease: EASE, delay: ACT2.cardEnterDelay },
      }}
      exit={{ opacity: 0, transition: { duration: 0.18, ease: EASE } }}
      className="text-sm italic text-slate-500"
    >
      {text}
    </motion.p>
  );
}

/** Shown during the intro beat, before the first segment unlocks. */
function ScrollCue({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, ease: EASE, delay: 0.3 } }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.22, ease: EASE } }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <motion.span
        aria-hidden
        className="mt-4 block h-12 w-px origin-top bg-slate-900/25"
        animate={{ scaleY: [0, 1, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.3 }}
      />
    </motion.div>
  );
}

/** The traveling It's period — wherever the active declaration is, this is it. */
function ActDot() {
  return (
    <span
      aria-hidden
      className="ml-[0.12em] inline-block h-[0.13em] w-[0.13em] rounded-full bg-brand-600 align-baseline"
    />
  );
}

/**
 * A compact list title — plain, instant, no per-item animation. Once read, an
 * item simply stops rendering here (it doesn't recede into a "done" row), so
 * the list only ever shows what's still ahead.
 */
function TitleNode({ text }: { text: string }) {
  return (
    <span className="font-display block text-[clamp(0.95rem,1.6vw,1.3rem)] font-bold leading-[1.25] tracking-[-0.02em] text-slate-900/30">
      {text}
    </span>
  );
}

/**
 * The top scrubber bar — a bold, video/story-style progress bar fixed across
 * the very top of the viewport, visible at every breakpoint (the previous
 * `ProgressTrack` was a thin edge hairline hidden below `sm`, easy to miss
 * even on desktop). Same `scrollYProgress` already driving the sequence,
 * just remapped to `width` instead of vertical `top`. Per-item ticks make
 * "N steps, here's where you are" legible at a glance. Sits in the ~16px gap
 * above the navbar's floating pill (which starts at `mt-4`, not flush to the
 * edge), at a lower z-index than the navbar (z-50) so it never competes.
 */
function TopScrubberBar({
  progress,
  total,
  introFrac,
  perFrac,
}: {
  progress: MotionValue<number>;
  total: number;
  introFrac: number;
  perFrac: number;
}) {
  const width = useTransform(progress, [0, 1], ['0%', '100%']);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px] bg-slate-900/10">
      <motion.div style={{ width }} className="h-full bg-brand-600" />
      {Array.from({ length: total }, (_, i) => introFrac + (i + 1) * perFrac).map((t, i) => (
        <span
          key={i}
          style={{ left: `${t * 100}%` }}
          className="absolute top-0 h-full w-px -translate-x-1/2 bg-[#fafafa]"
        />
      ))}
    </div>
  );
}

/** The idle-scroll nudge — fires only once scrolling has actually stalled. */
function IdleNudge({ label, show }: { label: string; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } }}
          exit={{ opacity: 0, y: 8, transition: { duration: 0.2, ease: EASE } }}
          className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center lg:bottom-12"
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-slate-900/15"
          >
            {label} ↓
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * The pinned scene. The track reserves the scroll budget; the stage sticks for
 * its duration while progress drives the sequence — nobody leaves until all
 * four builds have been met. The dot is played by a single shared-layout
 * element (see ActDot) that relocates between the act line and the active
 * item's title, so its motion is handled entirely by Framer's own layout
 * projection — no separate measurement system to fall out of sync.
 */
function PinnedActCode({ copy, closingNote }: { copy: CodeCopy; closingNote: string }) {
  const total = copy.items.length;

  // Pacing: a shorter pin under lg — gesture scrolling tires faster than a wheel.
  const [compactPin, setCompactPin] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setCompactPin(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  const { introVh, perItemVh, closingVh } = compactPin ? ACT2.compact : ACT2;

  const trackVh = introVh + perItemVh * total + closingVh;
  const introFrac = introVh / trackVh;
  const perFrac = perItemVh / trackVh;
  const closingFrac = closingVh / trackVh;

  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(-1);

  const [index, setIndex] = useState(-1);
  const [dir, setDir] = useState(1);
  const [idle, setIdle] = useState(false);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const engaged = useInView(stageRef, { once: true, amount: 0.75 });
  // Unlike `engaged` (sticky once true), this tracks whether the pinned stage
  // is *currently* on screen — the fixed top scrubber bar should only show
  // while this scene actually holds the viewport, not for the rest of the page.
  const stageOnScreen = useInView(trackRef, { amount: 0 });

  // Scroll progress → sequence index (and travel direction for the swaps).
  // -1 = intro cue · 0..total-1 = items · total = the closing return.
  useEffect(() => {
    const compute = (p: number) => {
      let next: number;
      if (p <= introFrac) next = -1;
      else if (p >= 1 - closingFrac) next = total;
      else next = Math.min(total - 1, Math.floor((p - introFrac) / perFrac));
      const prev = indexRef.current;
      if (next !== prev) {
        indexRef.current = next;
        setDir(next > prev ? 1 : -1);
        setIndex(next);
      }
    };
    compute(scrollYProgress.get());
    return scrollYProgress.on('change', compute);
  }, [scrollYProgress, introFrac, perFrac, closingFrac, total]);

  // Idle-scroll nudge: if the user pauses mid-sequence (not the intro, which
  // already has its own cue), say so — but only once scrolling has actually
  // stalled, so it never nags someone who's scrolling fine.
  useEffect(() => {
    if (!engaged) return;
    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      setIdle(false);
      clearTimeout(timer);
      if (indexRef.current >= 0 && indexRef.current < total) {
        timer = setTimeout(() => setIdle(true), 1200);
      }
    };
    arm();
    const unsub = scrollYProgress.on('change', arm);
    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, [engaged, scrollYProgress, total]);

  return (
    <section
      ref={trackRef}
      id="build"
      className="relative"
      style={{ height: `calc(100vh + ${trackVh}vh)` }}
    >
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden supports-[height:100svh]:h-svh">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-6 pb-4 pt-28 md:pt-20 lg:pb-8 lg:px-10">
          <motion.p
            {...fadeRiseInView(0, false)}
            className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500"
          >
            {copy.actLabel}
          </motion.p>

          <div className="relative mt-4">
            {/* Same fade-and-rise entrance every other section's heading uses —
               no shared-layout move, just a clean swap each hop. */}
            <AnimatePresence mode="wait" initial={false}>
              {index < 0 || index >= total ? (
                <motion.h2
                  key="line"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.2, ease: EASE } }}
                  className="font-display text-[clamp(2.2rem,6vw,4.2rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-balance text-slate-900"
                >
                  {copy.line}
                  <ActDot />
                </motion.h2>
              ) : (
                <motion.h2
                  key={`item-${index}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.2, ease: EASE } }}
                  className="font-display text-[clamp(2.2rem,6vw,4.2rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-balance text-slate-900"
                >
                  {copy.items[index].title}
                  <ActDot />
                </motion.h2>
              )}
            </AnimatePresence>
          </div>

          <motion.p
            {...fadeRiseInView(0.15, false)}
            className="mt-5 hidden max-w-[52ch] text-[1.02rem] leading-[1.75] text-slate-500 text-pretty md:block"
          >
            {copy.sub}
          </motion.p>

          <div className="mt-6 grid items-center gap-6 lg:mt-14 lg:grid-cols-12 lg:gap-8">
            {/* The build list — only what's still ahead; read items leave for
               good, reappearing only if you scroll back up past them. */}
            <ul className="order-1 space-y-2 lg:order-2 lg:col-span-7 lg:space-y-4">
              {copy.items.map((entry, i) => (
                <motion.li key={entry.title} layout transition={{ duration: 0.5, ease: EASE }}>
                  {i > index && <TitleNode text={entry.title} />}
                  {/* The spec card is visual theater; readers get the spec inline. */}
                  <span className="sr-only">
                    {entry.description} {entry.deliverables.join(', ')}.
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* The spec card — swaps in step with the dot, never leaves sight */}
            <div
              aria-hidden
              className="relative order-2 min-h-50 border-t border-slate-900/10 pt-6 lg:order-1 lg:col-span-5 lg:min-h-70"
            >
              <AnimatePresence>
                {index >= 0 && index < total && (
                  <motion.span
                    key="counter"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: EASE }}
                    className="absolute right-0 top-6"
                  >
                    <RollingIndex index={index} dir={dir} total={total} />
                  </motion.span>
                )}
              </AnimatePresence>
              <AnimatePresence mode="wait" initial={false}>
                {index < 0 ? (
                  <ScrollCue key="cue" label={copy.scrollCue} />
                ) : index >= total ? (
                  <ClosingNote key="closing" text={closingNote} />
                ) : (
                  <SpecCard key={index} item={copy.items[index]} index={index} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {stageOnScreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <TopScrubberBar progress={scrollYProgress} total={total} introFrac={introFrac} perFrac={perFrac} />
            </motion.div>
          )}
        </AnimatePresence>
        <IdleNudge label={copy.scrollCue} show={idle} />
      </div>
    </section>
  );
}

/** Reduced motion: no pin, no traveler — the story survives as punctuation. */
function StaticActCode({ copy }: { copy: CodeCopy }) {
  return (
    <section id="build" className="relative py-28 lg:py-36">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{copy.actLabel}</p>
        <ActLine text={copy.line} restId="act-code" className="mt-5 text-[clamp(2.5rem,7vw,5rem)] leading-[1.02]" />
        <p className="mt-6 max-w-[52ch] text-[1.02rem] leading-[1.75] text-slate-500 text-pretty">{copy.sub}</p>

        <ul className="mt-14 space-y-10">
          {copy.items.map((entry, i) => (
            <li key={entry.title} className="border-t border-slate-900/10 pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-5">
                <Glyph shapes={GLYPHS[i % GLYPHS.length]} animated={false} />
              </div>
              <div className="mt-4 lg:col-span-7 lg:mt-0">
                <h3 className="font-display text-[clamp(1.5rem,3.4vw,2.4rem)] font-bold leading-[1.15] tracking-[-0.02em] text-slate-900">
                  {entry.title}
                  <span aria-hidden className="ml-[0.14em] inline-block h-[0.12em] w-[0.12em] rounded-full bg-brand-600 align-baseline" />
                </h3>
                <p className="mt-3 max-w-[48ch] text-[0.98rem] leading-[1.75] text-slate-600 text-pretty">
                  {entry.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.deliverables.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500 ring-1 ring-slate-900/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Act II — "We code it", performed as a pinned scene. Scroll is the timeline:
 * the section holds the viewport while the dot hops down the build list, each
 * line is inked as it's read, and its spec card sweeps in from the left.
 */
export function ActCodeSection() {
  const { t } = useLocale();
  const copy = t.landing.story.code;
  const reduced = useReducedMotion();

  return reduced ? (
    <StaticActCode copy={copy} />
  ) : (
    <PinnedActCode copy={copy} closingNote={t.landing.whispers.code} />
  );
}
