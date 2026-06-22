'use client'

import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';
import { publicOfferApi, type PublicOfferResponse, type RejectOfferPayload } from '@/api';
import { useSettingsOptions } from '@/hooks';
import type { Translations } from '@/i18n/types';
import { PublicOfferContext, type PublicOfferActionState } from './public-offer-context';

interface PublicOfferProviderProps {
    token: string;
    offer: PublicOfferResponse;
    text: Translations['publicOffer'];
    localeTag: string;
    onRefetch: () => void;
    children: ReactNode;
}

export const PublicOfferProvider = ({ token, offer, text, localeTag, onRefetch, children }: PublicOfferProviderProps) => {
    const [rejectionNote, setRejectionNote] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [actionState, setActionState] = useState<PublicOfferActionState>('none');

    const { options: languageOptions } = useSettingsOptions({ groupKey: 'offer.language', scope: 'public', onlyEnabled: true });

    useEffect(() => {
        document.title = `${offer.offer.title} — ${text.offerLabel}`;
    }, [offer.offer.title, text.offerLabel]);

    const acceptMutation = useMutation({
        mutationFn: () => publicOfferApi.accept(token),
        onSuccess: () => {
            setActionState('accepted');
            onRefetch();
        },
    });

    const rejectMutation = useMutation({
        mutationFn: (payload: RejectOfferPayload) => publicOfferApi.reject(token, payload),
        onSuccess: () => {
            setActionState('rejected');
            setShowRejectModal(false);
            setRejectionNote('');
            onRefetch();
        },
    });

    const handleAccept = useCallback(() => {
        setActionState('accepting');
        acceptMutation.mutate();
    }, [acceptMutation]);

    const handleRejectSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (rejectionNote.trim()) {
                setActionState('rejecting');
                rejectMutation.mutate({ rejectionNote: rejectionNote.trim() });
            }
        },
        [rejectionNote, rejectMutation]
    );

    const openRejectModal = useCallback(() => setShowRejectModal(true), []);
    const closeRejectModal = useCallback(() => setShowRejectModal(false), []);

    const isActionable = offer.status === 'SENT' && !offer.expired;
    const isAccepted = offer.status === 'ACCEPTED_BY_CLIENT';
    const isRejected = offer.status === 'REJECTED_BY_CLIENT';
    const isCancelled = offer.status === 'CANCELLED';

    const showAccepted = isAccepted || actionState === 'accepted';
    const showRejected = isRejected || actionState === 'rejected';
    const showActions = isActionable && actionState === 'none';

    const offerLanguageLabel = useMemo(
        () => languageOptions.find((item) => item.value === offer.offer.language)?.label ?? offer.offer.language,
        [languageOptions, offer.offer.language]
    );

    const fmt = useCallback(
        (amount: number) =>
            amount.toLocaleString(localeTag, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + (offer.offer.currency ?? '€'),
        [localeTag, offer.offer.currency]
    );

    const fmtDate = useCallback(
        (date: string) => new Date(date).toLocaleDateString(localeTag, { year: 'numeric', month: 'long', day: 'numeric' }),
        [localeTag]
    );

    const value = useMemo(
        () => ({
            offer,
            text,
            fmt,
            fmtDate,
            offerLanguageLabel,
            isActionable,
            isCancelled,
            showAccepted,
            showRejected,
            showActions,
            actionState,
            isAccepting: acceptMutation.isPending,
            handleAccept,
            showRejectModal,
            openRejectModal,
            closeRejectModal,
            rejectionNote,
            setRejectionNote,
            handleRejectSubmit,
            isRejecting: rejectMutation.isPending,
        }),
        [
            offer,
            text,
            fmt,
            fmtDate,
            offerLanguageLabel,
            isActionable,
            isCancelled,
            showAccepted,
            showRejected,
            showActions,
            actionState,
            acceptMutation.isPending,
            handleAccept,
            showRejectModal,
            openRejectModal,
            closeRejectModal,
            rejectionNote,
            handleRejectSubmit,
            rejectMutation.isPending,
        ]
    );

    return <PublicOfferContext.Provider value={value}>{children}</PublicOfferContext.Provider>;
};
