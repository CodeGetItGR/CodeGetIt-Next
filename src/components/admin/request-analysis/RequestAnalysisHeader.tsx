import { memo } from 'react';
import { Loader2, RefreshCcw, Sparkles } from 'lucide-react';
import type { RequestAnalysisText } from '@/hooks';

interface RequestAnalysisHeaderProps {
    text: RequestAnalysisText;
    headline: string;
    statusLabel: string;
    statusToneClass: string;
    availabilityLabel: string;
    isActionPending: boolean;
    isReady: boolean;
    onAction: () => void;
}

export const RequestAnalysisHeader = memo(
    ({ text, headline, statusLabel, statusToneClass, availabilityLabel, isActionPending, isReady, onAction }: RequestAnalysisHeaderProps) => {
        return (
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium tracking-[0.18em] text-white/75 uppercase">
                            <Sparkles className="h-3.5 w-3.5" />
                            {text.title}
                        </div>
                        <h3 className="mt-3 text-2xl font-semibold tracking-tight">{headline}</h3>
                        <p className="mt-2 max-w-xl text-sm text-white/70">{text.description}</p>
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:items-end">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusToneClass}`}>{statusLabel}</span>
                            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                                {availabilityLabel}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={onAction}
                            disabled={isActionPending}
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isActionPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                            {isReady ? text.refreshAnalysis : text.queueAnalysis}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
);

RequestAnalysisHeader.displayName = 'RequestAnalysisHeader';
