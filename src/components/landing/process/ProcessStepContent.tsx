import type { Translations } from '@/i18n/types';
import { cn } from '@/lib/utils';
import { ProjectTypeBadge } from './ProjectTypeBadge';

interface ProcessStepContentProps {
    step: Translations['landing']['process']['steps'][number];
    isActive: boolean;
    deliverablesLabel: string;
    outcomeLabel: string;
    badges: Translations['landing']['process']['badges'];
}

export function ProcessStepContent({ step, isActive, deliverablesLabel, outcomeLabel, badges }: ProcessStepContentProps) {
    return (
        <div
            className={cn(
                'rounded-[1.25rem] p-[6px] ring-1 ring-slate-900/[0.06] soft-shadow transition-all duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]',
                isActive ? 'translate-y-0 opacity-100' : 'translate-y-1.5 opacity-40',
            )}
        >
            <div className="rounded-[calc(1.25rem-6px)] bg-white p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] sm:p-8">
                <h3 className="font-display text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-7 text-slate-500">{step.description}</p>

                <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {deliverablesLabel}
                </h4>
                <ul className="mt-3 space-y-2.5">
                    {step.deliverables.map((deliverable) => (
                        <li key={deliverable.label} className="flex items-center gap-2.5 text-sm text-slate-600">
                            {/* square ink tick — a filled circle would counterfeit It */}
                            <span className="h-[5px] w-[5px] shrink-0 bg-slate-300" />
                            <span>{deliverable.label}</span>
                            {deliverable.badge && (
                                <ProjectTypeBadge
                                    label={badges[deliverable.badge].label}
                                    description={badges[deliverable.badge].description}
                                    className="ml-auto"
                                />
                            )}
                        </li>
                    ))}
                </ul>

                <p className="mt-6 border-t border-slate-900/[0.06] pt-4 text-sm text-slate-900">
                    <span className="font-semibold text-slate-400">{outcomeLabel}: </span>
                    {step.outcome}
                </p>
            </div>
        </div>
    );
}
