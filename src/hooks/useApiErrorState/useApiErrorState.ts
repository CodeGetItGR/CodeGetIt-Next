'use client'

import { useCallback, useState } from 'react';
import { normalizeApiError } from '@/api';

const ACCESS_DENIED_MESSAGE = "You don't have permission to do this. Contact an admin if you think this is a mistake.";

export function useApiErrorState() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const setApiError = useCallback((error: unknown) => {
        const normalized = normalizeApiError(error);
        setErrorMessage(normalized.errorCode === 'ACCESS_DENIED' ? ACCESS_DENIED_MESSAGE : normalized.detail);
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
