import { useContext } from 'react';
import { ScrollHighlightContext } from '@/providers';

export function useScrollHighlight() {
    const context = useContext(ScrollHighlightContext);

    if (!context) {
        throw new Error('useScrollHighlight must be used within a ScrollHighlightProvider');
    }

    return context;
}
