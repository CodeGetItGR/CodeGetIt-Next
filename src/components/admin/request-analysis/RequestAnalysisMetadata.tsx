import { memo } from 'react';
import { Clock3, FileText, Lightbulb, ListChecks } from 'lucide-react';
import type { RequestAnalysisText } from 'src/admin/hooks/useRequestAnalysisReport';
import type { RequestAnalysisResponse, RequestAnalysisStatusResponse } from '../../../api/types';

interface RequestAnalysisMetadataProps {
    text: RequestAnalysisText;
    analysis: RequestAnalysisResponse;
    status: RequestAnalysisStatusResponse | null | undefined;
    statusLabel: string;
    jobTypeLabel: string;
    targetTypeLabel: string;
}

const formatDateTime = (value?: string | null) => {
    if (!value) {
        return '—';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
};

export const RequestAnalysisMetadata = memo(
    ({ text, analysis, status, statusLabel, jobTypeLabel, targetTypeLabel }: RequestAnalysisMetadataProps) => {
        return (
            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">{text.analysisMetadata}</p>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                            <dt className="text-slate-500">{text.analysisId}</dt>
                            <dd className="mt-1 font-mono text-xs text-slate-800">{analysis.analysisId}</dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">{text.requestId}</dt>
                            <dd className="mt-1 font-mono text-xs text-slate-800">{analysis.request_id}</dd>
                        </div>
                        {status && (
                            <>
                                <div>
                                    <dt className="text-slate-500">{text.jobId}</dt>
                                    <dd className="mt-1 font-mono text-xs text-slate-800">{status.job_id}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">{text.jobType}</dt>
                                    <dd className="mt-1 text-slate-800">{jobTypeLabel}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">{text.targetType}</dt>
                                    <dd className="mt-1 text-slate-800">{targetTypeLabel}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">{text.retryCount}</dt>
                                    <dd className="mt-1 text-slate-800">{status.retry_count}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">{text.status}</dt>
                                    <dd className="mt-1 text-slate-800">{statusLabel}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">{text.nextAttemptAt}</dt>
                                    <dd className="mt-1 text-slate-800">{formatDateTime(status.next_attempt_at)}</dd>
                                </div>
                            </>
                        )}
                        <div>
                            <dt className="text-slate-500">{text.createdAt}</dt>
                            <dd className="mt-1 text-slate-800">{formatDateTime(analysis.created_at)}</dd>
                        </div>
                        {status && (
                            <div>
                                <dt className="text-slate-500">{text.updatedAt}</dt>
                                <dd className="mt-1 text-slate-800">{formatDateTime(status.updated_at)}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
                    <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">{text.whatThisReportCovers}</p>
                    <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <ListChecks className="h-4 w-4 text-slate-500" />
                            {text.risksAndBlockers}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock3 className="h-4 w-4 text-slate-500" />
                            {text.timelineSignals}
                        </div>
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-500" />
                            {text.requirements}
                        </div>
                        <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-slate-500" />
                            {text.recommendations}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

RequestAnalysisMetadata.displayName = 'RequestAnalysisMetadata';
