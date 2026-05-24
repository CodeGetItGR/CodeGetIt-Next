'use client'

import { createContext } from 'react';
import type { Role } from '@/api';

export interface AuthState {
    token: string;
    refreshToken: string;
    username: string;
    role: Role;
}

export interface AuthContextValue {
    auth: AuthState | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    refreshAccessToken: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
