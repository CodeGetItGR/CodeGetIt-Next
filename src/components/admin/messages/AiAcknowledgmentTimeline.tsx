import type { AiAcknowledgmentResponse, AiAcknowledgmentStatus } from '@/api';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { cn } from '@/lib/utils';

interface AiAcknowledgmentTimelineProps {
    aiAcknowledgments: AiAcknowledgmentResponse[];
}

const formatCost = (cost: number) => `$${cost.toFixed(6)}`;

const dotColorByStatus: Record<AiAcknowledgmentStatus, string> = {
    SUCCESS: 'bg-emerald-500',
    ERROR: 'bg-rose-500',
    RATE_LIMITED: 'bg-amber-500',
    TIMEOUT: 'bg-amber-500',
};

const getResponseText = (response: string | null): string | null => {
    if (response == null) {
        return null;
    }

    try {
        const parsed = JSON.parse(response);
        if (parsed && typeof parsed === 'object' && typeof parsed.body === 'string') {
            return parsed.body;
        }
    } catch {
        // Not JSON — it's plain success text, return as-is below.
    }

    return response;
};

export const AiAcknowledgmentTimeline = ({ aiAcknowledgments }: AiAcknowledgmentTimelineProps) => {
    if (aiAcknowledgments.length === 0) {
        return (
            <p className="text-sm text-gray-500">
                Static fallback text was used (AI disabled or sender rate-capped).
            </p>
        );
    }

    return (
        <ol>
            {aiAcknowledgments.map((entry, index) => {
                const responseText = getResponseText(entry.response);
                const isLast = index === aiAcknowledgments.length - 1;

                return (
                    <li key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
                        <div className="flex flex-col items-center">
                            <span className={cn('mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full', dotColorByStatus[entry.status])} />
                            {!isLast && <span className="mt-1 w-px flex-1 bg-gray-200" />}
                        </div>

                        <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <StatusBadge value={entry.status} />
                                <time className="text-xs text-gray-500 tabular-nums">{new Date(entry.createdAt).toLocaleString()}</time>
                            </div>

                            {responseText && (
                                <p className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                                    {responseText}
                                </p>
                            )}

                            {entry.errorMessage && <p className="mt-2 text-sm text-rose-700">{entry.errorMessage}</p>}

                            <p className="mt-3 text-xs text-gray-500">
                                {entry.modelUsed} · {formatCost(entry.estimatedCost)} · {entry.totalTokens} tokens
                            </p>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
};
