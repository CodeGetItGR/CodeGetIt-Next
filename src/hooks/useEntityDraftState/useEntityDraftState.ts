'use client'

import { useCallback, useMemo, useState } from 'react';

export function useEntityDraftState<TState extends object>(entityId: string, baseState: TState) {
    const [draftById, setDraftById] = useState<Record<string, Partial<TState>>>({});

    const state = useMemo<TState>(() => {
        return {
            ...baseState,
            ...(draftById[entityId] ?? {}),
        };
    }, [baseState, draftById, entityId]);

    const setField = useCallback(
        <TKey extends keyof TState>(key: TKey, value: TState[TKey]) => {
            setDraftById((previousDrafts) => ({
                ...previousDrafts,
                [entityId]: {
                    ...(previousDrafts[entityId] ?? {}),
                    [key]: value,
                },
            }));
        },
        [entityId]
    );

    const resetDraft = useCallback(() => {
        setDraftById((previousDrafts) => ({
            ...previousDrafts,
            [entityId]: {},
        }));
    }, [entityId]);

    return {
        state,
        setField,
        resetDraft,
    };
}
