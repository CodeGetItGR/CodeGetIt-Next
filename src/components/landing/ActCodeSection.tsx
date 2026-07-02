'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform, useVelocity, type MotionValue } from 'framer-motion';

import { useLocale } from '@/i18n/UseLocale';
import type { Translations } from '@/i18n/types';

import { ArtifactPlate, type ArtifactVariant } from './ArtifactPlate';
import { ACT2, ActLine, EASE, fadeRiseInView } from './it';

type CodeCopy = Translations['landing']['story']['code'];
type CodeItem = CodeCopy['items'][number];

/* ── Pinned-scene pieces ─────────────────────────────────────────────────── */
/**
 * The card swap. Enter waits out `timing.cardEnterDelay` so the ink visibly
 * takes first — dot, then title, then card. Direction lives in the rolling
 * index. A slight rotateY/scale gives the swap real depth (the tiled glyph
 * above is the other half of that — by explicit request, this is the one
 * place on the spine where Law 4 is relaxed alongside Law 1).
 */
type SwapTiming = { cardEnter: number; cardExit: number; cardEnterDelay: number };

const cardVariantsFor = (timing: SwapTiming) => ({
  enter: { opacity: 0, x: -48, rotateY: -10, scale: 0.97 },
  center: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    transition: { duration: timing.cardEnter, ease: EASE, delay: timing.cardEnterDelay },
  },
  exit: { opacity: 0, x: 40, rotateY: 10, scale: 0.97, transition: { duration: timing.cardExit, ease: EASE } },
});

const ACT2_ARTIFACTS: ArtifactVariant[] = ['tierStatic', 'tierApp', 'tierFull'];

