'use client'

import { useMemo, useState, useCallback, type ReactNode } from 'react';
import type { UUID } from '@/api';
import { AiChatContext, type ChatState } from './AiChatContext';

type EntityType = 'REQUEST' | 'OFFER' | 'PROJECT';

export const AiChatProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<ChatState>({
        isOpen: false,
        entityId: null,
        entityType: null,
        minimized: false,
    });

    const open = useCallback((id: UUID, type: EntityType) => {
        setState({
            isOpen: true,
            entityId: id,
            entityType: type,
            minimized: false,
        });
    }, []);

    const close = useCallback(() => {
        setState({
            isOpen: false,
            entityId: null,
            entityType: null,
            minimized: false,
        });
    }, []);

    const toggle = useCallback((id: UUID, type: EntityType) => {
        setState((prev) =>
            prev.isOpen ? { ...prev, minimized: !prev.minimized } : { isOpen: true, entityId: id, entityType: type, minimized: false }
        );
    }, []);

    const minimize = useCallback(() => {
        setState((prev) => ({ ...prev, minimized: true }));
    }, []);

    const restore = useCallback(() => {
        setState((prev) => ({ ...prev, minimized: false, isOpen: true }));
    }, []);

    const value = useMemo(() => ({ open, close, toggle, minimize, restore, state }), [open, close, toggle, minimize, restore, state]);

    return <AiChatContext.Provider value={value}>{children}</AiChatContext.Provider>;
};
