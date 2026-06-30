'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { Translations } from '@/i18n/types';
import { ArtifactPlate, type ArtifactVariant } from '@/components/landing/ArtifactPlate';
import { ProjectTypeBadge } from './ProjectTypeBadge';
import { stepIcons } from './stepIcons';

const EASE = [0.32, 0.72, 0, 1] as const;
const PROCESS_ARTIFACTS: ArtifactVariant[] = ['brief', 'wireframe', 'uiFlow', 'handover'];

interface ProcessStepContentProps {
    step: Translations['landing']['process']['steps'][number];
    index: number;
    deliverablesLabel: string;
    outcomeLabel: string;
    badges: Translations['landing']['process']['badges'];
}

export function ProcessStepContent({ step, index, deliverablesLabel, outcomeLabel, badges }: ProcessStepContentProps) {
    const ref = useRef(null);
    const inView = useInView(ref, { amount: 0.15 });
    const reduced = useReducedMotion();
    const active = reduced ? true : inView;
    const StepIcon = stepIcons[index] ?? stepIcons[0];

    const fadeUp = (delay: number) => ({
        initial: reduced ? false : { opacity: 0, y: 14 },
        animate: { opacity: active ? 1 : 0, y: active ? 0 : 14 },
        transition: { duration: reduced ? 0 : 0.45, ease: EASE, delay: reduced ? 0 : delay },
    });

    return (
        <div ref={ref} className="relative grid gap-8 lg:grid-cols-[minmax(0,460px)_minmax(220px,280px)] lg:items-start">
            <StepIcon
                size={130}
                aria-hidden="true"
                className="pointer-events-none absolute -top-3 left-80 -z-10 text-slate-900/[0.04]"
            />

            <div>
                <motion.h3 {...fadeUp(0)} className="font-display text-2xl font-semibold text-slate-900">
                    {step.title}
                </motion.h3>
                <motion.p {...fadeUp(0.07)} className="mt-3 text-sm leading-7 text-slate-500">
                    {step.description}
                </motion.p>

                <motion.h4 {...fadeUp(0.14)} className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {deliverablesLabel}
                </motion.h4>
                <ul className="mt-3.5 space-y-2.5">
                    {step.deliverables.map((deliverable, i) => (
                        <motion.li key={deliverable.label} {...fadeUp(0.19 + i * 0.05)} className="flex items-center gap-2.5 text-sm text-slate-600">
                            <span className="h-[5px] w-[5px] shrink-0 bg-slate-300" />
                            <span>{deliverable.label}</span>
                            {deliverable.badge && (
                                <ProjectTypeBadge
                                    variant={deliverable.badge}
                                    label={badges[deliverable.badge].label}
                                    description={badges[deliverable.badge].description}
                                    className="ml-auto"
                                />
                            )}
                        </motion.li>
                    ))}
                </ul>

                <div className="relative mt-6 mb-3.5 h-2">
                    <motion.span
                        className="absolute top-1/2 left-0 h-px w-full origin-left -translate-y-1/2 bg-slate-900/[0.14]"
                        initial={reduced ? false : { scaleX: 0 }}
                        animate={{ scaleX: active ? 1 : 0 }}
                        transition={{ duration: reduced ? 0 : 0.8, ease: EASE, delay: reduced ? 0 : 0.47 }}
                    />
                    <motion.span
                        className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500"
                        initial={reduced ? false : { left: '0%', opacity: 0, scale: 0.4, boxShadow: '0 0 0 0 rgba(245,158,11,0)' }}
                        animate={active
                            ? { left: '100%', opacity: 1, scale: 1, boxShadow: '0 0 0 4px rgba(245,158,11,0.18)' }
                            : { left: '0%', opacity: 0, scale: 0.4, boxShadow: '0 0 0 0 rgba(245,158,11,0)' }}
                        transition={reduced ? { duration: 0 } : {
                            left: { duration: 0.8, ease: EASE, delay: 0.47 },
                            opacity: { duration: 0.25, delay: 0.47 },
                            scale: { duration: 0.25, delay: 0.47 },
                            boxShadow: { duration: 0.4, delay: 1.27 },
                        }}
                    />
                </div>
                <motion.p
                    initial={reduced ? false : { opacity: 0, y: 14, color: '#94a3b8' }}
                    animate={{ opacity: active ? 1 : 0, y: active ? 0 : 14, color: active ? '#0f172a' : '#94a3b8' }}
                    transition={reduced ? { duration: 0 } : {
                        opacity: { duration: 0.45, ease: EASE, delay: 0.47 },
                        y: { duration: 0.45, ease: EASE, delay: 0.47 },
                        color: { duration: 0.4, delay: 1.27 },
                    }}
                    className="text-sm leading-7"
                >
                    <span className="font-semibold text-slate-500">{outcomeLabel}: </span>
                    {step.outcome}
                </motion.p>
            </div>

            <ArtifactPlate
                variant={PROCESS_ARTIFACTS[index] ?? 'brief'}
                plate={`Step ${String(index + 1).padStart(2, '0')}`}
                eyebrow="process artifact"
                caption={step.title}
                compact
                delay={0.12}
                className="lg:mt-1"
            />
        </div>
    );
}
