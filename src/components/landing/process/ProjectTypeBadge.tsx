import { cn } from '@/lib/utils';

interface ProjectTypeBadgeProps {
    label: string;
    description: string;
    className?: string;
    variant?: 'allProjects' | 'webAppPlus' | 'fullStack';
}

// allProjects stays neutral (it applies everywhere); larger scopes use muted
// non-teal accents so the moving dot remains the page's primary teal object.
const VARIANT_STYLES: Record<string, string> = {
    allProjects: 'text-slate-500 ring-slate-900/10',
    webAppPlus: 'text-amber-700 ring-amber-200 bg-amber-50/60',
    fullStack: 'text-emerald-700 ring-emerald-200 bg-emerald-50/70',
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
