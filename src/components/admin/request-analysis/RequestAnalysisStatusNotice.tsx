import { memo } from 'react';
import { BrainCircuit, Loader2 } from 'lucide-react';
import type { RequestAnalysisText } from '@/hooks';

interface RequestAnalysisStatusNoticeProps {
    text: RequestAnalysisText;
    isLoading: boolean;
    isQueuedOrPending: boolean;
    status: string | null | undefined;
    jobId?: string | null;
    errorMessage?: string | null;
    isEmpty: boolean;
}

export const RequestAnalysisStatusNotice = memo(
    ({ text, isLoading, isQueuedOrPending, status, jobId, errorMessage, isEmpty }: RequestAnalysisStatusNoticeProps) => {
        console.log(isLoading, isQueuedOrPending, status, jobId, errorMessage )
        if (errorMessage) {
            return <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>;
        }

        if (isLoading) {
            return (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                    {text.loading}
                </div>
            );
        }

        if (status === 'FAILED') {
            return null;
        }

        if (isQueuedOrPending) {
            return (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                    {text.queuedNotice}
                    {jobId && (
                        <p className="mt-2 font-mono text-xs text-amber-700">
                            {text.jobId}: {jobId}
                        </p>
                    )}
                </div>
            );
        }

        if(isEmpty) {
            return (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5">
                    <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-slate-900 p-2 text-white">
                            <BrainCircuit className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">{text.emptyStateTitle}</p>
                            <p className="mt-1 text-sm text-slate-600">{text.emptyStateBody}</p>
                        </div>
                    </div>
                </div>
            );
        }

        return null
    }
);

RequestAnalysisStatusNotice.displayName = 'RequestAnalysisStatusNotice';
