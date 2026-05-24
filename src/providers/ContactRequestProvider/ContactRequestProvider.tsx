'use client'

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ContactRequestContext, type ContactRequestPreset } from '@/providers';

export const ContactRequestProvider = ({ children }: { children: ReactNode }) => {
    const [currentRequest, setCurrentRequest] = useState<ContactRequestPreset | null>(null);

    const clearContactRequest = useCallback(() => {
        setCurrentRequest(null);
    }, []);

    const openContactRequest = useCallback((preset: ContactRequestPreset) => {
        setCurrentRequest(preset);

        if (typeof window !== 'undefined') {
            window.requestAnimationFrame(() => {
                document.getElementById('contact')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            });
        }
    }, []);

    const value = useMemo(
        () => ({
            currentRequest,
            openContactRequest,
            clearContactRequest,
        }),
        [clearContactRequest, currentRequest, openContactRequest]
    );

    return <ContactRequestContext.Provider value={value}>{children}</ContactRequestContext.Provider>;
};
