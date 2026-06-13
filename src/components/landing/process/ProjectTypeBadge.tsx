import { cn } from '@/lib/utils';

interface ProjectTypeBadgeProps {
    label: string;
    description: string;
    className?: string;
}

export function ProjectTypeBadge({ label, description, className }: ProjectTypeBadgeProps) {
    return (
        <span
            title={description}
            className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-slate-500 ring-1 ring-slate-900/10',
                className,
            )}
        >
            {label}
        </span>
    );
}
