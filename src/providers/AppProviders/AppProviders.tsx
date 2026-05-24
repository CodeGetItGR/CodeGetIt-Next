'use client'

import type { ReactNode } from 'react';
import { AiChatProvider } from '@/providers';
import {LocaleProvider} from "@/i18n/LocaleProvider";
import {AuthProvider} from "@/auth/AuthContext";
import {HelmetProvider} from "react-helmet-async";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/config/QueryClient";

export function AppProviders({ children }: { children: ReactNode }) {
    return <HelmetProvider>
        <LocaleProvider>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <AiChatProvider>
                            {children}
                        </AiChatProvider>
                    </AuthProvider>
                </QueryClientProvider>
        </LocaleProvider>
    </HelmetProvider>

}
