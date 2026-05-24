'use client'

import { useCallback, useState } from 'react';

export function usePaginationState(initialPage = 0) {
    const [page, setPage] = useState(initialPage);

    const resetPage = useCallback(() => {
        setPage(0);
    }, []);

    const goToPreviousPage = useCallback(() => {
        setPage((previousPage) => Math.max(previousPage - 1, 0));
    }, []);

    const goToNextPage = useCallback((totalPages: number) => {
        setPage((previousPage) => {
            if (totalPages <= 0) {
                return 0;
            }
            return Math.min(previousPage + 1, totalPages - 1);
        });
    }, []);

    return {
        page,
        setPage,
        resetPage,
        goToPreviousPage,
        goToNextPage,
    };
}
