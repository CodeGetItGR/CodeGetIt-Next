'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

import { useLocale } from '@/i18n/UseLocale';
import type { Translations } from '@/i18n/types';
import { cn } from '@/lib/utils';

import { ACT2, ActLine, EASE, TRAVEL, fadeRiseInView } from './it';

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

function Glyph({ shapes, animated, delay = 0 }: { shapes: Shape[]; animated: boolean; delay?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-9 w-9 text-slate-900 lg:h-10 lg:w-10"
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
}

/* ── Pinned-scene pieces ─────────────────────────────────────────────────── */

/**
 * The card swap. Enter waits out ACT2.cardEnterDelay so the ink visibly takes
 * first — dot, then title, then card. Direction lives in the rolling index;
 * the card itself keeps one calm axis (no blur, no drift).
 */
const cardVariants = {
  enter: { opacity: 0, x: -48 },
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: ACT2.cardEnter, ease: EASE, delay: ACT2.cardEnterDelay },
  },
  exit: { opacity: 0, x: 40, transition: { duration: ACT2.cardExit, ease: EASE } },
};

/** The persistent counter — the active digit rolls in the scroll direction. */
function RollingIndex({ index, dir, total }: { index: number; dir: number; total: number }) {
  return (
    <span className="inline-flex items-baseline text-[11px] font-medium tracking-[0.18em] text-slate-400 tabular-nums">
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
    <motion.div variants={cardVariants} initial="enter" animate="center" exit="exit">
      <Glyph shapes={GLYPHS[index % GLYPHS.length]} animated delay={base} />

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
            className="rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500 ring-1 ring-slate-900/10"
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
      className="text-sm italic text-slate-400"
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
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <motion.span
        aria-hidden
        className="mt-4 block h-12 w-px origin-top bg-slate-900/25"
        animate={{ scaleY: [0, 1, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.3 }}
      />
    </motion.div>
  );
}

interface ItemRowProps {
  entry: CodeItem;
  state: 'draft' | 'active' | 'done';
  /** Pin progress + this item's segment — drives the under-rule fill. */
  progress: MotionValue<number>;
  segment: [number, number];
  periodRef: (el: HTMLSpanElement | null) => void;
  enterDelay: number;
}

/**
 * One build line: drafted outline → inked while the dot serves it → receded.
 * The period span must never sit under a transform (the dot is aimed at its
 * measured spot), so the entrance slides the title text inside a mask while
 * the row itself only fades.
 */
function ItemRow({ entry, state, progress, segment, periodRef, enterDelay }: ItemRowProps) {
  const fill = useTransform(progress, segment, [0, 1]);
  // The masked title is fully clipped at x:108%, so it can never trigger its
  // own whileInView — the unclipped row triggers and the variants propagate.
  const rowVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: EASE, delay: enterDelay } },
  };
  const slideVariants = {
    hidden: { x: '108%' },
    visible: { x: '0%', transition: { duration: 0.8, ease: EASE, delay: enterDelay } },
  };
  return (
    <li>
      <motion.div
        variants={rowVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-fit"
      >
        <span
          className={cn(
            'act-title font-display text-[clamp(1.55rem,3.4vw,2.9rem)] font-bold leading-[1.15] tracking-[-0.02em]',
            state === 'draft' && 'act-title--draft',
            state === 'active' && 'act-title--active',
            state === 'done' && 'act-title--done',
          )}
        >
          <span className="inline-block overflow-hidden pb-[0.12em] mb-[-0.12em] align-bottom">
            <motion.span className="inline-block will-change-transform" variants={slideVariants}>
              {entry.title}
            </motion.span>
          </span>
          <span ref={periodRef} aria-hidden className="ml-[0.14em] inline-block h-[0.12em] w-[0.12em] align-baseline" />
        </span>
        {/* Segment progress — fills while this line is being read */}
        <motion.span
          aria-hidden
          style={{ scaleX: fill }}
          className={cn(
            'mt-1 block h-px origin-left bg-slate-900/30 transition-opacity duration-300',
            // appears with the ink, not before it — same beat as the title
            state === 'active' ? 'opacity-100 delay-280' : 'opacity-0',
          )}
        />
      </motion.div>
      {/* The spec card is visual theater; readers get the spec inline. */}
      <span className="sr-only">
        {entry.description} {entry.deliverables.join(', ')}.
      </span>
    </li>
  );
}

interface SpotPoint {
  x: number;
  y: number;
  size: number;
}

