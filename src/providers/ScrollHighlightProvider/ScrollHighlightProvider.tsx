'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ScrollHighlightContext } from '@/providers';

const HIGHLIGHT_DURATION_MS = 2500;

export const ScrollHighlightProvider = ({ children }: { children: ReactNode }) => {
    const [highlightedId, setHighlightedId] = useState<string | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const highlight = useCallback((id: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setHighlightedId(id);
        timeoutRef.current = setTimeout(() => setHighlightedId(null), HIGHLIGHT_DURATION_MS);
    }, []);

    const scrollToSection = useCallback((id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        highlight(id);
    }, [highlight]);

    useEffect(() => {
        const syncFromHash = () => {
            const hash = window.location.hash.slice(1);
            if (hash) highlight(hash);
        };

        syncFromHash();
        window.addEventListener('hashchange', syncFromHash);

        return () => {
            window.removeEventListener('hashchange', syncFromHash);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [highlight]);

    const value = useMemo(
        () => ({ highlightedId, scrollToSection }),
        [highlightedId, scrollToSection]
    );

    return <ScrollHighlightContext.Provider value={value}>{children}</ScrollHighlightContext.Provider>;
};
