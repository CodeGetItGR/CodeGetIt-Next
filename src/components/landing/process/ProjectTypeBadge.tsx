import { cn } from '@/lib/utils';

interface ProjectTypeBadgeProps {
    label: string;
    description: string;
    className?: string;
    variant?: 'allProjects' | 'webAppPlus' | 'fullStack';
}

// allProjects stays neutral (it applies everywhere); webAppPlus and fullStack
// pick up the same amber/teal pairing used for tiers elsewhere on the page,
// so "how big a project this applies to" reads at a glance, not just on hover.
const VARIANT_STYLES: Record<string, string> = {
    allProjects: 'text-slate-500 ring-slate-900/10',
    webAppPlus: 'text-amber-700 ring-amber-200 bg-amber-50/60',
    fullStack: 'text-brand-700 ring-brand-600/20 bg-brand-600/8',
};

export function ProjectTypeBadge({ label, description, className, variant }: ProjectTypeBadgeProps) {
    return (
        <span
            title={description}
            className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] ring-1',
                variant ? VARIANT_STYLES[variant] : 'text-slate-500 ring-slate-900/10',
                className,
            )}
        >
            {label}
        </span>
    );
}
