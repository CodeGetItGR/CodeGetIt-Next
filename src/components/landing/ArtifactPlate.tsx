'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { EASE, TRAVEL } from './it';

export type ArtifactVariant = 'brief' | 'wireframe' | 'systemMap' | 'uiFlow' | 'handover';

interface ArtifactPlateProps {
    variant: ArtifactVariant;
    plate: string;
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
}

/**
 * The brand teal — "It". This is the only teal in every plate; the dot is the
 * protagonist of each scene, shown at a different stage of becoming. (Inside an
 * illustration plate Law 2 is relaxed for incidental ink geometry, but teal
 * stays exclusive to the dot — see docs/creative-direction-it.md.)
 */
const TEAL = '#0d9488';
const VIEWPORT = { once: true, margin: '0px 0px -10% 0px' } as const;

const variantMeta: Record<ArtifactVariant, { eyebrow: string; title: string; note: string }> = {
    brief: {
        eyebrow: 'the idea',
        title: 'It arrives',
        note: 'a rough thought, exactly as it comes',
    },
    wireframe: {
        eyebrow: 'first shape',
        title: 'It gets a shape',
        note: 'structure forms around the idea',
    },
    uiFlow: {
        eyebrow: 'in motion',
        title: 'It finds its path',
        note: 'the idea, set in motion',
    },
    systemMap: {
        eyebrow: 'how it works',
        title: 'It connects',
        note: 'the few parts that matter, joined',
    },
    handover: {
        eyebrow: 'delivery',
        title: "It's yours",
        note: 'docked, live, owned',
    },
};

/* ── Shared scene primitives ──────────────────────────────────────────────── */

function Scene({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <svg
            viewBox="0 0 320 200"
            className={cn('h-full min-h-[188px] w-full bg-[#fbfbfa] text-slate-800', className)}
            fill="none"
            aria-hidden
        >
            {children}
        </svg>
    );
}

/** Shared draw-in transition for any ink hairline (line/path/rect via pathLength). */
function drawProps(active: boolean, delay: number, duration: number, opacity: number) {
    return {
        stroke: 'currentColor',
        strokeOpacity: opacity,
        vectorEffect: 'non-scaling-stroke' as const,
        initial: active ? ({ pathLength: 0, opacity: 0 } as const) : (false as const),
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: VIEWPORT,
        transition: { duration: active ? duration : 0, ease: EASE, delay },
    };
}

function DrawLine({
    x1,
    y1,
    x2,
    y2,
    active,
    delay = 0,
    duration = 0.4,
    opacity = 0.5,
}: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    active: boolean;
    delay?: number;
    duration?: number;
    opacity?: number;
}) {
    return <motion.line x1={x1} y1={y1} x2={x2} y2={y2} {...drawProps(active, delay, duration, opacity)} />;
}

function DrawPath({
    d,
    active,
    delay = 0,
    duration = 0.7,
    opacity = 0.5,
}: {
    d: string;
    active: boolean;
    delay?: number;
    duration?: number;
    opacity?: number;
}) {
    return <motion.path d={d} {...drawProps(active, delay, duration, opacity)} />;
}

function DrawRect({
    x,
    y,
    width,
    height,
    rx,
    active,
    delay = 0,
    duration = 0.8,
    opacity = 0.4,
}: {
    x: number;
    y: number;
    width: number;
    height: number;
    rx?: number;
    active: boolean;
    delay?: number;
    duration?: number;
    opacity?: number;
}) {
    return <motion.rect x={x} y={y} width={width} height={height} rx={rx} {...drawProps(active, delay, duration, opacity)} />;
}

/** The dot pops and settles in place (anticipate → travel → settle). */
function Dot({ cx, cy, r = 7, active, delay = 0 }: { cx: number; cy: number; r?: number; active: boolean; delay?: number }) {
    if (!active) return <circle cx={cx} cy={cy} r={r} fill={TEAL} />;
    return (
        <motion.circle
            cx={cx}
            cy={cy}
            r={r}
            fill={TEAL}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ type: 'spring', ...TRAVEL, delay }}
        />
    );
}

/* ── 1 · It arrives — the raw idea, caught in a scribble ──────────────────── */

