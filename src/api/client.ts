import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import {ApiError, ProblemDetail} from "@/api/types";
import {getCurrentLocale} from "@/i18n/locale-storage";
import {AUTH_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY} from "@/auth/constants";


const baseURL = process.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Entries with a method are matched exactly; entries without a method match any method.
const PUBLIC_ENDPOINTS: { path: string; method?: string }[] = [
    { path: '/auth/login' },
    { path: '/auth/register' },
    { path: '/auth/refresh' },
    { path: '/requests/submit', method: 'POST' },
    { path: '/contact-messages', method: 'POST' },
    { path: '/settings/public', method: 'GET' },
    { path: '/settings/options/public', method: 'GET' },
    { path: '/public/offers' },
];

function isPublicEndpoint(config: AxiosRequestConfig): boolean {
    const requestUrl = config.url ?? '';
    const normalized = requestUrl.startsWith('http') ? requestUrl.replace(baseURL, '') : requestUrl;
    const method = (config.method ?? '').toUpperCase();

    for (const endpoint of PUBLIC_ENDPOINTS) {
        if (normalized.startsWith(endpoint.path) && (!endpoint.method || endpoint.method === method)) {
            return true;
        }
    }

    return false;
}

export const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

function parseFieldErrors(detail?: string): Record<string, string> | undefined {
    if (!detail || !detail.includes(':')) {
        return undefined;
    }

    const result: Record<string, string> = {};
    const parts = detail.split('; ');
    for (const part of parts) {
        const [field, ...rest] = part.split(': ');
        if (field && rest.length > 0) {
            result[field.trim()] = rest.join(': ').trim();
        }
    }

    return Object.keys(result).length ? result : undefined;
}

export function normalizeApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        const payload = error.response?.data as ProblemDetail | undefined;
        return {
            status: payload?.status ?? error.response?.status,
            title: payload?.title ?? 'Request failed',
            detail: payload?.detail ?? error.message,
            fieldErrors: payload?.errors ?? parseFieldErrors(payload?.detail),
            errorCode: payload?.errorCode,
        };
    }

    return {
        title: 'Unexpected error',
        detail: error instanceof Error ? error.message : 'Unknown error',
    };
}

// Flag to prevent refresh loops
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onRefreshed(token: string) {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
    refreshSubscribers.push(callback);
}

apiClient.interceptors.request.use((config) => {
    config.headers = config.headers ?? {};
    config.headers['Accept-Language'] = getCurrentLocale();

    if (isPublicEndpoint(config)) {
        if (config.headers && 'Authorization' in config.headers) {
            delete config.headers.Authorization;
        }
        return config;
    }

    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
        try {
            const parsed = JSON.parse(raw) as { token?: string };
            if (parsed.token) {
                config.headers.Authorization = `Bearer ${parsed.token}`;
            }
        } catch {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
            return Promise.reject(error);
        }

        if (isPublicEndpoint(originalRequest)) {
            return Promise.reject(error);
        }

        const errorCode = (error.response?.data as ProblemDetail | undefined)?.errorCode;

        // If TOKEN_INVALID or NO_TOKEN, don't try to refresh
        if (errorCode === 'TOKEN_INVALID' || errorCode === 'NO_TOKEN') {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }

        // If TOKEN_EXPIRED, try to refresh
        if (errorCode === 'TOKEN_EXPIRED') {
            if (isRefreshing) {
                // Refresh is already in progress, wait for it
                return new Promise<string>((resolve) => {
                    addRefreshSubscriber((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(apiClient(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
                if (!refreshToken) {
                    throw new Error('No refresh token found');
                }

                const response = await axios.post<{ token: string; refreshToken: string }>(
                    `${baseURL}/auth/refresh`,
                    { refreshToken },
                    {
                        headers: { 'Content-Type': 'application/json' },
                    }
                );

                const { token: newToken, refreshToken: newRefreshToken } = response.data;

                // Update stored tokens
                const authRaw = localStorage.getItem(AUTH_STORAGE_KEY);
                if (authRaw) {
                    const auth = JSON.parse(authRaw);
                    auth.token = newToken;
                    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
                }
                localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, newRefreshToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                onRefreshed(newToken);
                isRefreshing = false;

                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Refresh failed, clear tokens and redirect to login
                localStorage.removeItem(AUTH_STORAGE_KEY);
                localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
                isRefreshing = false;
                if (!window.location.pathname.startsWith('/login')) {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        // For other 401 errors, clear tokens and redirect to login
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
        if (!window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);
