'use client'

import { motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BuildIcon, DesignIcon, DiscoverIcon, LaunchIcon } from './icons';

const stepIcons = [DiscoverIcon, DesignIcon, BuildIcon, LaunchIcon];

interface ProcessTimelineProps {
    steps: { title: string }[];
    activeIndex: number;
    fillProgress: MotionValue<number>;
    onStepClick: (index: number) => void;
}

export function ProcessTimeline({ steps, activeIndex, fillProgress, onStepClick }: ProcessTimelineProps) {
    const reduced = useReducedMotion();
    const markerTop = useTransform(fillProgress, (v) => `calc(1.25rem + ${v} * (100% - 2.5rem))`);

    return (
        <div className="relative">
            {/* Track line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-900/10" aria-hidden="true" />
            {/* Fill line — continuous, spring-smoothed scaleY from the orchestrator */}
            <motion.div
                className="absolute left-5 top-5 bottom-5 w-0.5 origin-top bg-slate-900"
                style={{ scaleY: fillProgress }}
                aria-hidden="true"
            />
            {/* "Now" marker — a small filled square, not a circle (Law 2: the only circle is It) */}
            <motion.div
                className="absolute left-5 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 bg-slate-900"
                style={{ top: markerTop }}
                aria-hidden="true"
            />

            <div className="flex flex-col gap-2">
                {steps.map((step, index) => {
                    const Icon = stepIcons[index] ?? stepIcons[0];
                    const isActive = index === activeIndex;

                    return (
                        <button
                            key={step.title}
                            type="button"
                            onClick={() => onStepClick(index)}
                            className="group relative z-10 flex items-center gap-4 rounded-xl p-2 text-left transition-colors duration-200 hover:bg-slate-900/[0.03]"
                        >
                            <motion.span
                                animate={{ scale: isActive && !reduced ? [1, 1.06, 1] : 1 }}
                                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                                className={cn(
                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                                    isActive ? 'bg-slate-900 text-white' : 'bg-slate-900/[0.05] text-slate-400',
                                )}
                            >
                                <Icon />
                            </motion.span>

                            <span
                                className={cn(
                                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                                    isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500',
                                )}
                            >
                                {index + 1}
                            </span>

                            <span
                                className={cn(
                                    'text-sm transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                                    isActive ? 'font-semibold text-slate-900' : 'text-slate-400',
                                )}
                            >
                                {step.title}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
