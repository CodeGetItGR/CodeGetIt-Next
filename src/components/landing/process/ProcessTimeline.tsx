'use client'

import { motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
import { stepIcons } from './icons';

interface ProcessTimelineProps {
    steps: { title: string }[];
    activeIndex: number;
    fillProgress: MotionValue<number>;
    onStepClick: (index: number) => void;
}

export function ProcessTimeline({ steps, activeIndex, fillProgress, onStepClick }: ProcessTimelineProps) {
    const reduced = useReducedMotion();
    // Icon-center offset = button padding (14px) + half of the 56px icon chip (28px) = 42px, both axes.
    const markerTop = useTransform(fillProgress, (v) => `calc(42px + ${v} * (100% - 84px))`);

    return (
        <div className="relative">
            {/* Track line — centered through the 56px icon chips */}
            <div className="absolute left-[42px] top-[42px] bottom-[42px] w-px bg-slate-900/10" aria-hidden="true" />
            {/* Fill line — continuous, spring-smoothed scaleY from the orchestrator */}
            <motion.div
                className="absolute left-[42px] top-[42px] bottom-[42px] w-px origin-top bg-brand-600"
                style={{ scaleY: fillProgress }}
                aria-hidden="true"
            />
            {/* "Now" marker — a small filled square with a soft halo, not a circle (Law 2: the only circle is It) */}
            <motion.div
                className="absolute left-[42px] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 bg-brand-600 shadow-[0_0_0_5px_rgba(13,148,136,0.15)]"
                style={{ top: markerTop }}
                aria-hidden="true"
            />

            <div className="flex flex-col gap-4">
                {steps.map((step, index) => {
                    const Icon = stepIcons[index] ?? stepIcons[0];
                    const isActive = index === activeIndex;

                    return (
                        <motion.button
                            key={step.title}
                            type="button"
                            onClick={() => onStepClick(index)}
                            whileTap={{ scale: 0.98 }}
                            className="group relative z-10 flex items-center gap-4 rounded-xl p-3.5 text-left transition-colors duration-200 hover:bg-slate-900/[0.03]"
                        >
                            {/* Opaque chip hides the line behind it, so the line reads as a string of nodes rather than piercing through */}
                            <motion.span
                                animate={{ scale: isActive && !reduced ? [1, 1.08, 1] : 1 }}
                                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                                className={cn(
                                    'flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                                    isActive ? 'bg-brand-600 text-white' : 'bg-white text-slate-400 ring-1 ring-slate-900/[0.06]',
                                )}
                            >
                                <Icon size={26} />
                            </motion.span>

                            <span
                                className={cn(
                                    'flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] text-xs font-bold transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                                    isActive ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400',
                                )}
                            >
                                {index + 1}
                            </span>

                            <span
                                className={cn(
                                    'text-[15px] transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                                    isActive ? 'font-semibold text-slate-900' : 'text-slate-400',
                                )}
                            >
                                {step.title}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
