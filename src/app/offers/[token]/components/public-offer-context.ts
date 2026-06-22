import { createContext, type FormEvent } from 'react';
import type { PublicOfferResponse } from '@/api';
import type { Translations } from '@/i18n/types';

export type PublicOfferActionState = 'none' | 'accepting' | 'rejecting' | 'accepted' | 'rejected';

export interface PublicOfferContextValue {
    offer: PublicOfferResponse;
    text: Translations['publicOffer'];
    fmt: (amount: number) => string;
    fmtDate: (date: string) => string;
    offerLanguageLabel: string;

    isActionable: boolean;
    isCancelled: boolean;
    showAccepted: boolean;
    showRejected: boolean;
    showActions: boolean;
    actionState: PublicOfferActionState;

    isAccepting: boolean;
    handleAccept: () => void;

    showRejectModal: boolean;
    openRejectModal: () => void;
    closeRejectModal: () => void;
    rejectionNote: string;
    setRejectionNote: (value: string) => void;
    handleRejectSubmit: (event: FormEvent<HTMLFormElement>) => void;
    isRejecting: boolean;
}

export const PublicOfferContext = createContext<PublicOfferContextValue | undefined>(undefined);
