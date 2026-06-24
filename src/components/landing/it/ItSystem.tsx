'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

import { cn } from '@/lib/utils';

import { INTRO, IT_BASE, TRAVEL } from './beat';

type RestRole = 'origin' | 'rest';

interface RestEntry {
  id: string;
  el: HTMLElement;
  role: RestRole;
}

interface RestPoint {
  id: string;
  /** Document coordinates of the rest's centre. */
  x: number;
  y: number;
  /** Measured diameter — rests size themselves in em so this tracks the font. */
  size: number;
}

interface ItContextValue {
  register: (entry: RestEntry) => void;
  unregister: (id: string) => void;
  /** Squash-acknowledge a rest (e.g. CTA hover) — only fires if the dot is there. */
  pulse: (id: string) => void;
  /**
   * Re-measure every registered rest. Transforms (e.g. a rest's own entrance
   * animation sliding it into place) don't trigger the body ResizeObserver,
   * so a rest that moves after it registers needs to ask for this explicitly
   * once it settles — otherwise the dot docks wherever it was measured first.
   */
  remeasure: () => void;
  /** The rest the dot currently occupies — sections use this to ink their lines. */
  activeId: string | null;
  /** True when rests render their own static teal periods (reduced motion). */
  staticDots: boolean;
}

const ItContext = createContext<ItContextValue | null>(null);

export function useIt() {
  const ctx = useContext(ItContext);
  if (!ctx) throw new Error('useIt must be used inside <ItProvider>');
  return ctx;
}

/** The reading line: the dot leaves a rest slightly before you fully arrive. */
const READING_LINE = 0.42;

/** Above this travel distance the dot re-enters from near the target instead of streaking. */
const STAGED_JUMP_PX = 1600;

export function ItProvider({ children }: { children: ReactNode }) {
  const entriesRef = useRef(new Map<string, RestEntry>());
  const pointsRef = useRef<RestPoint[]>([]);
  const originRef = useRef<RestPoint | null>(null);
  const measureRaf = useRef(0);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [version, setVersion] = useState(0);
  const [pulseTick, setPulseTick] = useState<{ id: string; n: number }>({ id: '', n: 0 });

  const updateActive = useCallback(() => {
    const points = pointsRef.current;
    if (points.length === 0) return;
    const readingLine = window.scrollY + window.innerHeight * READING_LINE;
    let current = points[0];
    for (const point of points) {
      if (point.y <= readingLine) current = point;
      else break;
    }
    setActiveId((prev) => (prev === current.id ? prev : current.id));
  }, []);

  const measure = useCallback(() => {
    cancelAnimationFrame(measureRaf.current);
    measureRaf.current = requestAnimationFrame(() => {
      const rests: RestPoint[] = [];
      originRef.current = null;
      entriesRef.current.forEach(({ id, el, role }) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0) return;
        const point: RestPoint = {
          id,
          x: rect.left + rect.width / 2 + window.scrollX,
          y: rect.top + rect.height / 2 + window.scrollY,
          size: rect.width,
        };
        if (role === 'origin') originRef.current = point;
        else rests.push(point);
      });
      rests.sort((a, b) => a.y - b.y);
      pointsRef.current = rests;
      updateActive();
      if (rests.length > 0) setReady(true);
      setVersion((v) => v + 1);
    });
  }, [updateActive]);

  const register = useCallback(
    (entry: RestEntry) => {
      entriesRef.current.set(entry.id, entry);
      measure();
    },
    [measure],
  );

  const unregister = useCallback(
    (id: string) => {
      entriesRef.current.delete(id);
      measure();
    },
    [measure],
  );

  const pulse = useCallback((id: string) => {
    setPulseTick((p) => ({ id, n: p.n + 1 }));
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const onScroll = () => updateActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure).catch(() => {});

    // Sections mount, fonts swap, accordions open — keep doc coords honest.
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      observer.disconnect();
      cancelAnimationFrame(measureRaf.current);
    };
  }, [measure, updateActive]);

  const value = useMemo<ItContextValue>(
    () => ({ register, unregister, pulse, remeasure: measure, activeId, staticDots: reduced }),
    [register, unregister, pulse, measure, activeId, reduced],
  );

  return (
    <ItContext.Provider value={value}>
      {children}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        {!reduced && (
          <TheItDot
            activeId={activeId}
            ready={ready}
            version={version}
            pulseTick={pulseTick}
            pointsRef={pointsRef}
            originRef={originRef}
          />
        )}
      </div>
    </ItContext.Provider>
  );
}

interface TheItDotProps {
  activeId: string | null;
  ready: boolean;
  version: number;
  pulseTick: { id: string; n: number };
  pointsRef: MutableRefObject<RestPoint[]>;
  originRef: MutableRefObject<RestPoint | null>;
}

/**
 * The protagonist. One absolutely-positioned teal circle whose x/y/scale ride
 * springs between registered rests. It is lent by the navbar wordmark (the
 * origin), serves as the period of whatever is being read, and ends docked in
 * the closing CTA.
 */