function SpecCard({ item, index, artifactEyebrow, fast }: { item: CodeItem; index: number; artifactEyebrow: string; fast: boolean }) {
  const timing = fast ? ACT2.fast : ACT2.slow;
  // Children count time from the card's mount (after the old card's exit) —
  // adding the entrance delay keeps them synced to the card's actual arrival.
  const base = timing.cardEnterDelay;
  // On a fast flick the child wipes/tags would trail the snap, so collapse them too.
  const dur = (slow: number) => (fast ? 0.001 : slow);
  return (
    <motion.div variants={cardVariantsFor(timing)} initial="enter" animate="center" exit="exit" style={{ transformPerspective: 1000 }}>
      <ArtifactPlate
        variant={ACT2_ARTIFACTS[index % ACT2_ARTIFACTS.length]}
        plate={`Plate ${String(index + 2).padStart(2, '0')}`}
        eyebrow={artifactEyebrow}
        caption={item.title}
        compact
        framed={false}
        delay={base}
      />

      {/* Left-to-right wipe — the sentence is typeset in front of you */}
      <motion.p
        initial={{ clipPath: 'inset(0 100% 0 0)', x: -10 }}
        animate={{ clipPath: 'inset(0 -2% 0 0)', x: 0 }}
        transition={{ duration: dur(0.55), ease: EASE, delay: base + (fast ? 0 : 0.12) }}
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
            transition={{ duration: dur(0.45), ease: EASE, delay: base + (fast ? 0 : 0.24 + i * 0.06) }}
            className="rounded-full bg-brand-600/6 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-brand-700 ring-1 ring-brand-600/15"
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/** The resolution fills the card slot while the dot returns to the line. */
function ClosingNote({ text, fast }: { text: string; fast: boolean }) {
  const timing = fast ? ACT2.fast : ACT2.slow;
  return (
    <motion.p
      aria-hidden
      initial={{ opacity: 0, x: -16 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: { duration: fast ? 0.001 : 0.45, ease: EASE, delay: timing.cardEnterDelay },
      }}
      exit={{ opacity: 0, transition: { duration: timing.cardExit, ease: EASE } }}
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
    <span className="font-display block text-[clamp(0.95rem,1.6vw,1.3rem)] font-bold leading-tight tracking-[-0.02em] text-slate-900/30">
      {text}
    </span>
  );
}

/**
 * One build's slot on the rail — a rounded hairline track that inks teal as
 * its segment of the scroll fills. Broken out so each segment owns its own
 * `useTransform` (hooks must not run in a loop).
 */
function BuildSegment({ progress, i, introFrac, perFrac }: { progress: MotionValue<number>; i: number; introFrac: number; perFrac: number }) {
  const fill = useTransform(progress, (p) => {
    const local = (p - introFrac - i * perFrac) / perFrac;
    return Math.min(1, Math.max(0, local));
  });
  return (
    <div className="relative h-full flex-1 overflow-hidden rounded-full bg-slate-900/10">
      <motion.div style={{ scaleX: fill }} className="absolute inset-0 origin-left rounded-full bg-brand-600" />
    </div>
  );
}

/**
 * The build rail — a slim, in-scene progress scrubber tailored to Act II: one
 * segment per build, a spring-smoothed teal fill, a square "now" marker (Law 2:
 * the only circle is It), and a "which build of how many" counter. It borrows
 * the How-We-Work section's progress language (hairline track + brand fill +
 * haloed square marker) but lives *inside* the pinned stage, constrained to the
 * content width and anchored near the bottom where it's actually seen on mobile,
 * replacing the old edge-of-viewport hairline nobody noticed.
 */
function BuildProgress({
  progress,
  total,
  index,
  introFrac,
  perFrac,
}: {
  progress: MotionValue<number>;
  total: number;
  index: number;
  introFrac: number;
  perFrac: number;
}) {
  // Marker rides the front of the fill across the whole item region (intro and
  // closing pin it to the two ends).
  const markerLeft = useTransform(progress, (p) => {
    const f = Math.min(1, Math.max(0, (p - introFrac) / (perFrac * total)));
    return `${f * 100}%`;
  });
  const active = index >= 0 && index < total;
  return (
    <div aria-hidden className="pointer-events-none mx-auto w-full max-w-6xl shrink-0 px-6 pb-5 lg:px-10 lg:pb-7">
      {/* Right-aligned so it clears the It dot's bottom-left resting spot. */}
      <div className="mb-2 h-4 text-right text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
        <AnimatePresence mode="wait" initial={false}>
          {active && (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE } }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.15, ease: EASE } }}
              className="inline-block"
            >
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="relative flex h-1 items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <BuildSegment key={i} progress={progress} i={i} introFrac={introFrac} perFrac={perFrac} />
        ))}
        <motion.span
          style={{ left: markerLeft }}
          className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 bg-brand-600 shadow-[0_0_0_5px_rgba(13,148,136,0.15)]"
        />
      </div>
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

  // Desktop-only scene (mounted at lg+), so the wheel-paced budget is the only
  // one needed — the old mobile-shortened `compact` variant no longer applies.
  const { introVh, perItemVh, closingVh } = ACT2;

  const trackVh = introVh + perItemVh * total + closingVh;
  const introFrac = introVh / trackVh;
  const perFrac = perItemVh / trackVh;
  const closingFrac = closingVh / trackVh;

  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(-1);

  const [index, setIndex] = useState(-1);
  const [idle, setIdle] = useState(false);
  // `fast` = the user is flicking hard enough that the full caused choreography
  // can't drain in time. When set, swaps collapse to a snap, so nothing queues
  // up; it relaxes back to the elegant timings the moment scrolling settles.
  const [fast, setFast] = useState(false);
  const fastRef = useRef(false);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  // The rail's fill/marker glide off a spring-smoothed copy of the progress so,
  // it never jitters under momentum scrolling on mobile.
  const railProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 40 });
  const scrollVelocity = useVelocity(scrollYProgress);
  const engaged = useInView(stageRef, { once: true, amount: 0.75 });

  // Scroll progress → sequence index (and travel direction for the swaps).
  // -1 = intro cue · 0.total-1 = items · total = the closing return.
  useEffect(() => {
    const compute = (p: number) => {
      let next: number;
      if (p <= introFrac) next = -1;
      else if (p >= 1 - closingFrac) next = total;
      else next = Math.min(total - 1, Math.floor((p - introFrac) / perFrac));
      const prev = indexRef.current;
      if (next !== prev) {
        indexRef.current = next;
        setIndex(next);
      }
    };
    compute(scrollYProgress.get());
    return scrollYProgress.on('change', compute);
  }, [scrollYProgress, introFrac, perFrac, closingFrac, total]);

  // Velocity → fast/slow. Above the threshold we snap; a short idle debounce
  // drops back to the full choreography so the resting state always plays it.
  // Threshold is in progress-fraction/second over the whole track (~2 ≈ a
  // brisk flick); tune to taste.
  useEffect(() => {
    const FAST_THRESHOLD = 2;
    let relax: ReturnType<typeof setTimeout>;
    const setFastState = (v: boolean) => {
      if (fastRef.current === v) return;
      fastRef.current = v;
      setFast(v);
    };
    const unsub = scrollVelocity.on('change', (v) => {
      if (Math.abs(v) > FAST_THRESHOLD) setFastState(true);
      clearTimeout(relax);
      relax = setTimeout(() => setFastState(false), 120);
    });
    return () => {
      unsub();
      clearTimeout(relax);
    };
  }, [scrollVelocity]);

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

  const timing = fast ? ACT2.fast : ACT2.slow;

  return (
    <section
      ref={trackRef}
      id="build"
      className="relative"
      style={{ height: `calc(100vh + ${trackVh}vh)` }}
    >
      <div ref={stageRef} className="sticky top-0 flex h-screen flex-col overflow-hidden supports-[height:100svh]:h-svh">
        {/* `flex-1 min-h-0 overflow-hidden` reserves the rail's row below in
            normal flow, so long content (e.g., wrapped deliverable tags on
            narrow phones) clips here instead of visually overlapping the
            rail — it can never grow into space the rail already owns. */}
        <div className="relative mx-auto flex w-full min-h-0 max-w-6xl flex-1 flex-col justify-center overflow-hidden px-6 pt-28 md:pt-20 lg:px-10">
          <AnimatePresence mode="wait">
            {index < 0 || index >= total ? (
              /* ── Framing: centered, bookends the sequence ── */
              <motion.div
                key="framing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: timing.outerEnter, ease: EASE } }}
                exit={{ opacity: 0, y: -10, transition: { duration: timing.outerExit, ease: EASE } }}
                className="flex w-full flex-col items-center text-center"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {copy.actLabel}
                </p>
                <h2 className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-balance text-slate-900">
                  {copy.line}
                  <ActDot />
                </h2>
                <p className="mt-5 hidden max-w-[48ch] text-[1.02rem] leading-[1.75] text-slate-500 text-pretty md:block">
                  {copy.sub}
                </p>
                <div className="mt-10">
                  {index < 0 ? (
                    <ScrollCue label={copy.scrollCue} />
                  ) : (
                    <ClosingNote text={closingNote} fast={fast} />
                  )}
                </div>
              </motion.div>
            ) : (
              /* ── Sequence: two-column, heading left / card right ── */
              <motion.div
                key="sequence"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: timing.seqEnter, ease: EASE } }}
                exit={{ opacity: 0, transition: { duration: timing.seqExit, ease: EASE } }}
                className="w-full lg:grid lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-x-14"
              >
                {/* Left: label + live title + subtitle + build queue */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {copy.actLabel}
                  </p>
                  <div className="relative mt-4">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.h2
                        key={`item-${index}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: timing.titleEnter, ease: EASE } }}
                        exit={{ opacity: 0, y: -10, transition: { duration: timing.titleExit, ease: EASE } }}
                        className="font-display text-[clamp(2.2rem,6vw,4.2rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-balance text-slate-900 lg:text-[clamp(1.9rem,3.5vw,3rem)]"
                      >
                        {copy.items[index].title}
                        <ActDot />
                      </motion.h2>
                    </AnimatePresence>
                  </div>
                  <p className="mt-5 hidden max-w-[42ch] text-[1.02rem] leading-[1.75] text-slate-500 text-pretty md:block">
                    {copy.sub}
                  </p>
                  <ul className="mt-6 space-y-2 lg:mt-10 lg:space-y-4">
                    {copy.items.map((entry, i) => (
                      <motion.li key={entry.title} layout transition={{ duration: 0.5, ease: EASE }}>
                        {i > index && <TitleNode text={entry.title} />}
                        <span className="sr-only">
                          {entry.description} {entry.deliverables.join(', ')}.
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                {/* Right: artifact card */}
                <div
                  aria-hidden
                  className="relative mt-6 min-h-50 border-t border-slate-900/10 pt-4 lg:mt-0 lg:min-h-80 lg:border-0 lg:pt-0"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <SpecCard key={index} item={copy.items[index]} index={index} artifactEyebrow={copy.artifactEyebrow} fast={fast} />
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <IdleNudge label={copy.scrollCue} show={idle} />
          {/* On short viewports the card's tail (description/tags) can run
              past the available height and get clipped by `overflow-hidden`
              above — fade it out instead of a hard cut so it reads as
              intentional, not broken. */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-b from-transparent to-[#fafafa]" />
        </div>

        {/* Lives in normal flow (not fixed/absolute), so it's naturally scoped
            to this sticky stage — no separate "is the scene on screen" gate
            needed the way the old page-fixed bar required. */}
        <BuildProgress progress={railProgress} total={total} index={index} introFrac={introFrac} perFrac={perFrac} />
      </div>
    </section>
  );
}

/**
 * The plain, self-sizing stacked layout — used on mobile (where the pinned
 * scroll-hijack fights the browser toolbars) and for reduced motion. No pin, no
 * traveler, no rail: just the story as a normal section that scrolls like the
 * rest of the page. Each build fades/rises in as it's reached (a no-op under
 * reduced motion via `fadeRiseInView`).
 */
function StackedActCode({ copy }: { copy: CodeCopy }) {
  const reduced = useReducedMotion();
  return (
    <section id="build" className="relative py-28 lg:py-36">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{copy.actLabel}</p>
        <ActLine text={copy.line} restId="act-code" className="mt-5 text-[clamp(2.5rem,7vw,5rem)] leading-[1.02]" />
        <p className="mt-6 max-w-[52ch] text-[1.02rem] leading-[1.75] text-slate-500 text-pretty">{copy.sub}</p>

        <ul className="mt-14 space-y-10">
          {copy.items.map((entry, i) => (
            <motion.li
              key={entry.title}
              {...fadeRiseInView(i * 0.05, reduced)}
              className="border-t border-slate-900/10 pt-8 lg:grid lg:grid-cols-12 lg:gap-8"
            >
              <div className="mt-4 lg:col-span-7 lg:mt-0">
                <h3 className="font-display text-[clamp(1.5rem,3.4vw,2.4rem)] font-bold leading-[1.15] tracking-[-0.02em] text-slate-900">
                  {entry.title}
                  <span aria-hidden className="ml-[0.14em] inline-block h-[0.12em] w-[0.12em] rounded-full bg-brand-600 align-baseline" />
                </h3>
                <ArtifactPlate
                    variant={ACT2_ARTIFACTS[i % ACT2_ARTIFACTS.length]}
                    plate={`Plate ${String(i + 2).padStart(2, '0')}`}
                    eyebrow={copy.artifactEyebrow}
                    caption={entry.title}
                    compact
                    framed={false}
                    delay={0}
                    className={'my-4'}
                />
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
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Act II — "We code it". The pinned scroll-hijack scene is a desktop nicety:
 * it depends on a stable viewport height, which mobile browsers break as their
 * toolbars retract (title clipped under the navbar, rail jammed against the
 * bottom bar, dead space, janky momentum scroll). So it runs only at `lg+` with
 * motion allowed; every other case (mobile, reduced motion) gets the plain,
 * self-sizing stacked layout that scrolls like any normal section.
 */
export function ActCodeSection() {
  const { t } = useLocale();
  const copy = t.landing.story.code;
  const reduced = useReducedMotion();

  // SSR-safe: start `false` (mobile-safe) so the broken pinned scene is never
  // the initial render on a phone. Section 2 is below the fold, so this settles
  // while the user is still on the hero — no visible static→pinned swap.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return !reduced && isDesktop ? (
    <PinnedActCode copy={copy} closingNote={t.landing.whispers.code} />
  ) : (
    <StackedActCode copy={copy} />
  );
}
