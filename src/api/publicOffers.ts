import axios from 'axios';
import type { PublicOfferResponse } from './types';
import { getCurrentLocale } from '@/i18n/locale-storage';

const baseURL = process.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const publicApiClient = axios.create({
    baseURL,
});

publicApiClient.interceptors.request.use((config) => {
    config.headers = config.headers ?? {};
    config.headers['Accept-Language'] = getCurrentLocale();
    return config;
});

export interface RejectOfferPayload {
    rejectionNote: string;
}

export const publicOfferApi = {
    getByToken: async (token: string) => {
        const { data } = await publicApiClient.get<PublicOfferResponse>(`/public/offers/${token}`);
        return data;
    },

    accept: async (token: string) => {
        const { data } = await publicApiClient.post<PublicOfferResponse>(`/public/offers/${token}/accept`, {});
        return data;
    },

    reject: async (token: string, payload: RejectOfferPayload) => {
        const { data } = await publicApiClient.post<PublicOfferResponse>(`/public/offers/${token}/reject`, payload);
        return data;
    },
};
