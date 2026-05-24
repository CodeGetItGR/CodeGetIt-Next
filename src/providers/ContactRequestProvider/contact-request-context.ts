'use client'

import { createContext } from 'react';
import type { ContactFormData } from '@/providers';
import type { DetailedRequestFormState } from '@/components/sections/Contact/useUIReducer';

export interface ContactRequestPreset {
    formData?: Partial<ContactFormData>;
    detailedRequest?: Partial<DetailedRequestFormState>;
    useDetailedRequest?: boolean;
}

export interface ContactRequestContextValue {
    currentRequest: ContactRequestPreset | null;
    openContactRequest: (preset: ContactRequestPreset) => void;
    clearContactRequest: () => void;
}

export const ContactRequestContext = createContext<ContactRequestContextValue | undefined>(undefined);
