import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { aiApi } from '@/api';
import { queryKeys } from '@/api';
import { useApiErrorState } from '@/hooks';
import { useLocale } from '@/i18n/UseLocale';
import type { RequestAnalysisResponse, RequestAnalysisStatusResponse, UUID } from '@/api';
import type { Translations } from '@/i18n/types';

export type RequestAnalysisText = Translations['admin']['requestAnalysis'];

export interface RequestAnalysisReportState {
    text: RequestAnalysisText;
    status: RequestAnalysisStatusResponse | null | undefined;
    analysis: RequestAnalysisResponse | null | undefined;
    analysisData: RequestAnalysisResponse['analysis_data'] | undefined;
    statusLabel: string;
    statusToneClass: string;
    jobTypeLabel: string;
    targetTypeLabel: string;
    complexityLabel: string;
    isQueuedOrPending: boolean;
    isReady: boolean;
    isLoading: boolean;
    availabilityLabel: string;
    headline: string;
    errorMessage: string | null;
    isQueueing: boolean;
    queueAnalysis: () => void;
}

const isTerminalStatus = (status?: string | null) => status === 'DONE' || status === 'FAILED' || status === 'CANCELLED';

const getStatusToneClass = (status?: string | null) => {
    switch (status) {
        case 'DONE':
            return 'border-emerald-200 bg-emerald-50 text-emerald-700';
        case 'FAILED':
            return 'border-rose-200 bg-rose-50 text-rose-700';
        case 'CANCELLED':
            return 'border-slate-200 bg-slate-100 text-slate-700';
        case 'IN_PROGRESS':
            return 'border-blue-200 bg-blue-50 text-blue-700';
        case 'PENDING':
        default:
            return 'border-amber-200 bg-amber-50 text-amber-700';
    }
};

export const useRequestAnalysisReport = (requestId: UUID, requestTitle?: string): RequestAnalysisReportState => {
    const queryClient = useQueryClient();
    const { t } = useLocale();
    const text = t.admin.requestAnalysis;
    const { errorMessage, setApiError, clearError } = useApiErrorState();

    const statusQuery = useQuery<RequestAnalysisStatusResponse | null>({
        queryKey: queryKeys.ai.requestAnalysisStatus(requestId),
        enabled: Boolean(requestId),
        queryFn: async () => {
            try {
                return await aiApi.getRequestAnalysisStatus(requestId);
            } catch (error) {
                if (isAxiosError(error) && error.response?.status === 404) {
                    return null;
                }

                throw error;
            }
        },
        refetchInterval: (query) => (!isTerminalStatus(query.state.data?.status) ? 3000 : false),
        refetchIntervalInBackground: true,
        staleTime: 10_000,
    });

    const status = statusQuery.data;

    const analysisQuery = useQuery<RequestAnalysisResponse | null>({
        queryKey: queryKeys.ai.requestAnalysis(requestId),
        enabled: Boolean(statusQuery.data?.analysis_available || statusQuery.data?.status === 'DONE'),
        queryFn: async () => {
            try {
                return await aiApi.getRequestAnalysis(requestId);
            } catch (error) {
                if (isAxiosError(error) && error.response?.status === 404) {
                    return null;
                }

                throw error;
            }
        },
        refetchInterval: (query) => (status?.status === 'DONE' && !query.state.data ? 3000 : false),
        staleTime: 10_000,
    });

    const queueMutation = useMutation({
        mutationFn: () => aiApi.queueRequestAnalysis(requestId),
        onSuccess: async () => {
            clearError();
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: queryKeys.ai.requestAnalysisStatus(requestId),
                }),
                queryClient.invalidateQueries({
                    queryKey: queryKeys.ai.requestAnalysis(requestId),
                }),
            ]);
        },
        onError: (error) => setApiError(error),
    });

    const analysis = analysisQuery.data;
    const analysisData = analysis?.analysis_data;

    const statusLabel = useMemo(() => {
        if (!status) {
            return text.notGenerated;
        }

        return text.statusLabels[status.status as keyof typeof text.statusLabels] ?? status.status;
    }, [status, text]);

    const statusToneClass = useMemo(() => getStatusToneClass(status?.status), [status?.status]);

    const jobTypeLabel = useMemo(() => {
        if (!status) {
            return '—';
        }

        return text.jobTypeLabels[status.job_type as keyof typeof text.jobTypeLabels] ?? status.job_type;
    }, [status, text]);

    const targetTypeLabel = useMemo(() => {
        if (!status) {
            return '—';
        }

        return text.targetTypeLabels[status.target_type as keyof typeof text.targetTypeLabels] ?? status.target_type;
    }, [status, text]);

    const complexityLabel = useMemo(() => {
        if (!analysisData) {
            return '—';
        }

        return text.complexityLabels[analysisData.complexity as keyof typeof text.complexityLabels] ?? analysisData.complexity;
    }, [analysisData, text]);

    const isQueuedOrPending = useMemo(() => Boolean(status && !isTerminalStatus(status.status)), [status]);

    const isReady = useMemo(() => Boolean(analysis && analysisData), [analysis, analysisData]);

    const isLoading = useMemo(
        () => statusQuery.isLoading || (Boolean(status?.analysis_available || status?.status === 'DONE') && analysisQuery.isLoading),
        [analysisQuery.isLoading, status, statusQuery.isLoading]
    );

    const availabilityLabel = useMemo(() => {
        if (!status) {
            return text.notGenerated;
        }

        return status.analysis_available ? text.ready : text.queued;
    }, [status, text]);

    const headline = useMemo(() => (requestTitle ? `${text.title}: ${requestTitle}` : text.title), [requestTitle, text.title]);

    const queueAnalysis = useCallback(() => {
        queueMutation.mutate();
    }, [queueMutation]);

    return {
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
        isQueueing: queueMutation.isPending,
        queueAnalysis,
    };
};
