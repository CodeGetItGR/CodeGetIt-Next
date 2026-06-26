import { cn } from '@/lib/utils';

interface ComparisonGrowthDiagramProps {
    labels: [string, string, string];
}

// Three rounded-square nodes growing in size left-to-right, connected by a
// line that goes from light to saturated teal — the same "more capability,
// more weight" idea the table states in words. Squares, not circles: the
// only circle on the page is It (docs/creative-direction-it.md Law 2).
const NODE_SIZES = ['h-5 w-5 rounded-md', 'h-7 w-7 rounded-lg', 'h-10 w-10 rounded-xl'];
const NODE_FILLS = ['bg-brand-200', 'bg-brand-400', 'bg-brand-600'];

export function ComparisonGrowthDiagram({ labels }: ComparisonGrowthDiagramProps) {
    return (
        <div className="relative mx-auto mb-12 max-w-xl" aria-hidden="true">
            <div
                className="absolute left-[10%] right-[10%] top-5 h-px"
                style={{ background: 'linear-gradient(90deg, var(--color-brand-200) 0%, var(--color-brand-400) 50%, var(--color-brand-600) 100%)' }}
            />
            <div className="relative flex items-center justify-between">
                {labels.map((label, i) => (
                    <div key={label} className="flex flex-1 flex-col items-center gap-2.5">
                        <span className={cn('flex shrink-0', NODE_SIZES[i], NODE_FILLS[i])} />
                        <span
                            className={cn(
                                'text-center text-[11px] font-medium',
                                i === labels.length - 1 ? 'font-semibold text-slate-900' : 'text-slate-500',
                            )}
                        >
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
