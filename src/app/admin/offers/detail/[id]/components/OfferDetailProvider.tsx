'use client'

import { useCallback, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { offerApi, type CreateLineItemPayload, type UpdateLineItemPayload } from '@/api/offers';
import type { OfferLineItemResponse, OfferResponse } from '@/api/types';
import { queryKeys } from '@/api/queryKeys';
import { useEntityDraftState, useApiErrorState, useSettingsOptions } from '@/hooks';
import type { Translations } from '@/i18n/types';
import { OfferDetailContext, type OfferDetailContextValue } from './offer-detail-context';
import { defaultFormState, defaultLineItemFormState, toIsoDateInput, type LineItemFormState, type OfferFormState } from './types';

interface OfferDetailProviderProps {
    id: string;
    offer: OfferResponse;
    text: Translations['admin']['offers']['detail'];
    children: ReactNode;
}

export const OfferDetailProvider = ({ id, offer, text, children }: OfferDetailProviderProps) => {
    const queryClient = useQueryClient();
    const { errorMessage, setApiError, clearError } = useApiErrorState();

    const [showLineItemForm, setShowLineItemForm] = useState(false);
    const [editingLineItemId, setEditingLineItemId] = useState<string | null>(null);
    const [lineItemFormState, setLineItemFormState] = useState<LineItemFormState>(defaultLineItemFormState);
    const [showReviseReason, setShowReviseReason] = useState(false);
    const [reviseReason, setReviseReason] = useState('');
    const [showCancelReason, setShowCancelReason] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const { options: languageOptions } = useSettingsOptions({ groupKey: 'offer.language', scope: 'public', onlyEnabled: true });
    const { options: currencyOptions } = useSettingsOptions({ groupKey: 'offer.currency', scope: 'public', onlyEnabled: true });

    const submissionsQuery = useQuery({
        queryKey: ['offer-submissions', id],
        queryFn: () => offerApi.getSubmissions(id),
        enabled: Boolean(id),
    });

    const baseFormState = useMemo<OfferFormState>(
        () => ({
            ...defaultFormState,
            title: offer.title ?? '',
            description: offer.description || '',
            recipientName: offer.recipientName || '',
            recipientEmail: offer.recipientEmail ?? '',
            priceAmount: typeof offer.priceAmount === 'number' ? String(offer.priceAmount) : '',
            taxRate: typeof offer.taxRate === 'number' ? String(offer.taxRate) : '',
            currency: offer.currency || 'EUR',
            language: offer.language || '',
            validUntil: toIsoDateInput(offer.validUntil),
        }),
        [offer]
    );

    const { state: formState, setField: handleFieldChange, resetDraft: resetFormDraft } = useEntityDraftState<OfferFormState>(id, baseFormState);

    const refreshOfferData = useCallback(async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: queryKeys.offers.detail(id) }),
            queryClient.invalidateQueries({ queryKey: queryKeys.offers.root }),
            queryClient.invalidateQueries({ queryKey: ['offer-submissions', id] }),
        ]);
    }, [id, queryClient]);

    const updateMutation = useMutation({
        mutationFn: () =>
            offerApi.update(id, {
                title: formState.title,
                description: formState.description || undefined,
                recipientName: formState.recipientName || undefined,
                recipientEmail: formState.recipientEmail,
                priceAmount: formState.priceAmount ? Number(formState.priceAmount) : undefined,
                taxRate: formState.taxRate ? Number(formState.taxRate) : undefined,
                currency: formState.currency || undefined,
                language: formState.language || undefined,
                validUntil: formState.validUntil ? new Date(formState.validUntil).toISOString() : undefined,
            }),
        onSuccess: async () => {
            clearError();
            resetFormDraft();
            await refreshOfferData();
        },
        onError: (error) => setApiError(error),
    });

    const sendMutation = useMutation({
        mutationFn: () => offerApi.send(id),
        onSuccess: async () => {
            clearError();
            await refreshOfferData();
        },
        onError: (error) => setApiError(error),
    });

    const reviseMutation = useMutation({
        mutationFn: () => offerApi.revise(id, reviseReason ? { reason: reviseReason } : undefined),
        onSuccess: async () => {
            clearError();
            setReviseReason('');
            setShowReviseReason(false);
            await refreshOfferData();
        },
        onError: (error) => setApiError(error),
    });

    const cancelMutation = useMutation({
        mutationFn: () => offerApi.cancel(id, cancelReason ? { reason: cancelReason } : undefined),
        onSuccess: async () => {
            clearError();
            setCancelReason('');
            setShowCancelReason(false);
            await refreshOfferData();
        },
        onError: (error) => setApiError(error),
    });

    const rejectStatusMutation = useMutation({
        mutationFn: () =>
            offerApi.changeStatus(id, {
                targetStatus: 'REJECTED',
                reason: text.actions.discardedBeforeSendingReason,
            }),
        onSuccess: async () => {
            clearError();
            await refreshOfferData();
        },
        onError: (error) => setApiError(error),
    });

    const createLineItemMutation = useMutation({
        mutationFn: (payload: CreateLineItemPayload) => offerApi.createLineItem(id, payload),
        onSuccess: async () => {
            clearError();
            setLineItemFormState(defaultLineItemFormState);
            setShowLineItemForm(false);
            await refreshOfferData();
        },
        onError: (error) => setApiError(error),
    });

    const updateLineItemMutation = useMutation({
        mutationFn: (payload: UpdateLineItemPayload) => offerApi.updateLineItem(id, editingLineItemId || '', payload),
        onSuccess: async () => {
            clearError();
            setLineItemFormState(defaultLineItemFormState);
            setEditingLineItemId(null);
            await refreshOfferData();
        },
        onError: (error) => setApiError(error),
    });

    const deleteLineItemMutation = useMutation({
        mutationFn: (itemId: string) => offerApi.deleteLineItem(id, itemId),
        onSuccess: async () => {
            clearError();
            await refreshOfferData();
        },
        onError: (error) => setApiError(error),
    });

    const handleUpdate = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            await updateMutation.mutateAsync();
        },
        [updateMutation]
    );

    const handleTitleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => handleFieldChange('title', event.target.value),
        [handleFieldChange]
    );

    const handleRecipientNameChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => handleFieldChange('recipientName', event.target.value),
        [handleFieldChange]
    );

    const handleRecipientEmailChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => handleFieldChange('recipientEmail', event.target.value),
        [handleFieldChange]
    );

    const handleCurrencyChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => handleFieldChange('currency', event.target.value as OfferFormState['currency']),
        [handleFieldChange]
    );

    const handleLanguageChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => handleFieldChange('language', event.target.value as OfferFormState['language']),
        [handleFieldChange]
    );

    const handlePriceAmountChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => handleFieldChange('priceAmount', event.target.value),
        [handleFieldChange]
    );

    const handleTaxRateChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => handleFieldChange('taxRate', event.target.value),
        [handleFieldChange]
    );

    const handleValidUntilChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => handleFieldChange('validUntil', event.target.value),
        [handleFieldChange]
    );

    const handleDescriptionChange = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => handleFieldChange('description', event.target.value),
        [handleFieldChange]
    );

    const handleSend = useCallback(() => sendMutation.mutate(), [sendMutation]);

    const handleLineItemFieldChange = useCallback((field: keyof LineItemFormState, value: string) => {
        setLineItemFormState((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleAddLineItem = useCallback(() => {
        setEditingLineItemId(null);
        setLineItemFormState(defaultLineItemFormState);
        setShowLineItemForm(true);
    }, []);

    const handleEditLineItem = useCallback((item: OfferLineItemResponse) => {
        setEditingLineItemId(item.id);
        setLineItemFormState({
            description: item.description,
            quantity: String(item.quantity),
            unitPrice: String(item.unitPrice),
            taxRate: item.taxRate ? String(item.taxRate) : '',
            sortOrder: String(item.sortOrder),
        });
        setShowLineItemForm(true);
    }, []);

    const handleSaveLineItem = useCallback(() => {
        const payload: CreateLineItemPayload = {
            description: lineItemFormState.description,
            quantity: Number(lineItemFormState.quantity),
            unitPrice: Number(lineItemFormState.unitPrice),
            taxRate: lineItemFormState.taxRate ? Number(lineItemFormState.taxRate) : undefined,
            sortOrder: lineItemFormState.sortOrder ? Number(lineItemFormState.sortOrder) : undefined,
        };

        if (editingLineItemId) {
            updateLineItemMutation.mutate(payload as UpdateLineItemPayload);
        } else {
            createLineItemMutation.mutate(payload);
        }
    }, [lineItemFormState, editingLineItemId, createLineItemMutation, updateLineItemMutation]);

    const handleCancelLineItemForm = useCallback(() => {
        setShowLineItemForm(false);
        setLineItemFormState(defaultLineItemFormState);
    }, []);

    const handleDeleteLineItem = useCallback(
        (itemId: string) => {
            if (confirm(text.actions.deleteLineItemConfirm)) {
                deleteLineItemMutation.mutate(itemId);
            }
        },
        [deleteLineItemMutation, text.actions.deleteLineItemConfirm]
    );

    const handleCancel = useCallback(() => setShowCancelReason(true), []);
    const closeCancelReason = useCallback(() => setShowCancelReason(false), []);
    const handleRevise = useCallback(() => setShowReviseReason(true), []);
    const closeReviseReason = useCallback(() => setShowReviseReason(false), []);
    const handleConfirmRevise = useCallback(() => reviseMutation.mutate(), [reviseMutation]);
    const handleConfirmCancel = useCallback(() => cancelMutation.mutate(), [cancelMutation]);

    const handleRejectStatus = useCallback(() => {
        if (confirm(text.actions.discardDraftConfirm)) {
            rejectStatusMutation.mutate();
        }
    }, [rejectStatusMutation, text.actions.discardDraftConfirm]);

    const isDraft = offer.status === 'DRAFT';
    const isSent = offer.status === 'SENT';
    const isRejected = offer.status === 'REJECTED_BY_CLIENT';
    const isEditable = isDraft;
    const publicOfferUrl = `/offers/${offer.publicToken}`;

    const value = useMemo<OfferDetailContextValue>(
        () => ({
            offer,
            text,
            errorMessage,
            isDraft,
            isSent,
            isRejected,
            isEditable,
            publicOfferUrl,
            formState,
            languageOptions,
            currencyOptions,
            handleTitleChange,
            handleRecipientNameChange,
            handleRecipientEmailChange,
            handleCurrencyChange,
            handleLanguageChange,
            handlePriceAmountChange,
            handleTaxRateChange,
            handleValidUntilChange,
            handleDescriptionChange,
            handleUpdate,
            isSaving: updateMutation.isPending,
            handleSend,
            isSending: sendMutation.isPending,
            showCancelReason,
            cancelReason,
            setCancelReason,
            handleCancel,
            closeCancelReason,
            handleConfirmCancel,
            isCancelling: cancelMutation.isPending,
            showReviseReason,
            reviseReason,
            setReviseReason,
            handleRevise,
            closeReviseReason,
            handleConfirmRevise,
            isRevising: reviseMutation.isPending,
            handleRejectStatus,
            lineItemFormState,
            showLineItemForm,
            editingLineItemId,
            handleLineItemFieldChange,
            handleAddLineItem,
            handleEditLineItem,
            handleSaveLineItem,
            handleCancelLineItemForm,
            handleDeleteLineItem,
            isSavingLineItem: createLineItemMutation.isPending || updateLineItemMutation.isPending,
            isDeletingLineItem: deleteLineItemMutation.isPending,
            submissions: submissionsQuery.data,
        }),
        [
            offer,
            text,
            errorMessage,
            isDraft,
            isSent,
            isRejected,
            isEditable,
            publicOfferUrl,
            formState,
            languageOptions,
            currencyOptions,
            handleTitleChange,
            handleRecipientNameChange,
            handleRecipientEmailChange,
            handleCurrencyChange,
            handleLanguageChange,
            handlePriceAmountChange,
            handleTaxRateChange,
            handleValidUntilChange,
            handleDescriptionChange,
            handleUpdate,
            updateMutation.isPending,
            handleSend,
            sendMutation.isPending,
            showCancelReason,
            cancelReason,
            handleCancel,
            closeCancelReason,
            handleConfirmCancel,
            cancelMutation.isPending,
            showReviseReason,
            reviseReason,
            handleRevise,
            closeReviseReason,
            handleConfirmRevise,
            reviseMutation.isPending,
            handleRejectStatus,
            lineItemFormState,
            showLineItemForm,
            editingLineItemId,
            handleLineItemFieldChange,
            handleAddLineItem,
            handleEditLineItem,
            handleSaveLineItem,
            handleCancelLineItemForm,
            handleDeleteLineItem,
            createLineItemMutation.isPending,
            updateLineItemMutation.isPending,
            deleteLineItemMutation.isPending,
            submissionsQuery.data,
        ]
    );

    return <OfferDetailContext.Provider value={value}>{children}</OfferDetailContext.Provider>;
};
