import { apiClient } from '@/api/client';

export interface DataRightsRequestPayload {
    email: string;
}

export interface DataRightsRequestResponse {
    message: string;
}

export const dataRightsApi = {
    requestExport: async (payload: DataRightsRequestPayload) => {
        const { data } = await apiClient.post<DataRightsRequestResponse>('/data-rights/export', payload);
        return data;
    },

    requestErasure: async (payload: DataRightsRequestPayload) => {
        const { data } = await apiClient.post<DataRightsRequestResponse>('/data-rights/erase', payload);
        return data;
    },
};
