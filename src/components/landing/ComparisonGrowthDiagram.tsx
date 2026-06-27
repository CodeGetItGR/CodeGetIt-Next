'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ComparisonGrowthDiagramProps {
    labels: [string, string, string];
}

const EASE = [0.32, 0.72, 0, 1] as const;

/* ── Sketch → solid ────────────────────────────────────────────────────────
 * Three stages visualizing "an idea becoming a real thing" — a dashed
 * wireframe sketch, lifted off the page → a partially-built block with one
 * extruded face → a fully solid 3D block — echoing the hero's "An idea. A
 * problem. A napkin sketch. ... it starts as yours, and it stays yours."
 * without touching the Hero section itself. This is the one place on the
 * page that carries real depth: the interior "shop" sections are where the
 * dot is absent, so Law 4 (no depth) is relaxed here the same way Law 1
 * (teal reserved for the dot) was already relaxed for these sections.
 * Still rectilinear — the only circle on the page is It.
 */
const STAGE = [
    { size: 30, depth: 0, faces: 0, fill: 'bg-transparent', edge: 'border-2 border-dashed border-brand-300', tiltX: -26, tiltY: 20 },
    { size: 42, depth: 12, faces: 1, fill: 'bg-brand-400', edge: 'border border-brand-400/60', tiltX: -22, tiltY: 24 },
    { size: 56, depth: 20, faces: 2, fill: 'bg-brand-600', edge: 'border border-brand-700/60', tiltX: -18, tiltY: 28 },
] satisfies { size: number; depth: number; faces: 0 | 1 | 2; fill: string; edge: string; tiltX: number; tiltY: number }[];

function IsoBlock({ stage }: { stage: (typeof STAGE)[number] }) {
    const { size, depth, faces, fill, edge, tiltX, tiltY } = stage;

    return (
        <div style={{ width: size, height: size, perspective: 500 }} className="relative">
            <div
                className="absolute inset-0"
                style={{ transformStyle: 'preserve-3d', transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }}
            >
                {/* Front face — the sketch itself; gains fill as it builds */}
                <div
                    className={cn('absolute left-1/2 top-1/2', edge, fill)}
                    style={{
                        width: size,
                        height: size,
                        transform: faces > 0
                            ? `translateZ(${depth / 2}px) translate(-50%, -50%)`
                            : 'translate(-50%, -50%)',
                    }}
                />
                {/* Top face — appears once the idea starts taking shape */}
                {faces >= 1 && (
                    <div
                        className={cn('absolute left-1/2 top-1/2', edge, fill)}
                        style={{
                            width: size,
                            height: depth,
                            filter: 'brightness(1.18)',
                            transform: `rotateX(90deg) translateZ(${size / 2}px) translate(-50%, -50%)`,
                        }}
                    />
                )}
                {/* Side face — only the final, fully-built stage gets it */}
                {faces >= 2 && (
                    <div
                        className={cn('absolute left-1/2 top-1/2', edge, fill)}
                        style={{
                            width: depth,
                            height: size,
                            filter: 'brightness(0.75)',
                            transform: `rotateY(90deg) translateZ(${size / 2}px) translate(-50%, -50%)`,
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export function ComparisonGrowthDiagram({ labels }: ComparisonGrowthDiagramProps) {
    const reduced = useReducedMotion();

    return (
        <div className="relative mx-auto mb-14 max-w-xl" aria-hidden="true">
            <div
                className="absolute left-[10%] right-[10%] top-9 h-px"
                style={{ background: 'linear-gradient(90deg, var(--color-brand-200) 0%, var(--color-brand-400) 50%, var(--color-brand-600) 100%)' }}
            />
            <div className="relative flex items-end justify-between">
                {labels.map((label, i) => (
                    <motion.div
                        key={label}
                        className="flex flex-1 flex-col items-center gap-3"
                        initial={reduced ? false : { opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                        transition={{ duration: 0.5, ease: EASE, delay: i * 0.12 }}
                    >
                        <IsoBlock stage={STAGE[i]} />
                        <span
                            className={cn(
                                'text-center text-[11px] font-medium',
                                i === labels.length - 1 ? 'font-semibold text-slate-900' : 'text-slate-500',
                            )}
                        >
                            {label}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