function TheItDot({ activeId, ready, version, pulseTick, pointsRef, originRef }: TheItDotProps) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scale = useMotionValue(0);
  const sx = useSpring(x, TRAVEL);
  const sy = useSpring(y, TRAVEL);
  const ss = useSpring(scale, { stiffness: 420, damping: 24 });

  const [phase, setPhase] = useState<'boot' | 'intro' | 'live'>('boot');
  const placedRef = useRef(false);
  const scaleTargetRef = useRef(1);
  const lastKeyRef = useRef('');
  const bootedRef = useRef(false);
  const introTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // The intro timers must only die on unmount — a cleanup tied to the boot
  // effect itself would fire on the setPhase re-render and strand the dot at
  // scale 0 before it ever pops.
  useEffect(
    () => () => {
      introTimers.current.forEach(clearTimeout);
      bootedRef.current = false;
    },
    [],
  );

  // Boot: once rests are measured, either play the lent-dot intro (page top)
  // or join the journey wherever the visitor already is.
  useEffect(() => {
    if (!ready || bootedRef.current) return;
    bootedRef.current = true;
    const origin = originRef.current;
    if (window.scrollY > 80 || !origin) {
      setPhase('live');
      return;
    }
    x.jump(origin.x - IT_BASE / 2);
    y.jump(origin.y - IT_BASE / 2);
    scale.jump(0);
    placedRef.current = true;
    setPhase('intro');
    introTimers.current.push(
      setTimeout(() => {
        scale.set(Math.max(origin.size, 2) / IT_BASE);
      }, INTRO.pop),
    );
    introTimers.current.push(setTimeout(() => setPhase('live'), INTRO.depart));
  }, [ready, x, y, scale, originRef]);

  // Live: spring to the active rest; squash on arrival; stage long re-entries.
  useEffect(() => {
    if (phase !== 'live') return;
    const points = pointsRef.current;
    const point = points.find((p) => p.id === activeId) ?? points[0];
    if (!point) return;

    const key = `${point.id}:${Math.round(point.x)}:${Math.round(point.y)}`;
    const targetX = point.x - IT_BASE / 2;
    const targetY = point.y - IT_BASE / 2;
    scaleTargetRef.current = point.size / IT_BASE;

    if (!placedRef.current) {
      x.jump(targetX);
      y.jump(targetY);
      scale.jump(scaleTargetRef.current);
      placedRef.current = true;
      lastKeyRef.current = key;
      return;
    }

    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;

    if (Math.abs(targetY - y.get()) > STAGED_JUMP_PX) {
      x.jump(targetX);
      y.jump(targetY - 420);
      scale.jump(scaleTargetRef.current * 0.6);
    }

    x.set(targetX);
    y.set(targetY);
    scale.set(scaleTargetRef.current * 1.22);
    const settle = setTimeout(() => scale.set(scaleTargetRef.current), 150);
    return () => clearTimeout(settle);
  }, [phase, activeId, version, x, y, scale, pointsRef]);

  // Acknowledge a hover on the rest the dot occupies (the CTA dock).
  useEffect(() => {
    if (phase !== 'live' || pulseTick.n === 0 || pulseTick.id !== activeId) return;
    scale.set(scaleTargetRef.current * 1.35);
    const settle = setTimeout(() => scale.set(scaleTargetRef.current), 160);
    return () => clearTimeout(settle);
  }, [pulseTick, phase, activeId, scale]);

  return (
    <motion.div
      className="absolute left-0 top-0 h-4 w-4 rounded-full bg-brand-600 shadow-[0_0_0_2px_rgba(255,255,255,0.9)] will-change-transform"
      style={{ x: sx, y: sy, scale: ss }}
    />
  );
}

interface ItRestProps {
  id: string;
  role?: RestRole;
  /** Size the period here (em units track the font): e.g. "h-[0.13em] w-[0.13em]". */
  className?: string;
}

/**
 * A rest point: an inline placeholder that reserves the period's space in the
 * text flow and registers its position for the traveling dot. Outside a
 * provider, or under reduced motion, it renders the period itself — the story
 * survives as static punctuation.
 */
export function ItRest({ id, role = 'rest', className }: ItRestProps) {
  const ctx = useContext(ItContext);
  const ref = useRef<HTMLSpanElement>(null);
  const register = ctx?.register;
  const unregister = ctx?.unregister;

  useEffect(() => {
    const el = ref.current;
    if (!el || !register || !unregister) return;
    register({ id, el, role });
    return () => unregister(id);
  }, [id, role, register, unregister]);

  const isStatic = !ctx || ctx.staticDots;
  return (
    <span
      ref={ref}
      aria-hidden
      className={cn(
        'inline-block rounded-full align-baseline',
        isStatic ? 'bg-brand-600' : 'bg-transparent',
        className,
      )}
    />
  );
}
