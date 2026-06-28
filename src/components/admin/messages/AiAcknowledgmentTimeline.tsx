import type { AiAcknowledgmentResponse, AiAcknowledgmentResponseBody } from '@/api';
import { StatusBadge } from '@/components/admin/StatusBadge';

interface AiAcknowledgmentTimelineProps {
    aiAcknowledgments: AiAcknowledgmentResponse[];
}

const formatCost = (cost: number) => `$${cost.toFixed(6)}`;

const getResponseText = (response: AiAcknowledgmentResponseBody): string | null => {
    if (response == null) {
        return null;
    }

    return typeof response === 'string' ? response : response.body;
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
        <ol className="space-y-3">
            {aiAcknowledgments.map((entry) => {
                const responseText = getResponseText(entry.response);

                return (
                    <li key={entry.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <StatusBadge value={entry.status} />
                            <time className="text-xs text-gray-500 tabular-nums">{new Date(entry.createdAt).toLocaleString()}</time>
                        </div>

                        {responseText && (
                            <p className="mt-2 max-h-48 overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                                {responseText}
                            </p>
                        )}

                        {entry.errorMessage && <p className="mt-2 text-sm text-rose-700">{entry.errorMessage}</p>}

                        <p className="mt-2 text-xs text-gray-500">
                            {entry.modelUsed} · {formatCost(entry.estimatedCost)} · {entry.totalTokens} tokens
                        </p>
                    </li>
                );
            })}
        </ol>
    );
};
