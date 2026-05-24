'use client'

import { createContext } from 'react';
import type { EntityType, UUID } from '@/api';

export interface ChatState {
    isOpen: boolean;
    entityId: UUID | null;
    entityType: EntityType | null;
    minimized: boolean;
}

interface AiChatContextValue {
    open: (id: UUID, type: EntityType) => void;
    close: () => void;
    toggle: (id: UUID, type: EntityType) => void;
    minimize: () => void;
    restore: () => void;
    state: ChatState;
}

export const AiChatContext = createContext<AiChatContextValue | null>(null);
