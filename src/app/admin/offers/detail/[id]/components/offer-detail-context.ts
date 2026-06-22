import { createContext, type ChangeEvent, type FormEvent } from 'react';
import type { OfferLineItemResponse, OfferResponse, OfferSubmissionResponse } from '@/api';
import type { SettingsOptionItem } from '@/api/settings';
import type { Translations } from '@/i18n/types';
import type { LineItemFormState, OfferFormState } from './types';

export interface OfferDetailContextValue {
    offer: OfferResponse;
    text: Translations['admin']['offers']['detail'];
    errorMessage: string | null;

    isDraft: boolean;
    isSent: boolean;
    isRejected: boolean;
    isEditable: boolean;
    publicOfferUrl: string;

    // Details form
    formState: OfferFormState;
    languageOptions: SettingsOptionItem[];
    currencyOptions: SettingsOptionItem[];
    handleTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleRecipientNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleRecipientEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleCurrencyChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    handleLanguageChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    handlePriceAmountChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleTaxRateChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleValidUntilChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleDescriptionChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    handleUpdate: (event: FormEvent<HTMLFormElement>) => void;
    isSaving: boolean;

    // Actions
    handleSend: () => void;
    isSending: boolean;
    showCancelReason: boolean;
    cancelReason: string;
    setCancelReason: (value: string) => void;
    handleCancel: () => void;
    closeCancelReason: () => void;
    handleConfirmCancel: () => void;
    isCancelling: boolean;
    showReviseReason: boolean;
    reviseReason: string;
    setReviseReason: (value: string) => void;
    handleRevise: () => void;
    closeReviseReason: () => void;
    handleConfirmRevise: () => void;
    isRevising: boolean;
    handleRejectStatus: () => void;

    // Line items
    lineItemFormState: LineItemFormState;
    showLineItemForm: boolean;
    editingLineItemId: string | null;
    handleLineItemFieldChange: (field: keyof LineItemFormState, value: string) => void;
    handleAddLineItem: () => void;
    handleEditLineItem: (item: OfferLineItemResponse) => void;
    handleSaveLineItem: () => void;
    handleCancelLineItemForm: () => void;
    handleDeleteLineItem: (itemId: string) => void;
    isSavingLineItem: boolean;
    isDeletingLineItem: boolean;

    // Submission history
    submissions: OfferSubmissionResponse[] | undefined;
}

export const OfferDetailContext = createContext<OfferDetailContextValue | undefined>(undefined);