/**
 * The pinned scene. The track reserves the scroll budget; the stage sticks for
 * its duration while progress drives the sequence — nobody leaves until all
 * four builds have been met. A local stage dot plays It in here (stage
 * coordinates are pin-invariant); the global dot is parked off-screen at the
 * hero until Act III, so only one It is ever visible. The scene resolves with
 * the dot returning to finish the line — "We code it." — before the pin lets go.
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
  const gridRef = useRef<HTMLDivElement>(null);
  const lineDotRef = useRef<HTMLSpanElement>(null);
  const itemDotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const spotsRef = useRef<SpotPoint[]>([]);
  const indexRef = useRef(-1);
  const poppedRef = useRef(false);

  const [index, setIndex] = useState(-1);
  const [dir, setDir] = useState(1);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const engaged = useInView(stageRef, { once: true, amount: 0.75 });

  // ── The stage dot ──
  const dx = useMotionValue(-100);
  const dy = useMotionValue(-100);
  const dsize = useMotionValue(0);
  const squash = useMotionValue(1);
  const sx = useSpring(dx, TRAVEL);
  const sy = useSpring(dy, TRAVEL);
  const sw = useSpring(dsize, { stiffness: 420, damping: 26 });
  const sq = useSpring(squash, { stiffness: 520, damping: 18 });

  /**
   * Spot for a sequence position: items map to their periods; the intro (-1)
   * and the closing return (total) both rest on the act line's period.
   */
  const spotFor = useCallback((i: number) => spotsRef.current[i < 0 || i >= total ? 0 : i + 1], [total]);

  // Stage coordinates don't move while pinned, so a measure on mount/resize
  // and font-load keeps the spots honest without per-frame reads.
  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const sRect = stage.getBoundingClientRect();
    const toSpot = (el: HTMLSpanElement | null): SpotPoint | null => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      if (r.width === 0) return null;
      return {
        x: r.left - sRect.left + r.width / 2,
        y: r.top - sRect.top + r.height / 2,
        size: Math.max(r.width, 5),
      };
    };
    const spots: (SpotPoint | null)[] = [toSpot(lineDotRef.current)];
    for (let i = 0; i < total; i++) spots.push(toSpot(itemDotRefs.current[i]));
    if (spots.some((s) => s === null)) return;
    spotsRef.current = spots as SpotPoint[];
    // Re-seat the dot silently after layout shifts (resize, font swap).
    if (poppedRef.current) {
      const spot = spotFor(indexRef.current);
      dx.set(spot.x - spot.size / 2);
      dy.set(spot.y - spot.size / 2);
      dsize.set(spot.size);
    }
  }, [total, spotFor, dx, dy, dsize]);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (stageRef.current) observer.observe(stageRef.current);
    // The stage content is justify-centered, so a card slot that outgrows its
    // min-h shifts the whole list without resizing the stage — watching the
    // grid catches that and re-seats the dot silently.
    if (gridRef.current) observer.observe(gridRef.current);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

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

  // First sight of the stage: the dot pops in on the line's period.
  useEffect(() => {
    if (!engaged || poppedRef.current) return;
    measure();
    const spot = spotFor(indexRef.current);
    if (!spot) return;
    dx.jump(spot.x - spot.size / 2);
    dy.jump(spot.y - spot.size / 2);
    dsize.jump(0);
    poppedRef.current = true;
    const pop = setTimeout(() => dsize.set(spot.size), 140);
    return () => clearTimeout(pop);
  }, [engaged, measure, dx, dy, dsize, spotFor]);

  // Each hop: spring to the new period with the landing squash.
  useEffect(() => {
    if (!poppedRef.current) return;
    const spot = spotFor(index);
    if (!spot) return;
    dx.set(spot.x - spot.size / 2);
    dy.set(spot.y - spot.size / 2);
    dsize.set(spot.size);
    squash.set(1.28);
    const settle = setTimeout(() => squash.set(1), 150);
    return () => clearTimeout(settle);
  }, [index, dx, dy, dsize, squash, spotFor]);

  return (
    <section
      ref={trackRef}
      className="relative"
      style={{ height: `calc(100vh + ${trackVh}vh)` }}
    >
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden supports-[height:100svh]:h-svh">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-6 pb-8 pt-20 lg:px-10">
          <motion.p
            {...fadeRiseInView(0, false)}
            className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400"
          >
            {copy.actLabel}
          </motion.p>

          <ActLine
            text={copy.line}
            periodRef={lineDotRef}
            className="mt-4 text-[clamp(2.2rem,6vw,4.2rem)] leading-[1.02]"
          />

          <motion.p
            {...fadeRiseInView(0.15, false)}
            className="mt-5 hidden max-w-[52ch] text-[1.02rem] leading-[1.75] text-slate-500 text-pretty md:block"
          >
            {copy.sub}
          </motion.p>

          <div ref={gridRef} className="mt-10 grid items-center gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-8">
            {/* The build list — every line gets its own scroll segment */}
            <ul className="order-1 space-y-5 lg:order-2 lg:col-span-7 lg:space-y-6">
              {copy.items.map((entry, i) => (
                <ItemRow
                  key={entry.title}
                  entry={entry}
                  state={i === index ? 'active' : i < index ? 'done' : 'draft'}
                  progress={scrollYProgress}
                  segment={[introFrac + i * perFrac, introFrac + (i + 1) * perFrac]}
                  periodRef={(el) => {
                    itemDotRefs.current[i] = el;
                  }}
                  enterDelay={0.1 + i * 0.08}
                />
              ))}
            </ul>

            {/* The spec card — swaps in step with the dot, never leaves sight */}
            <div
              aria-hidden
              className="relative order-2 min-h-75 border-t border-slate-900/10 pt-6 lg:order-1 lg:col-span-5 lg:min-h-70"
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

        {/* The stage's It — takes the relay inside the pin */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 rounded-full bg-brand-600 will-change-transform"
          style={{ x: sx, y: sy, width: sw, height: sw, scale: sq }}
        />
      </div>
    </section>
  );
}

/** Reduced motion: no pin, no traveler — the story survives as punctuation. */
function StaticActCode({ copy }: { copy: CodeCopy }) {
  return (
    <section className="relative py-28 lg:py-36">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.actLabel}</p>
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
