import { apiClient } from '@/api/client';
import {ContactMessageResponse, PagedResponse} from "@/api/types";

export interface SubmitContactMessagePayload {
    name: string;
    email: string;
    message: string;
}

export interface ContactMessageListQuery {
    page?: number;
    size?: number;
    sort?: string;
}

export const contactMessageApi = {
    submit: async (payload: SubmitContactMessagePayload) => {
        const { data } = await apiClient.post<ContactMessageResponse>('/contact-messages', payload);
        return data;
    },

    list: async (query: ContactMessageListQuery) => {
        const { data } = await apiClient.get<PagedResponse<ContactMessageResponse>>('/contact-messages', {
            params: query,
        });
        return data;
    },
};
