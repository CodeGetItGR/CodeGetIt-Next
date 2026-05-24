import { apiClient } from '@/api/client';
import type { OfferResponse, OfferStatus, OfferLineItemResponse, OfferSubmissionResponse, PagedResponse, UUID } from './types';

export interface OfferListQuery {
    page?: number;
    size?: number;
    sort?: string;
    status?: OfferStatus;
    requestId?: UUID;
}

export interface CreateOfferPayload {
    requestId: UUID;
    title: string;
    description?: string;
    priceAmount?: number;
    taxRate?: number;
    currency?: string;
    recipientEmail: string;
    recipientName?: string;
    validUntil?: string;
}

export interface UpdateOfferPayload {
    title: string;
    description?: string;
    priceAmount?: number;
    taxRate?: number;
    currency?: string;
    recipientEmail: string;
    recipientName?: string;
    validUntil?: string;
}

export interface CreateLineItemPayload {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
    sortOrder?: number;
}

export interface UpdateLineItemPayload {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
    sortOrder?: number;
}

interface OfferStatusPayload {
    targetStatus: OfferStatus;
    reason?: string;
}

interface ReviseOfferPayload {
    reason?: string;
}

interface CancelOfferPayload {
    reason?: string;
}

export const offerApi = {
    list: async (query: OfferListQuery) => {
        const { data } = await apiClient.get<PagedResponse<OfferResponse>>('/offers', {
            params: query,
        });
        return data;
    },

    getById: async (id: UUID) => {
        const { data } = await apiClient.get<OfferResponse>(`/offers/${id}`);
        return data;
    },

    create: async (payload: CreateOfferPayload) => {
        const { data } = await apiClient.post<OfferResponse>('/offers', payload);
        return data;
    },

    update: async (id: UUID, payload: UpdateOfferPayload) => {
        const { data } = await apiClient.put<OfferResponse>(`/offers/${id}`, payload);
        return data;
    },

    send: async (id: UUID) => {
        const { data } = await apiClient.post<OfferResponse>(`/offers/${id}/send`, {});
        return data;
    },

    revise: async (id: UUID, payload?: ReviseOfferPayload) => {
        const { data } = await apiClient.post<OfferResponse>(`/offers/${id}/revise`, payload || {});
        return data;
    },

    cancel: async (id: UUID, payload?: CancelOfferPayload) => {
        const { data } = await apiClient.post<OfferResponse>(`/offers/${id}/cancel`, payload || {});
        return data;
    },

    changeStatus: async (id: UUID, payload: OfferStatusPayload) => {
        const { data } = await apiClient.patch<OfferResponse>(`/offers/${id}/status`, payload);
        return data;
    },

    // Line items
    getLineItems: async (id: UUID) => {
        const { data } = await apiClient.get<OfferLineItemResponse[]>(`/offers/${id}/line-items`);
        return data;
    },

    createLineItem: async (id: UUID, payload: CreateLineItemPayload) => {
        const { data } = await apiClient.post<OfferLineItemResponse>(`/offers/${id}/line-items`, payload);
        return data;
    },

    updateLineItem: async (id: UUID, itemId: UUID, payload: UpdateLineItemPayload) => {
        const { data } = await apiClient.put<OfferLineItemResponse>(`/offers/${id}/line-items/${itemId}`, payload);
        return data;
    },

    deleteLineItem: async (id: UUID, itemId: UUID) => {
        await apiClient.delete(`/offers/${id}/line-items/${itemId}`);
    },

    // Submissions
    getSubmissions: async (id: UUID) => {
        const { data } = await apiClient.get<OfferSubmissionResponse[]>(`/offers/${id}/submissions`);
        return data;
    },
};
