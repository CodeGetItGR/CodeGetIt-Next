'use client';

import { useId, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { useLocale } from '@/i18n/UseLocale';

import { EASE } from './it';

export type ArtifactVariant =
    | 'idea'
    | 'brief'
    | 'design'
    | 'build'
    | 'handover'
    | 'tierStatic'
    | 'tierApp'
    | 'tierFull';

interface ArtifactPlateProps {
    variant: ArtifactVariant;
    plate?: string;
    caption: string;
    eyebrow?: string;
    className?: string;
    delay?: number;
    compact?: boolean;
    /**
     * Selective depth (lift + softer-larger shadow, plus a hover lift on lg only).
     * Off by default — concentrate it at the high-impact moments (hero, handover)
     * so the page feels alive without going glossy everywhere. Never gates content.
     */
    depth?: boolean;
    /**
     * On by default — draws the illustration-plate card chrome (border, white
     * fill, soft-shadow). Set false to render the scene as illustration only,
     * with no card framing (e.g. Act II, where the plate should blend into the
     * page rather than read as a boxed card).
     */
    framed?: boolean;
}

/**
 * The brand teal — "It". Teal stays exclusive to the idea/data wherever it shows
 * (a focal action, the agreed scope, a packet of data moving through the stack):
 * it is never decoration. Everything else is ink on paper. (Inside an illustration
 * plate Law 2/4 are relaxed for incidental geometry + depth — see
 * docs/creative-direction-it.md — but teal exclusivity, Law 1, holds.)
 */
const TEAL = '#0d9488';

/* ── Shared scene primitives ──────────────────────────────────────────────── */

function Scene({ children }: { children: React.ReactNode }) {
    return (
        <svg
            viewBox="0 0 320 200"
            className="h-full min-h-[188px] w-full bg-[#fbfbfa] text-slate-800"
            fill="none"
            strokeWidth={1.5}
            aria-hidden
        >
            {children}
        </svg>
    );
}

/** A skeleton placeholder block — the grey content stand-in. */
function Sk({ x, y, w, h, rx = 3, o = 0.07 }: { x: number; y: number; w: number; h: number; rx?: number; o?: number }) {
    return <rect x={x} y={y} width={w} height={h} rx={rx} fill="currentColor" fillOpacity={o} />;
}

/** A browser/app window chrome — frame + title bar + three squared controls. */
function Win({ x, y, w, h, rx = 12 }: { x: number; y: number; w: number; h: number; rx?: number }) {
    return (
        <>
            <rect x={x} y={y} width={w} height={h} rx={rx} stroke="currentColor" strokeOpacity={0.45} vectorEffect="non-scaling-stroke" />
            <line x1={x} y1={y + 16} x2={x + w} y2={y + 16} stroke="currentColor" strokeOpacity={0.16} vectorEffect="non-scaling-stroke" />
            {[0, 1, 2].map((i) => (
                <rect key={i} x={x + 10 + i * 7} y={y + 6} width={4} height={4} fill="currentColor" fillOpacity={0.25} />
            ))}
        </>
    );
}

/* ── Tier scenes — shared by Services + Comparison (the same three tiers) ──── */

/** Static: a fast, clear page that scrolls forever behind skeleton placeholders. */
function TierStatic({ active }: { active: boolean }) {
    const clip = `as-${useId()}`;
    return (
        <Scene>
            <Win x={104} y={24} w={112} h={152} />
            <clipPath id={clip}>
                <rect x={106} y={42} width={108} height={132} />
            </clipPath>
            <g clipPath={`url(#${clip})`}>
                <motion.g
                    initial={{ y: 0 }}
                    animate={active ? { y: [0, -78] } : { y: 0 }}
                    transition={active ? { duration: 5.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' } : { duration: 0 }}
                >
                    <Sk x={114} y={50} w={92} h={36} rx={6} o={0.09} />
                    <Sk x={114} y={94} w={64} h={6} o={0.1} />
                    <Sk x={114} y={104} w={88} h={5} />
                    <Sk x={114} y={114} w={78} h={5} />
                    {/* the one action that matters — the teal dot is the CTA */}
                    <Sk x={114} y={130} w={50} h={14} rx={7} o={0.12} />
                    <circle cx={177} cy={137} r={5} fill={TEAL} />
                    <Sk x={114} y={158} w={92} h={28} rx={6} />
                    <Sk x={114} y={194} w={70} h={5} />
                    <Sk x={114} y={204} w={86} h={5} />
                    <Sk x={114} y={214} w={58} h={5} />
                    <Sk x={114} y={228} w={92} h={24} rx={6} />
                </motion.g>
            </g>
        </Scene>
    );
}

/** Web app: the page + a live dashboard — bars updating, a toggle, a live point. */
function TierApp({ active }: { active: boolean }) {
    const bars = [
        { lo: 18, hi: 34 },
        { lo: 30, hi: 16 },
        { lo: 12, hi: 40 },
        { lo: 24, hi: 20 },
    ];
    const baseY = 146;
    return (
        <Scene>
            <Win x={36} y={40} w={248} h={120} />
            {/* sidebar */}
            <Sk x={48} y={66} w={36} h={82} rx={6} o={0.05} />
            <Sk x={56} y={74} w={20} h={4} />
            <Sk x={56} y={84} w={24} h={4} />
            <Sk x={56} y={94} w={18} h={4} />
            {/* KPI tiles */}
            <Sk x={98} y={64} w={64} h={22} rx={5} o={0.05} />
            <Sk x={172} y={64} w={64} h={22} rx={5} o={0.05} />
            <Sk x={114} y={70} w={36} h={4} />
            {/* a live, pulsing data point */}
            <motion.circle
                cx={108}
                cy={75}
                r={4}
                fill={TEAL}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                animate={active ? { opacity: [1, 0.4, 1], scale: [1, 1.3, 1] } : { opacity: 1, scale: 1 }}
                transition={active ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
            />
            {/* a toggle that flips on its own */}
            <rect x={196} y={69} width={24} height={12} rx={6} stroke="currentColor" strokeOpacity={0.3} vectorEffect="non-scaling-stroke" />
            <motion.rect
                width={8}
                height={8}
                y={71}
                rx={4}
                fill="currentColor"
                fillOpacity={0.4}
                initial={{ x: 199 }}
                animate={active ? { x: [199, 209, 209, 199, 199] } : { x: 199 }}
                transition={active ? { duration: 4, repeat: Infinity, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] } : { duration: 0 }}
            />
            {/* bar chart — figures updating */}
            <line x1={100} y1={baseY} x2={236} y2={baseY} stroke="currentColor" strokeOpacity={0.2} vectorEffect="non-scaling-stroke" />
            {bars.map((b, i) => {
                const x = 108 + i * 32;
                return (
                    <motion.rect
                        key={i}
                        x={x}
                        width={16}
                        rx={2}
                        fill="currentColor"
                        fillOpacity={0.14}
                        initial={{ height: (b.lo + b.hi) / 2, y: baseY - (b.lo + b.hi) / 2 }}
                        animate={active ? { height: [b.lo, b.hi, b.lo], y: [baseY - b.lo, baseY - b.hi, baseY - b.lo] } : { height: (b.lo + b.hi) / 2, y: baseY - (b.lo + b.hi) / 2 }}
                        transition={active ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 } : { duration: 0 }}
                    />
                );
            })}
        </Scene>
    );
}

/** Full-stack: interface → API → database, with teal data flowing through. */
function TierFull({ active }: { active: boolean }) {
    return (
        <Scene>
            {/* frontend */}
            <rect x={108} y={22} width={104} height={40} rx={8} stroke="currentColor" strokeOpacity={0.45} vectorEffect="non-scaling-stroke" />
            <Sk x={118} y={32} w={40} h={5} />
            <Sk x={118} y={42} w={62} h={5} />
            {/* api / logic */}
            <rect x={122} y={86} width={76} height={32} rx={8} stroke="currentColor" strokeOpacity={0.45} vectorEffect="non-scaling-stroke" />
            <Sk x={134} y={98} w={52} h={6} o={0.1} />
            {/* database */}
            <g stroke="currentColor" strokeOpacity={0.45} fill="none" vectorEffect="non-scaling-stroke">
                <ellipse cx={160} cy={146} rx={42} ry={10} />
                <path d="M118 146 v22 a42 10 0 0 0 84 0 v-22" />
                <ellipse cx={160} cy={168} rx={42} ry={10} strokeOpacity={0.2} />
            </g>
            {/* connectors */}
            <line x1={160} y1={62} x2={160} y2={86} stroke="currentColor" strokeOpacity={0.22} vectorEffect="non-scaling-stroke" />
            <line x1={160} y1={118} x2={160} y2={136} stroke="currentColor" strokeOpacity={0.22} vectorEffect="non-scaling-stroke" />
            {/* the data — teal, moving through the whole stack and back */}
            <motion.circle
                r={4}
                cx={160}
                fill={TEAL}
                initial={{ cy: 74 }}
                animate={active ? { cy: [62, 86, 118, 136] } : { cy: 100 }}
                transition={active ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
            />
            <motion.circle
                r={3}
                cx={160}
                fill={TEAL}
                fillOpacity={0.7}
                initial={{ cy: 124 }}
                animate={active ? { cy: [136, 118, 86, 62] } : { cy: 80 }}
                transition={active ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1.1 } : { duration: 0 }}
            />
        </Scene>
    );
}

/* ── Story / process scenes ───────────────────────────────────────────────── */

/** Idea: a thought being captured — a note still being written, the idea sparking. */
function Idea({ active }: { active: boolean }) {
    return (
        <Scene>
            <rect x={88} y={38} width={144} height={120} rx={8} stroke="currentColor" strokeOpacity={0.4} vectorEffect="non-scaling-stroke" />
            {/* a heading and a couple of jotted, hand-written lines */}
            <Sk x={104} y={54} w={46} h={7} rx={3} o={0.12} />
            <path d="M104 78 C 126 72, 154 82, 188 74" stroke="currentColor" strokeOpacity={0.28} fill="none" vectorEffect="non-scaling-stroke" />
            <path d="M104 92 C 120 87, 146 95, 170 90" stroke="currentColor" strokeOpacity={0.26} fill="none" vectorEffect="non-scaling-stroke" />
            {/* the line still being written, with a blinking caret */}
            <line x1={104} y1={106} x2={146} y2={106} stroke="currentColor" strokeOpacity={0.28} vectorEffect="non-scaling-stroke" />
            <motion.line
                x1={151}
                y1={100}
                x2={151}
                y2={112}
                stroke="currentColor"
                strokeOpacity={0.55}
                vectorEffect="non-scaling-stroke"
                initial={{ opacity: 1 }}
                animate={active ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
                transition={active ? { duration: 1.1, repeat: Infinity, ease: 'linear', times: [0, 0.5, 0.5, 1] } : { duration: 0 }}
            />
            {/* the spark — a teal ripple radiating from the idea */}
            <motion.circle
                cx={176}
                cy={132}
                fill={TEAL}
                initial={{ r: 9, opacity: 0 }}
                animate={active ? { r: [9, 24], opacity: [0.32, 0] } : { r: 9, opacity: 0 }}
                transition={active ? { duration: 2.4, repeat: Infinity, ease: 'easeOut' } : { duration: 0 }}
            />
            {/* a hand-drawn ring around the idea */}
            <path
                d="M165 123 C 152 131, 165 148, 183 143 C 197 138, 193 121, 176 121"
                stroke="currentColor"
                strokeOpacity={0.22}
                fill="none"
                vectorEffect="non-scaling-stroke"
            />
            {/* the idea itself */}
            <motion.circle
                cx={176}
                cy={132}
                r={9}
                fill={TEAL}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={{ scale: 1 }}
                animate={active ? { scale: [1, 1.09, 1] } : { scale: 1 }}
                transition={active ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
            />
        </Scene>
    );
}

/** Brief: goals as a checklist + a roadmap, the teal dot on the agreed scope. */
function Brief({ active }: { active: boolean }) {
    return (
        <Scene>
            <rect x={86} y={28} width={148} height={120} rx={8} stroke="currentColor" strokeOpacity={0.4} vectorEffect="non-scaling-stroke" />
            <Sk x={100} y={42} w={60} h={7} rx={3} o={0.12} />
            {[86, 72, 94].map((w, i) => (
                <g key={i}>
                    <rect x={100} y={62 + i * 16} width={9} height={9} rx={2} stroke="currentColor" strokeOpacity={0.3} vectorEffect="non-scaling-stroke" />
                    <Sk x={116} y={64 + i * 16} w={w} h={5} />
                </g>
            ))}
            {/* roadmap */}
            <line x1={100} y1={126} x2={220} y2={126} stroke="currentColor" strokeOpacity={0.25} vectorEffect="non-scaling-stroke" />
            {[100, 140, 180, 220].map((x, i) => (
                <rect key={i} x={x - 3} y={123} width={6} height={6} fill="currentColor" fillOpacity={0.3} />
            ))}
            <motion.circle
                cx={180}
                cy={126}
                r={6}
                fill={TEAL}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                animate={active ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                transition={active ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
            />
        </Scene>
    );
}

/** Design: an artboard — layout grid, a component, swatches; teal selection handle. */
function Design({ active }: { active: boolean }) {
    return (
        <Scene>
            <rect x={70} y={28} width={180} height={144} rx={6} stroke="currentColor" strokeOpacity={0.4} vectorEffect="non-scaling-stroke" />
            {[112, 160, 208].map((x, i) => (
                <line key={i} x1={x} y1={36} x2={x} y2={164} stroke="currentColor" strokeOpacity={0.12} strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
            ))}
            <Sk x={84} y={42} w={152} h={20} rx={4} />
            <rect x={84} y={74} width={92} height={60} rx={6} stroke="currentColor" strokeOpacity={0.3} vectorEffect="non-scaling-stroke" />
            <Sk x={94} y={84} w={48} h={6} />
            <Sk x={94} y={96} w={66} h={4} />
            <Sk x={94} y={104} w={60} h={4} />
            <Sk x={94} y={118} w={36} h={10} rx={5} o={0.12} />
            {[0.18, 0.1, 0.06].map((o, i) => (
                <rect key={i} x={188 + i * 16} y={84} width={11} height={11} rx={2} fill="currentColor" fillOpacity={o} />
            ))}
            {/* selection handle */}
            <motion.circle
                cx={176}
                cy={74}
                r={5}
                fill={TEAL}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                animate={active ? { scale: [1, 1.2, 1], opacity: [1, 0.6, 1] } : { scale: 1, opacity: 1 }}
                transition={active ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
            />
        </Scene>
    );
}

/** Build: sprint bars filling, a QA check, and the teal "current build" marker. */
function Build({ active }: { active: boolean }) {
    const fills = [78, 120, 60, 100];
    return (
        <Scene>
            {fills.map((fillTo, i) => {
                const y = 46 + i * 26;
                return (
                    <g key={i}>
                        <Sk x={70} y={y} w={20} h={8} rx={2} o={0.1} />
                        <rect x={100} y={y} width={150} height={8} rx={4} fill="currentColor" fillOpacity={0.06} />
                        <motion.rect
                            x={100}
                            y={y}
                            height={8}
                            rx={4}
                            fill="currentColor"
                            fillOpacity={0.16}
                            initial={{ width: fillTo }}
                            animate={active ? { width: [0, fillTo, fillTo] } : { width: fillTo }}
                            transition={active ? { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4, times: [0, 0.45, 1] } : { duration: 0 }}
                        />
                    </g>
                );
            })}
            {/* QA pass (ink — teal stays the dot) */}
            <motion.path
                d="M210 152 L218 160 L232 144"
                stroke="currentColor"
                strokeOpacity={0.5}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 1, opacity: 1 }}
                animate={active ? { pathLength: [0, 1, 1], opacity: [0, 1, 1] } : { pathLength: 1, opacity: 1 }}
                transition={active ? { duration: 3, repeat: Infinity, ease: 'easeInOut', times: [0, 0.5, 1] } : { duration: 0 }}
            />
            {/* current build marker travelling the sprint list */}
            <motion.circle
                cx={94}
                r={4}
                fill={TEAL}
                initial={{ cy: 50 }}
                animate={active ? { cy: [50, 76, 102, 128, 50] } : { cy: 50 }}
                transition={active ? { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
            />
        </Scene>
    );
}

/** Handover: the finished product, deployed and live — the idea climbing its metric. */
const DELIVER_PTS: [number, number][] = [
    [88, 126],
    [116, 118],
    [146, 122],
    [178, 106],
    [212, 90],
];

function Handover({ active }: { active: boolean }) {
    const d = `M${DELIVER_PTS.map((p) => p.join(' ')).join(' L')}`;
    const peak = DELIVER_PTS[DELIVER_PTS.length - 1];
    return (
        <Scene>
            {/* the delivered product, in its own window */}
            <Win x={64} y={34} w={192} h={108} />
            <Sk x={80} y={60} w={64} h={8} rx={3} o={0.12} />
            <Sk x={80} y={76} w={96} h={5} />
            <Sk x={80} y={86} w={78} h={5} />
            {/* owned, signed off */}
            <path d="M214 60 L220 66 L232 52" stroke="currentColor" strokeOpacity={0.42} fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            {/* live and climbing — the analytics it now drives */}
            <line x1={80} y1={130} x2={240} y2={130} stroke="currentColor" strokeOpacity={0.18} vectorEffect="non-scaling-stroke" />
            <path d={d} stroke="currentColor" strokeOpacity={0.36} fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            {/* the idea, now live, riding the metric to its peak */}
            <motion.circle
                r={6}
                fill={TEAL}
                initial={{ cx: peak[0], cy: peak[1] }}
                animate={active ? { cx: DELIVER_PTS.map((p) => p[0]), cy: DELIVER_PTS.map((p) => p[1]) } : { cx: peak[0], cy: peak[1] }}
                transition={active ? { duration: 3.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } : { duration: 0 }}
            />
        </Scene>
    );
}

function ArtifactVisual({ variant, active }: { variant: ArtifactVariant; active: boolean }) {
    switch (variant) {
        case 'idea':
            return <Idea active={active} />;
        case 'brief':
            return <Brief active={active} />;
        case 'design':
            return <Design active={active} />;
        case 'build':
            return <Build active={active} />;
        case 'tierStatic':
            return <TierStatic active={active} />;
        case 'tierApp':
            return <TierApp active={active} />;
        case 'tierFull':
            return <TierFull active={active} />;
        default:
            return <Handover active={active} />;
    }
}

export function ArtifactPlate({
    variant,
    // plate,
    caption,
    eyebrow,
    className,
    delay = 0,
    compact = false,
    depth = false,
    framed = true,
}: ArtifactPlateProps) {
    const { t } = useLocale();
    const reduced = useReducedMotion();
    const ref = useRef<HTMLElement>(null);
    // Idle loops run only while the plate is on screen (and motion is allowed) —
    // keeps a page full of animated plates cheap, and is mobile/battery-friendly.
    const inView = useInView(ref, { amount: 0.35 });
    const active = !reduced && inView;
    const meta = t.landing.artifacts.variants[variant];

    return (
        <motion.figure
            ref={ref}
            initial={reduced ? false : { opacity: 0, y: 18, rotate: -0.4 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: reduced ? 0 : 0.6, ease: EASE, delay }}
            className={cn(
                'group relative overflow-hidden rounded-[1.15rem]',
                framed && [
                    'border border-slate-900/10 bg-white p-1.5',
                    // Depth is a desktop-friendly lift; on touch it's just a richer
                    // resting shadow (no hover gating — the scene reads without it).
                    depth
                        ? 'soft-shadow-lg lg:transition-transform lg:duration-500 lg:ease-out lg:hover:-translate-y-1.5'
                        : 'soft-shadow',
                ],
                className,
            )}
        >
            <div className={cn('overflow-hidden rounded-[1.15rem]', framed && 'rounded-[calc(1.15rem-6px)] border border-slate-900/4')}>
                <ArtifactVisual variant={variant} active={active} />
            </div>

            <figcaption className={cn('grid gap-3 pt-3', framed ? 'px-4 pb-4' : 'px-1 pb-0', compact ? 'grid-cols-1' : 'sm:grid-cols-[auto_1fr]')}>
                {/*<div className="font-display text-xs font-bold uppercase tracking-[0.18em] text-slate-900">{plate}</div>*/}
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {eyebrow ?? meta.eyebrow}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">{caption}</p>
                    {/*<p className="mt-1 text-xs leading-5 text-slate-500">{meta.note}</p>*/}
                </div>
            </figcaption>
        </motion.figure>
    );
}
