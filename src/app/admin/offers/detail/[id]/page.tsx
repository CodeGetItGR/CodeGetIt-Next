'use client'

import {useState, useMemo, useCallback, type FormEvent, type ChangeEvent, use} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { offerApi, type CreateLineItemPayload, type UpdateLineItemPayload } from '@/api/offers';
import { queryKeys } from '@/api/queryKeys';
import { EntityAuxPanels, StatusBadge } from '@/components';
import { useEntityDraftState, useApiErrorState } from '@/hooks';
import type { OfferLineItemResponse } from '@/api';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import Link from "next/link";

interface OfferFormState {
    title: string;
    description: string;
    recipientName: string;
    recipientEmail: string;
    priceAmount: string;
    taxRate: string;
    currency: string;
    validUntil: string;
}

const defaultFormState: OfferFormState = {
    title: '',
    description: '',
    recipientName: '',
    recipientEmail: '',
    priceAmount: '',
    taxRate: '',
    currency: 'EUR',
    validUntil: '',
};

function toIsoDateInput(value?: string | null): string {
    if (!value) return '';
    return value.slice(0, 10);
}

interface LineItemFormState {
    description: string;
    quantity: string;
    unitPrice: string;
    taxRate: string;
    sortOrder: string;
}

const defaultLineItemFormState: LineItemFormState = {
    description: '',
    quantity: '1',
    unitPrice: '',
    taxRate: '',
    sortOrder: '',
};

type Params = {
    id:string
}

type Props = {
    params : Params
}


