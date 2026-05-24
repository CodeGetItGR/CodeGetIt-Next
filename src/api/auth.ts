 import { apiClient } from '@/api/client';
 import {AuthResponse} from "@/api/types";

interface LoginRequest {
    username: string;
    password: string;
}

interface RegisterRequest {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface RefreshRequest {
    refreshToken: string;
}

export const authApi = {
    login: async (payload: LoginRequest) => {
        const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
        return data;
    },

    register: async (payload: RegisterRequest) => {
        const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
        return data;
    },

    refresh: async (payload: RefreshRequest) => {
        const { data } = await apiClient.post<AuthResponse>('/auth/refresh', payload);
        return data;
    },
};
