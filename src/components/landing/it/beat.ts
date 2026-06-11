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