function BriefArtifact({ animated, delay }: { animated: boolean; delay: number }) {
    return (
        <Scene>
            {/* you bring it: an inbound arrow toward the tangle */}
            <DrawLine x1={36} y1={166} x2={92} y2={132} active={animated} delay={delay} opacity={0.35} duration={0.45} />
            <DrawPath d="M84 124 L92 132 L82 136" active={animated} delay={delay + 0.1} opacity={0.35} duration={0.3} />
            {/* the messy thought */}
            <DrawPath
                d="M70 118 C 54 90, 100 70, 130 86 C 158 101, 124 138, 108 118 C 95 102, 138 90, 162 104 C 188 119, 172 150, 152 138"
                active={animated}
                delay={delay + 0.18}
                duration={0.9}
                opacity={0.6}
            />
            <DrawPath d="M176 78 C 196 70, 214 88, 206 104" active={animated} delay={delay + 0.5} duration={0.4} opacity={0.3} />
            {/* the idea itself, caught at the tangle's heart */}
            <Dot cx={132} cy={104} active={animated} delay={animated ? delay + 0.7 : 0} />
        </Scene>
    );
}

/* ── 2 · It gets a shape — structure forms around the idea ────────────────── */

function WireframeArtifact({ animated, delay }: { animated: boolean; delay: number }) {
    return (
        <Scene>
            {/* the frame assembles around the centered idea */}
            <DrawRect x={72} y={42} width={176} height={116} active={animated} delay={delay} duration={0.9} opacity={0.4} />
            {/* guides crossing through the dot — it's the anchor, not caged */}
            <DrawLine x1={72} y1={100} x2={140} y2={100} active={animated} delay={delay + 0.3} opacity={0.22} />
            <DrawLine x1={180} y1={100} x2={248} y2={100} active={animated} delay={delay + 0.34} opacity={0.22} />
            <DrawLine x1={160} y1={42} x2={160} y2={82} active={animated} delay={delay + 0.38} opacity={0.22} />
            <DrawLine x1={160} y1={118} x2={160} y2={158} active={animated} delay={delay + 0.42} opacity={0.22} />
            {/* corner ticks — the hand-set registration marks */}
            <DrawPath d="M88 56 L88 44 L100 44" active={animated} delay={delay + 0.5} opacity={0.3} duration={0.3} />
            <DrawPath d="M232 144 L232 156 L220 156" active={animated} delay={delay + 0.56} opacity={0.3} duration={0.3} />
            <Dot cx={160} cy={100} active={animated} delay={animated ? delay + 0.62 : 0} />
        </Scene>
    );
}

/* ── 3 · It finds its path — the idea, set in motion ──────────────────────── */

const FLOW_PTS = [
    { x: 54, y: 150 },
    { x: 116, y: 84 },
    { x: 190, y: 128 },
    { x: 262, y: 70 },
];

function UiFlowArtifact({ animated, delay }: { animated: boolean; delay: number }) {
    const d = `M${FLOW_PTS.map((p) => `${p.x} ${p.y}`).join(' L')}`;
    const rest = FLOW_PTS[animated ? FLOW_PTS.length - 1 : 0];

    return (
        <Scene>
            <DrawPath d={d} active={animated} delay={delay} duration={1} opacity={0.35} />
            {/* waypoints the idea passes through */}
            {FLOW_PTS.map((p, i) => (
                <motion.rect
                    key={i}
                    x={p.x - 4}
                    y={p.y - 4}
                    width={8}
                    height={8}
                    stroke="currentColor"
                    strokeOpacity={0.4}
                    vectorEffect="non-scaling-stroke"
                    initial={animated ? { opacity: 0, scale: 0.6 } : false}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={VIEWPORT}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    transition={{ duration: animated ? 0.3 : 0, ease: EASE, delay: delay + 0.2 + i * 0.18 }}
                />
            ))}
            {/* the idea travels the route and settles at the end */}
            {animated ? (
                <motion.circle
                    r={7}
                    fill={TEAL}
                    initial={{ cx: FLOW_PTS[0].x, cy: FLOW_PTS[0].y, opacity: 0 }}
                    whileInView={{
                        cx: FLOW_PTS.map((p) => p.x),
                        cy: FLOW_PTS.map((p) => p.y),
                        opacity: 1,
                    }}
                    viewport={VIEWPORT}
                    transition={{
                        cx: { duration: 1.5, ease: EASE, delay: delay + 0.4 },
                        cy: { duration: 1.5, ease: EASE, delay: delay + 0.4 },
                        opacity: { duration: 0.2, delay: delay + 0.4 },
                    }}
                />
            ) : (
                <circle cx={rest.x} cy={rest.y} r={7} fill={TEAL} />
            )}
        </Scene>
    );
}

/* ── 4 · It connects — the few parts that matter, joined ──────────────────── */

const NODES = [
    { x: 34, label: 'Page' },
    { x: 125, label: 'Data' },
    { x: 216, label: 'You' },
];
const NODE_W = 70;
const NODE_Y = 72;
const NODE_H = 56;

