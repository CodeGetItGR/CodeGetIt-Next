import type { Transition } from 'framer-motion';

/** Shared premium easing - cubic-bezier(0.32, 0.72, 0, 1). */
export const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];

/** The It dot's base diameter in px — rest scales are derived from measured rest size / IT_BASE. */
export const IT_BASE = 16;

/**
 * Travel spring — the comedic beat: anticipate, travel, settle. The slight
 * overshoot at this stiffness/damping IS the landing squash; don't flatten it.
 */
export const TRAVEL = { stiffness: 260, damping: 26, mass: 1 } as const;

/**
 * Entrance timeline (ms). The dot pops in on the navbar tittle, holds a beat
 * while the hero words set themselves, then departs to land as their period.
 */
export const INTRO = { pop: 450, depart: 1350 } as const;

/** Hero copy timeline (s) — the last word lands just before the period arrives. */
export const T = {
  words: 0.15,
  sub: 1.05,
  ctas: 1.25,
} as const;

/**
 * Act II pinned-scene choreography — the causal chain per hop:
 * scroll moves the dot → its landing inks the title → the ink summons the card.
 */
export const ACT2 = {
  /** Scroll budget (vh): a beat of stillness, one segment per item, resolution. */
  introVh: 42,
  perItemVh: 55,
  closingVh: 35,
  /** Shorter pin under lg — gesture scrolling makes every pinned vh dearer. */
  compact: { introVh: 36, perItemVh: 48, closingVh: 28 },
  /**
   * Card enter starts this long after the old card finishes exiting (s) —
   * with the exit, the card lands ≈0.44s after the hop starts, once the ink
   * has visibly taken. The empty beat is what makes the card feel caused.
   */
  cardEnterDelay: 0.26,
  cardExit: 0.18,
  cardEnter: 0.42,
  /**
   * Fast-flick timings (s). When scroll velocity is high the caused chain
   * can't drain in time, so it stacks up and lags. These near-zero durations
   * collapse the choreography to a clean snap, so the scene tracks the finger
   * instead of queuing swaps; the full timings above return once scrolling
   * settles.
   */
  fast: { cardEnterDelay: 0, cardExit: 0.05, cardEnter: 0.001 },
} as const;

/**
 * Fade-and-rise entrance on mount. Pass the `useReducedMotion()` result so the
 * element renders in its final state when the user opts out of motion.
 */
export function fadeRise(delay: number, reduced: boolean | null, distance = 14) {
  if (reduced) return { initial: false as const };
  return {
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay } satisfies Transition,
  };
}

/** Fade-and-rise entrance when scrolled into view (once). */
export function fadeRiseInView(delay: number, reduced: boolean | null, distance = 14) {
  if (reduced) return { initial: false as const };
  return {
    initial: { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '0px 0px -12% 0px' },
    transition: { duration: 0.7, ease: EASE, delay } satisfies Transition,
  };
}
