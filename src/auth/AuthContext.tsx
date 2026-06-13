'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import {AuthContext, AuthContextValue, AuthState} from "@/auth/auth-context";
import {AUTH_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY, TOKEN_REFRESH_BEFORE_EXPIRY} from "@/auth/constants";
import {authApi, AuthResponse} from "@/api";
import {getTokenExpirationTime} from "@/lib";

function readStoredAuth(): AuthState | null {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    if (!raw || !refreshToken) {
        return null;
    }

    try {
        const auth = JSON.parse(raw) as AuthState;
        auth.refreshToken = refreshToken;
        return auth;
    } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
        return null;
    }
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [auth, setAuth] = useState<AuthState | null>(null);
    const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Hydrate from localStorage on the client only — this runs during SSR
    // where localStorage is undefined.
    useEffect(() => {
        const stored = readStoredAuth();
        if (stored) {
            setAuth(stored);
        }
    }, []);

    const logout = useCallback(() => {
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }
        setAuth(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    }, []);

    const refreshAccessToken = useCallback(async (): Promise<boolean> => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
        if (!refreshToken) {
            logout();
            return false;
        }

        try {
            const data: AuthResponse = await authApi.refresh({ refreshToken });
            const nextState: AuthState = {
                token: data.token,
                refreshToken: data.refreshToken,
                username: data.username,
                role: data.role,
            };

            setAuth(nextState);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
            localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, data.refreshToken);
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
            return false;
        }
    }, [logout]);

    const scheduleTokenRefresh = useCallback(
        (token: string) => {
            // Clear any existing timeout
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }

            const expirationTime = getTokenExpirationTime(token);
            if (!expirationTime) {
                console.warn('Could not determine token expiration time');
                return;
            }

            const timeUntilExpiry = expirationTime - Date.now();
            const timeUntilRefresh = timeUntilExpiry - TOKEN_REFRESH_BEFORE_EXPIRY;

            if (timeUntilRefresh > 0) {
                refreshTimeoutRef.current = setTimeout(async () => {
                    console.log('Proactively refreshing token...');
                    try {
                        await refreshAccessToken();
                    } catch {
                        // Refresh will handle logout if needed
                    }
                }, timeUntilRefresh);
            }
        },
        [refreshAccessToken]
    );

    const login = useCallback(
        async (username: string, password: string) => {
            const data: AuthResponse = await authApi.login({ username, password });
            const nextState: AuthState = {
                token: data.token,
                refreshToken: data.refreshToken,
                username: data.username,
                role: data.role,
            };

            setAuth(nextState);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
            localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, data.refreshToken);
            scheduleTokenRefresh(data.token);
        },
        [scheduleTokenRefresh]
    );

    // Schedule token refresh on mount and when auth changes
    useEffect(() => {
        if (auth?.token) {
            scheduleTokenRefresh(auth.token);
        }
    }, [auth?.token, scheduleTokenRefresh]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            auth,
            isAuthenticated: Boolean(auth?.token),
            isAdmin: auth?.role === 'ROLE_ADMIN',
            login,
            logout,
            refreshAccessToken,
        }),
        [auth, login, logout, refreshAccessToken]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
