'use client'

import { createContext } from 'react';
import type { PublicSettingsMap } from '@/api';

export interface PublicSettingsContextValue {
    settings: PublicSettingsMap;
    isLoading: boolean;
    isError: boolean;
    getString: (key: string, fallback: string) => string;
    getBool: (key: string, fallback?: boolean) => boolean;
}

export const PublicSettingsContext = createContext<PublicSettingsContextValue | undefined>(undefined);