export default function OfferDetailPage({params}: Props) {
    const queryClient = useQueryClient();
    const { errorMessage, setApiError, clearError } = useApiErrorState();
    const [showLineItemForm, setShowLineItemForm] = useState(false);
    const [editingLineItemId, setEditingLineItemId] = useState<string | null>(null);
    const [lineItemFormState, setLineItemFormState] = useState<LineItemFormState>(defaultLineItemFormState);
    const [showReviseReason, setShowReviseReason] = useState(false);
    const [reviseReason, setReviseReason] = useState('');
    const [showCancelReason, setShowCancelReason] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    // @ts-expect-error - Next.js 13 app router params typing is weird
    const {id} = use<Params>(params)

    const offerQuery = useQuery({
        queryKey: queryKeys.offers.detail(id),
        queryFn: () => offerApi.getById(id),
        enabled: Boolean(id),
    });

    const submissionsQuery = useQuery({
        queryKey: ['offer-submissions', id],
        queryFn: () => offerApi.getSubmissions(id),
        enabled: Boolean(id),
    });

    const baseFormState = useMemo<OfferFormState>(() => {
        const offer = offerQuery.data;
        return {
            ...defaultFormState,
            title: offer?.title ?? '',
            description: offer?.description || '',
            recipientName: offer?.recipientName || '',
            recipientEmail: offer?.recipientEmail ?? '',
            priceAmount: typeof offer?.priceAmount === 'number' ? String(offer.priceAmount) : '',
            taxRate: typeof offer?.taxRate === 'number' ? String(offer.taxRate) : '',
            currency: offer?.currency || 'EUR',
            validUntil: toIsoDateInput(offer?.validUntil),
        };
    }, [offerQuery.data]);

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
                reason: 'Discarded before sending',
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

    // Handlers
    const handleUpdate = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            await updateMutation.mutateAsync();
        },
        [updateMutation]
    );

    const handleTitleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            handleFieldChange('title', event.target.value);
        },
        [handleFieldChange]
    );

    const handleRecipientNameChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            handleFieldChange('recipientName', event.target.value);
        },
        [handleFieldChange]
    );

    const handleRecipientEmailChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            handleFieldChange('recipientEmail', event.target.value);
        },
        [handleFieldChange]
    );

    const handleCurrencyChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            handleFieldChange('currency', event.target.value.toUpperCase());
        },
        [handleFieldChange]
    );

    const handlePriceAmountChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            handleFieldChange('priceAmount', event.target.value);
        },
        [handleFieldChange]
    );

    const handleTaxRateChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            handleFieldChange('taxRate', event.target.value);
        },
        [handleFieldChange]
    );

    const handleValidUntilChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            handleFieldChange('validUntil', event.target.value);
        },
        [handleFieldChange]
    );

    const handleDescriptionChange = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => {
            handleFieldChange('description', event.target.value);
        },
        [handleFieldChange]
    );

    const handleSend = useCallback(() => {
        sendMutation.mutate();
    }, [sendMutation]);

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

    const handleDeleteLineItem = useCallback(
        (itemId: string) => {
            if (confirm('Are you sure you want to delete this line item?')) {
                deleteLineItemMutation.mutate(itemId);
            }
        },
        [deleteLineItemMutation]
    );

    const handleCancel = useCallback(() => {
        setShowCancelReason(true);
    }, []);

    const handleRevise = useCallback(() => {
        setShowReviseReason(true);
    }, []);

    const handleConfirmRevise = useCallback(() => {
        reviseMutation.mutate();
    }, [reviseMutation]);

    const handleConfirmCancel = useCallback(() => {
        cancelMutation.mutate();
    }, [cancelMutation]);

    const handleRejectStatus = useCallback(() => {
        if (confirm('Discard this draft offer?')) {
            rejectStatusMutation.mutate();
        }
    }, [rejectStatusMutation]);

    if (offerQuery.isLoading) {
        return <p className="text-sm text-gray-500">Loading offer...</p>;
    }

    if (!offerQuery.data) {
        return <p className="text-sm text-gray-500">Offer not found.</p>;
    }

    const offer = offerQuery.data;
    const isDraft = offer.status === 'DRAFT';
    const isSent = offer.status === 'SENT';
    const isRejected = offer.status === 'REJECTED_BY_CLIENT';
    const isEditable = isDraft;
    const publicOfferUrl = `/offers/${offer.publicToken}`;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm tracking-[0.16em] text-gray-500 uppercase">Offer detail</p>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">{offer.title}</h2>
                    <div className="mt-2 flex items-center gap-2">
                        <StatusBadge value={offer.status} />
                        {offer.revisionNumber > 0 && <span className="text-sm text-gray-600">Rev {offer.revisionNumber}</span>}
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href={publicOfferUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Preview public view
                    </Link>
                    <Link href="/admin/offers" className="text-sm font-medium text-gray-700 underline">
                        Back to offers
                    </Link>
                </div>
            </div>

            {errorMessage && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorMessage}</p>}

            {offer.rejectionNote && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <p className="text-sm font-semibold text-orange-900">Client feedback:</p>
                    <p className="mt-2 text-sm text-orange-800">{offer.rejectionNote}</p>
                </div>
            )}

            {/* Sticky section nav */}
            <nav className="sticky top-0 z-10 -mx-1 flex gap-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white/90 px-3 py-2 backdrop-blur">
                {[
                    { label: 'Actions', href: '#offer-actions' },
                    { label: 'Details', href: '#offer-details' },
                    ...(isEditable ? [{ label: 'Line Items', href: '#offer-lineitems' }] : []),
                    { label: 'History', href: '#offer-history' },
                    { label: 'Notes & Audit', href: '#offer-aux' },
                ].map(({ label, href }) => (
                    <a
                        key={href}
                        href={href}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                        {label}
                    </a>
                ))}
            </nav>

            {/* Actions */}
            <section id="offer-actions" className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
                <p className="mt-0.5 text-sm text-gray-500">
                    Status: <span className="font-medium text-gray-700">{offer.status.replace(/_/g, ' ')}</span>
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {isDraft && (
                        <>
                            <button
                                onClick={handleSend}
                                disabled={sendMutation.isPending}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {sendMutation.isPending ? 'Sending...' : 'Send to client'}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                            >
                                Cancel offer
                            </button>
                            <button
                                onClick={handleRejectStatus}
                                className="rounded-lg border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100"
                            >
                                Discard draft
                            </button>
                        </>
                    )}
                    {isSent && (
                        <button onClick={handleCancel} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">
                            Cancel offer
                        </button>
                    )}
                    {isRejected && (
                        <button onClick={handleRevise} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Revise to draft
                        </button>
                    )}
                </div>

                {showCancelReason && (
                    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Cancel reason (optional)</label>
                        <Textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} rows={3} className="mb-3 w-full" />
                        <div className="flex gap-2">
                            <button
                                onClick={handleConfirmCancel}
                                disabled={cancelMutation.isPending}
                                className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
                            >
                                Confirm cancel
                            </button>
                            <button
                                onClick={() => setShowCancelReason(false)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}

                {showReviseReason && (
                    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Revision reason (optional)</label>
                        <Textarea
                            value={reviseReason}
                            onChange={(e) => setReviseReason(e.target.value)}
                            placeholder="e.g., Adjusted pricing based on client feedback"
                            rows={3}
                            className="mb-3 w-full"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleConfirmRevise}
                                disabled={reviseMutation.isPending}
                                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                Confirm revise
                            </button>
                            <button
                                onClick={() => setShowReviseReason(false)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* ls form  */}
            <section id="offer-details" className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900">Offer details</h3>
                <p className="mt-1 text-sm text-gray-600">{isEditable ? 'DRAFT offers can be edited and sent.' : 'View-only mode.'}</p>

                <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleUpdate}>
                    <Input label="Title *" value={formState.title} onChange={handleTitleChange} disabled={!isEditable} required />
                    <Input label="Recipient Name" value={formState.recipientName} onChange={handleRecipientNameChange} disabled={!isEditable} />
                    <Input
                        label="Recipient Email *"
                        type="email"
                        value={formState.recipientEmail}
                        onChange={handleRecipientEmailChange}
                        disabled={!isEditable}
                        required
                    />
                    <Input label="Currency" value={formState.currency} onChange={handleCurrencyChange} disabled={!isEditable} maxLength={5} />
                    <Input
                        label="Price amount"
                        type="number"
                        step="0.01"
                        value={formState.priceAmount}
                        onChange={handlePriceAmountChange}
                        disabled={!isEditable}
                    />
                    <Input
                        label="Tax rate (%)"
                        type="number"
                        step="0.01"
                        value={formState.taxRate}
                        onChange={handleTaxRateChange}
                        disabled={!isEditable}
                    />
                    <Input label="Valid until" type="date" value={formState.validUntil} onChange={handleValidUntilChange} disabled={!isEditable} />
                    <div className="md:col-span-2">
                        <Textarea
                            label="Description"
                            value={formState.description}
                            onChange={handleDescriptionChange}
                            disabled={!isEditable}
                            rows={4}
                        />
                    </div>
                    {isEditable && (
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                            >
                                {updateMutation.isPending ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>
                    )}
                </form>
            </section>

            <section id="offer-lineitems" className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            {isEditable
                                ? 'Add tasks and deliverables to this offer.'
                                : 'Deliverables are shown below in read-only mode for non-draft offers.'}
                        </p>
                    </div>
                    {isEditable && (
                        <button
                            onClick={handleAddLineItem}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            + Add item
                        </button>
                    )}
                </div>

                {isEditable && showLineItemForm && (
                    <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <h4 className="mb-3 font-semibold text-gray-900">{editingLineItemId ? 'Edit line item' : 'New line item'}</h4>
                        <div className="grid gap-3 md:grid-cols-2">
                            <Input
                                label="Description *"
                                value={lineItemFormState.description}
                                onChange={(e) => handleLineItemFieldChange('description', e.target.value)}
                                required
                            />
                            <Input
                                label="Quantity"
                                type="number"
                                step="0.01"
                                value={lineItemFormState.quantity}
                                onChange={(e) => handleLineItemFieldChange('quantity', e.target.value)}
                                required
                            />
                            <Input
                                label="Unit Price"
                                type="number"
                                step="0.01"
                                value={lineItemFormState.unitPrice}
                                onChange={(e) => handleLineItemFieldChange('unitPrice', e.target.value)}
                                required
                            />
                            <Input
                                label="Tax Rate (%)"
                                type="number"
                                step="0.01"
                                value={lineItemFormState.taxRate}
                                onChange={(e) => handleLineItemFieldChange('taxRate', e.target.value)}
                            />
                            <Input
                                label="Sort Order"
                                type="number"
                                value={lineItemFormState.sortOrder}
                                onChange={(e) => handleLineItemFieldChange('sortOrder', e.target.value)}
                            />
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={handleSaveLineItem}
                                disabled={createLineItemMutation.isPending || updateLineItemMutation.isPending}
                                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {createLineItemMutation.isPending || updateLineItemMutation.isPending ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowLineItemForm(false);
                                    setLineItemFormState(defaultLineItemFormState);
                                }}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {offer.lineItems.length === 0 ? (
                    <p className="text-sm text-gray-500">No line items yet.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Description</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Qty</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Unit Price</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Total</th>
                                    {isEditable && <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Action</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {offer.lineItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-900">{item.description}</td>
                                        <td className="px-4 py-3 text-right text-gray-600">{item.quantity}</td>
                                        <td className="px-4 py-3 text-right text-gray-600">
                                            {item.unitPrice.toFixed(2)} {offer.currency}
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                                            {item.lineTotal.toFixed(2)} {offer.currency}
                                        </td>
                                        {isEditable && (
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleEditLineItem(item)}
                                                    className="mr-2 text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLineItem(item.id)}
                                                    disabled={deleteLineItemMutation.isPending}
                                                    className="text-sm text-rose-600 hover:text-rose-800"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {offer.lineItems.length > 0 && (
                    <div className="mt-4 ml-auto max-w-xs rounded-lg bg-gray-50 p-4">
                        <div className="mb-2 flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">
                                {(offer.subtotalAmount || 0).toFixed(2)} {offer.currency}
                            </span>
                        </div>
                        {typeof offer.taxAmount === 'number' && offer.taxAmount > 0 && (
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="text-gray-600">Tax ({offer.taxRate}%):</span>
                                <span className="font-medium">
                                    {offer.taxAmount.toFixed(2)} {offer.currency}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between border-t border-gray-300 pt-2 font-semibold">
                            <span>Total:</span>
                            <span>
                                {(offer.totalAmount || 0).toFixed(2)} {offer.currency}
                            </span>
                        </div>
                    </div>
                )}
            </section>

            {/* Submission history */}
            {submissionsQuery.data && submissionsQuery.data.length > 0 && (
                <section id="offer-history" className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Submission history</h3>
                    <div className="space-y-3">
                        {submissionsQuery.data.map((submission) => (
                            <div key={submission.id} className="flex gap-4 border-b border-gray-200 py-3 last:border-b-0">
                                <div className="shrink-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                                        <span className="text-xs font-semibold text-gray-700">{submission.revisionNumber}</span>
                                    </div>
                                </div>
                                <div className="grow">
                                    <p className="text-sm font-medium text-gray-900">{submission.action}</p>
                                    {submission.note && <p className="mt-1 text-sm text-gray-600">{submission.note}</p>}
                                    <p className="mt-1 text-xs text-gray-500">
                                        {new Date(submission.createdAt || '').toLocaleDateString()} at{' '}
                                        {new Date(submission.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Notes & Audit */}
            <section id="offer-aux">
                <EntityAuxPanels entityType="OFFER" entityId={offer.id} />
            </section>
        </div>
    );
};
