import { apiClient } from '@/api/client';
import type {
    UUID,
    OfferAnalysisResponse,
    AiThreadResponse,
    AiMessageResponse,
    AiUsageStatsResponse,
    RequestAnalysisResponse,
    RequestAnalysisStatusResponse,
} from './types';

interface SendMessagePayload {
    message: string;
}

interface CreateThreadPayload {
    requestId?: UUID;
    offerId?: UUID;
    projectId?: UUID;
}

export const aiApi = {
    // Offer Analysis
    analyzeOffer: async (offerId: UUID) => {
        const { data } = await apiClient.post<OfferAnalysisResponse>(`/ai/offers/${offerId}/analyze`);
        return data;
    },

    getOfferAnalysis: async (offerId: UUID) => {
        const { data } = await apiClient.get<OfferAnalysisResponse>(`/ai/offers/${offerId}/analysis`);
        return data;
    },

    // Request Analysis
    queueRequestAnalysis: async (requestId: UUID) => {
        await apiClient.post(`/ai/requests/${requestId}/analyze`);
    },

    getRequestAnalysis: async (requestId: UUID) => {
        const { data } = await apiClient.get<RequestAnalysisResponse>(`/ai/requests/${requestId}/analysis`);
        return data;
    },

    getRequestAnalysisStatus: async (requestId: UUID) => {
        const { data } = await apiClient.get<RequestAnalysisStatusResponse>(`/ai/requests/${requestId}/analysis/status`);
        return data;
    },

    // Conversation Threads
    createThread: async (payload: CreateThreadPayload) => {
        const params = new URLSearchParams();
        if (payload.requestId) params.append('requestId', payload.requestId);
        if (payload.offerId) params.append('offerId', payload.offerId);
        if (payload.projectId) params.append('projectId', payload.projectId);

        const { data } = await apiClient.post<AiThreadResponse>(`/ai/threads?${params.toString()}`);
        return data;
    },

    getThread: async (payload: CreateThreadPayload) => {
        const params = new URLSearchParams();
        if (payload.requestId) params.append('requestId', payload.requestId);
        if (payload.offerId) params.append('offerId', payload.offerId);
        if (payload.projectId) params.append('projectId', payload.projectId);

        const { data } = await apiClient.get<AiThreadResponse>(`/ai/threads?${params.toString()}`);
        return data;
    },

    archiveThread: async (threadId: UUID) => {
        await apiClient.post(`/ai/threads/${threadId}/archive`);
    },

    // Chat Messages
    sendMessage: async (threadId: UUID, payload: SendMessagePayload) => {
        const { data } = await apiClient.post<AiMessageResponse>(`/ai/threads/${threadId}/messages`, payload);
        return data;
    },

    getMessages: async (threadId: UUID, limit: number = 50) => {
        const { data } = await apiClient.get<AiMessageResponse[]>(`/ai/threads/${threadId}/messages`, { params: { limit } });
        return data;
    },

    // Usage Stats
    getOfferUsageStats: async (offerId: UUID) => {
        const { data } = await apiClient.get<AiUsageStatsResponse>(`/ai/offers/${offerId}/usage-stats`);
        return data;
    },
};
