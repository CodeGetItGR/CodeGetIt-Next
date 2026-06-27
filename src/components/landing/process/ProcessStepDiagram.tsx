'use client';

import { cn } from '@/lib/utils';
import { stepIcons } from './stepIcons';

interface ProcessStepDiagramProps {
    labels: string[];
    className?: string;
}

// Mobile-only overview: desktop gets the sticky ProcessTimeline (left column)
// with a live fill-progress line; mobile hides that column entirely and only
// gets a floating step pill once scrolling is already underway, so there's
// no visual overview before that. This reuses the same "connected nodes,
// growing/saturating left to right" language as ComparisonGrowthDiagram, with
// the existing per-step icons instead of generic blocks.
export function ProcessStepDiagram({ labels, className }: ProcessStepDiagramProps) {
    return (
        <div className={cn('relative mx-auto max-w-md lg:hidden', className)} aria-hidden="true">
            <div
                className="absolute left-[6%] right-[6%] top-5 h-px"
                style={{ background: 'linear-gradient(90deg, var(--color-brand-200) 0%, var(--color-brand-600) 100%)' }}
            />
            <div className="relative flex items-start justify-between">
                {labels.map((label, i) => {
                    const StepIcon = stepIcons[i] ?? stepIcons[0];
                    return (
                        <div key={label} className="flex flex-1 flex-col items-center gap-2">
                            <span
                                className={cn(
                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                                    'bg-brand-600/10 text-brand-600',
                                )}
                            >
                                <StepIcon size={18} />
                            </span>
                            <span className="max-w-[6.5rem] text-center text-[10px] font-medium leading-tight text-slate-500">
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
