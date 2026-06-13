'use client'

import { createContext } from 'react';

export interface ScrollHighlightContextValue {
    highlightedId: string | null;
    scrollToSection: (id: string) => void;
}

export const ScrollHighlightContext = createContext<ScrollHighlightContextValue | undefined>(undefined);