function SystemMapArtifact({ animated, delay }: { animated: boolean; delay: number }) {
    return (
        <Scene>
            {/* the connecting spine */}
            <DrawLine x1={104} y1={100} x2={125} y2={100} active={animated} delay={delay + 0.3} opacity={0.3} duration={0.3} />
            <DrawLine x1={195} y1={100} x2={216} y2={100} active={animated} delay={delay + 0.36} opacity={0.3} duration={0.3} />
            {NODES.map((node, i) => (
                <motion.g
                    key={node.label}
                    initial={animated ? { opacity: 0, y: 8 } : false}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT}
                    transition={{ duration: animated ? 0.45 : 0, ease: EASE, delay: delay + i * 0.1 }}
                >
                    <rect
                        x={node.x}
                        y={NODE_Y}
                        width={NODE_W}
                        height={NODE_H}
                        stroke="currentColor"
                        strokeOpacity={0.28}
                        vectorEffect="non-scaling-stroke"
                    />
                    <text
                        x={node.x + NODE_W / 2}
                        y={104}
                        textAnchor="middle"
                        className="fill-slate-500 text-[11px] font-semibold uppercase tracking-[0.12em]"
                    >
                        {node.label}
                    </text>
                </motion.g>
            ))}
            {/* the idea, riding the connection between build and owner */}
            <Dot cx={205} cy={100} r={6} active={animated} delay={animated ? delay + 0.5 : 0} />
        </Scene>
    );
}

/* ── 5 · It's yours — the idea docks into a finished, owned mark ──────────── */

function HandoverArtifact({ animated, delay }: { animated: boolean; delay: number }) {
    return (
        <Scene>
            {/* the owned mark — a squared ink pill, echo of Act III's [ • Get it ] */}
            <DrawRect x={84} y={76} width={152} height={48} rx={10} active={animated} delay={delay} duration={0.8} opacity={0.4} />
            {/* a typeset label beside the docked idea */}
            <DrawLine x1={130} y1={94} x2={198} y2={94} active={animated} delay={delay + 0.5} opacity={0.32} />
            <DrawLine x1={130} y1={106} x2={176} y2={106} active={animated} delay={delay + 0.56} opacity={0.2} />
            {/* delivered, checked */}
            <DrawPath d="M204 100 L210 106 L220 94" active={animated} delay={delay + 0.64} opacity={0.45} duration={0.3} />
            {/* the idea, docked and at rest */}
            <Dot cx={110} cy={100} active={animated} delay={animated ? delay + 0.7 : 0} />
        </Scene>
    );
}

function ArtifactVisual({ variant, animated, delay }: { variant: ArtifactVariant; animated: boolean; delay: number }) {
    if (variant === 'brief') return <BriefArtifact animated={animated} delay={delay} />;
    if (variant === 'wireframe') return <WireframeArtifact animated={animated} delay={delay} />;
    if (variant === 'systemMap') return <SystemMapArtifact animated={animated} delay={delay} />;
    if (variant === 'uiFlow') return <UiFlowArtifact animated={animated} delay={delay} />;
    return <HandoverArtifact animated={animated} delay={delay} />;
}

export function ArtifactPlate({
    variant,
    plate,
    caption,
    eyebrow,
    className,
    delay = 0,
    compact = false,
    depth = false,
}: ArtifactPlateProps) {
    const reduced = useReducedMotion();
    const animated = !reduced;
    const meta = variantMeta[variant];

    return (
        <motion.figure
            initial={animated ? { opacity: 0, y: 18, rotate: -0.4 } : false}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: animated ? 0.6 : 0, ease: EASE, delay }}
            className={cn(
                'group relative overflow-hidden rounded-[1.15rem] border border-slate-900/10 bg-white p-1.5',
                // Depth is a desktop-friendly lift; on touch it's just a richer
                // resting shadow (no hover gating — the scene reads without it).
                depth
                    ? 'soft-shadow-lg lg:transition-transform lg:duration-500 lg:ease-out lg:hover:-translate-y-1.5'
                    : 'soft-shadow',
                className,
            )}
        >
            <div className="overflow-hidden rounded-[calc(1.15rem-6px)] border border-slate-900/[0.04]">
                <ArtifactVisual variant={variant} animated={animated} delay={delay + 0.1} />
            </div>

            <figcaption className={cn('grid gap-3 px-4 pb-4 pt-3', compact ? 'grid-cols-1' : 'sm:grid-cols-[auto_1fr]')}>
                <div className="font-display text-xs font-bold uppercase tracking-[0.18em] text-slate-900">{plate}</div>
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {eyebrow ?? meta.eyebrow}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">{caption || meta.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{meta.note}</p>
                </div>
            </figcaption>
        </motion.figure>
    );
}
