'use client'

import { useCallback, useState } from 'react';
import { normalizeApiError } from '@/api';

export function useApiErrorState() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const setApiError = useCallback((error: unknown) => {
        setErrorMessage(normalizeApiError(error).detail);
    }, []);

    const clearError = useCallback(() => {
        setErrorMessage(null);
    }, []);

    return {
        errorMessage,
        setApiError,
        clearError,
    };
}
