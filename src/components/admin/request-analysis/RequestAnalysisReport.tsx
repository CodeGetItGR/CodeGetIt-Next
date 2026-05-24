import { memo } from 'react';
import {useRequestAnalysisReport} from "@/hooks";
import {UUID} from "@/api";
import {
    RequestAnalysisHeader,
    RequestAnalysisMetadata,
    RequestAnalysisOverview, RequestAnalysisSections,
    RequestAnalysisStatusNotice
} from "@/components";


interface RequestAnalysisReportProps {
    requestId: UUID;
    requestTitle?: string;
}

export const RequestAnalysisReport = memo(({ requestId, requestTitle }: RequestAnalysisReportProps) => {
    const {
        text,
        status,
        analysis,
        analysisData,
        statusLabel,
        statusToneClass,
        jobTypeLabel,
        targetTypeLabel,
        complexityLabel,
        isQueuedOrPending,
        isReady,
        isLoading,
        availabilityLabel,
        headline,
        errorMessage,
        isQueueing,
        queueAnalysis,
    } = useRequestAnalysisReport(requestId, requestTitle);

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <RequestAnalysisHeader
                text={text}
                headline={headline}
                statusLabel={statusLabel}
                statusToneClass={statusToneClass}
                availabilityLabel={availabilityLabel}
                isActionPending={isQueueing}
                isReady={isReady}
                onAction={queueAnalysis}
            />

            <div className="space-y-6 p-6">
                <RequestAnalysisStatusNotice
                    text={text}
                    isLoading={isLoading}
                    isQueuedOrPending={isQueuedOrPending}
                    status={status?.status}
                    jobId={status?.job_id}
                    errorMessage={errorMessage}
                />

                {status?.status === 'FAILED' && status.error_message && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
                        <p className="font-medium">{statusLabel}</p>
                        <p className="mt-1">{status.error_message}</p>
                    </div>
                )}

                {analysis && analysisData && (
                    <>
                        <RequestAnalysisOverview text={text} analysis={analysis} analysisData={analysisData} complexityLabel={complexityLabel} />
                        <RequestAnalysisMetadata
                            text={text}
                            analysis={analysis}
                            status={status}
                            statusLabel={statusLabel}
                            jobTypeLabel={jobTypeLabel}
                            targetTypeLabel={targetTypeLabel}
                        />
                        <RequestAnalysisSections text={text} analysisData={analysisData} />
                    </>
                )}

                {analysis && !analysisData && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{text.missingStructuredBlock}</div>
                )}
            </div>
        </section>
    );
});

RequestAnalysisReport.displayName = 'RequestAnalysisReport';
