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
 *
 * All three swaps (framing↔sequence, title, card) run their `AnimatePresence`
 * in a permanent `mode="wait"` — this must never be toggled at runtime (e.g.
 * based on scroll speed): Framer Motion doesn't support changing `mode` on a
 * live AnimatePresence, and switching it (even to "popLayout") corrupts its
 * transition state. `mode="popLayout"` also isn't safe as a blanket default
 * here specifically because the card's `ArtifactPlate` uses `whileInView` +
 * `viewport={{ once: true }}` and mounts already on-screen — under popLayout
 * that races Framer's own initial-style application and throws the same
 * "animate opacity from undefined" warning. `slow` is the full choreography;
 * `fast` collapses every duration near zero so a hard flick's swaps each
 * drain in well under a frame's worth of scroll instead of queuing up a
 * backlog — the snap comes from speed, never from changing how presence
 * itself is handled.
 */
export const ACT2 = {
  /** Scroll budget (vh): a beat of stillness, one segment per item, resolution.
   * Desktop-only — the pinned scene no longer renders on mobile, so there's no
   * shortened `compact` variant. */
  introVh: 42,
  perItemVh: 55,
  closingVh: 35,
  slow: {
    outerEnter: 0.55,
    outerExit: 0.25,
    seqEnter: 0.4,
    seqExit: 0.25,
    titleEnter: 0.6,
    titleExit: 0.2,
    /** Card lands ≈0.44s after the hop starts (0.18s exit + 0.26s delay),
     * once the ink has visibly taken. */
    cardEnter: 0.42,
    cardExit: 0.18,
    cardEnterDelay: 0.26,
  },
  fast: {
    outerEnter: 0.001,
    outerExit: 0.05,
    seqEnter: 0.001,
    seqExit: 0.05,
    titleEnter: 0.001,
    titleExit: 0.05,
    cardEnter: 0.001,
    cardExit: 0.05,
    cardEnterDelay: 0,
  },
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
