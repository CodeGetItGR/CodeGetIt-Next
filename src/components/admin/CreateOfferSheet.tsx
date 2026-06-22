import { useCallback, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {BudgetFlexibility, BudgetRange, CreateOfferPayload, OfferLanguage, offerApi, UUID} from "@/api";
import {useApiErrorState, useSettingsOptions} from "@/hooks";
import {Input, SlideSheet, Textarea} from "@/components";


interface OfferPricingContext {
    budgetRange: BudgetRange;
    budgetFlexibility?: BudgetFlexibility;
}

interface CreateOfferSheetProps {
    isOpen: boolean;
    onClose: () => void;
    /** Pre-fill if opened from a request detail page */
    defaultRequestId?: UUID;
    /** Pre-fill from the request's captured language preference — the admin can still override it. */
    defaultLanguage?: OfferLanguage;
    pricingContext?: OfferPricingContext;
    onCreated?: () => void;
}

function getBudgetRangeLabel(range: BudgetRange): string {
    switch (range) {
        case 'UNDER_2K':
            return 'Under 2K';
        case 'FROM_2K_TO_5K':
            return '2K to 5K';
        case 'FROM_5K_TO_10K':
            return '5K to 10K';
        case 'FROM_10K_TO_25K':
            return '10K to 25K';
        case 'ABOVE_25K':
            return 'Above 25K';
        case 'UNKNOWN':
            return 'Unknown';
        default:
            return range;
    }
}

function getFlexibilityText(flexibility?: BudgetFlexibility): string {
    if (!flexibility || flexibility === 'UNKNOWN') {
        return 'Budget flexibility was not specified.';
    }

    if (flexibility === 'FIXED') {
        return 'Requester marked budget as fixed. Keep pricing close to the selected range.';
    }

    if (flexibility === 'SOMEWHAT_FLEXIBLE') {
        return 'Requester is somewhat flexible. A modest stretch beyond range may still be acceptable with clear scope value.';
    }

    return 'Requester is flexible. You can propose options or phased pricing around this range.';
}

const blankForm = (): CreateOfferPayload => ({
    requestId: '',
    title: '',
    description: '',
    recipientEmail: '',
    recipientName: '',
    priceAmount: undefined,
    taxRate: undefined,
    currency: 'EUR',
    language: 'EN',
    validUntil: undefined,
});

export const CreateOfferSheet = ({ isOpen, onClose, defaultRequestId, defaultLanguage, pricingContext, onCreated }: CreateOfferSheetProps) => {
    const [form, setForm] = useState<CreateOfferPayload>(() => ({
        ...blankForm(),
        requestId: defaultRequestId ?? '',
        language: defaultLanguage ?? 'EN',
    }));
    const [validUntilInput, setValidUntilInput] = useState('');
    const [priceInput, setPriceInput] = useState('');
    const { errorMessage, setApiError, clearError } = useApiErrorState();
    const queryClient = useQueryClient();
    const { options: languageOptions } = useSettingsOptions({ groupKey: 'offer.language', scope: 'public', onlyEnabled: true });
    const { options: currencyOptions } = useSettingsOptions({ groupKey: 'offer.currency', scope: 'public', onlyEnabled: true });

    const createMutation = useMutation({
        mutationFn: () =>
            offerApi.create({
                ...form,
                priceAmount: priceInput ? Number(priceInput) : undefined,
                validUntil: validUntilInput ? new Date(validUntilInput).toISOString() : undefined,
            }),
        onSuccess: async () => {
            clearError();
            const reset = { ...blankForm(), requestId: defaultRequestId ?? '', language: defaultLanguage ?? 'EN' };
            setForm(reset);
            setValidUntilInput('');
            setPriceInput('');
            await queryClient.invalidateQueries({ queryKey: ['offers'] });
            onCreated?.();
            onClose();
        },
        onError: (error) => setApiError(error),
    });

    const setField = useCallback(<TKey extends keyof CreateOfferPayload>(key: TKey, value: CreateOfferPayload[TKey]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            createMutation.mutate();
        },
        [createMutation]
    );

    const handleClose = useCallback(() => {
        const reset = { ...blankForm(), requestId: defaultRequestId ?? '', language: defaultLanguage ?? 'EN' };
        setForm(reset);
        setValidUntilInput('');
        setPriceInput('');
        clearError();
        onClose();
    }, [clearError, defaultRequestId, defaultLanguage, onClose]);

    const handleRequestIdChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setField('requestId', event.target.value);
        },
        [setField]
    );

    const handleTitleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setField('title', event.target.value);
        },
        [setField]
    );

    const handlePriceInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setPriceInput(event.target.value);
    }, []);

    const handleCurrencyChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            setField('currency', event.target.value as CreateOfferPayload['currency']);
        },
        [setField]
    );

    const handleLanguageChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            setField('language', event.target.value as CreateOfferPayload['language']);
        },
        [setField]
    );

    const handleValidUntilChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setValidUntilInput(event.target.value);
    }, []);

    const handleDescriptionChange = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => {
            setField('description', event.target.value);
        },
        [setField]
    );

    const pricingTips = useMemo(() => {
        if (!pricingContext) {
            return null;
        }

        return {
            budgetLabel: getBudgetRangeLabel(pricingContext.budgetRange),
            flexibilityText: getFlexibilityText(pricingContext.budgetFlexibility),
            showRangeTip: pricingContext.budgetRange !== 'UNKNOWN',
        };
    }, [pricingContext]);

    return (
        <SlideSheet
            isOpen={isOpen}
            onClose={handleClose}
            title="New offer"
            description="Create a commercial offer for an approved request."
            className="max-w-3xl"
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                    <Input
                        label="Request ID"
                        value={form.requestId}
                        onChange={handleRequestIdChange}
                        placeholder="UUID of the target request"
                        disabled={Boolean(defaultRequestId)}
                        className={defaultRequestId ? 'border-gray-200 bg-gray-100' : ''}
                        required
                    />

                    <Input
                        label="Offer title"
                        value={form.title}
                        onChange={handleTitleChange}
                        placeholder="e.g. Full website redesign – Phase 1"
                        required
                    />

                    <Input
                        label="Recipient Email *"
                        type="email"
                        value={form.recipientEmail ?? ''}
                        onChange={(e) => setField('recipientEmail', e.target.value)}
                        placeholder="client@example.com"
                        required
                    />

                    <Input
                        label="Recipient Name"
                        value={form.recipientName ?? ''}
                        onChange={(e) => setField('recipientName', e.target.value)}
                        placeholder="e.g. John Doe"
                    />

                    <div className="grid grid-cols-2 gap-3 md:col-span-2">
                        <Input
                            label="Price amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={priceInput}
                            onChange={handlePriceInputChange}
                            placeholder="1200.00"
                        />
                        <div>
                            <label className="mb-1 block text-sm text-gray-600">Currency</label>
                            <select
                                value={form.currency ?? ''}
                                onChange={handleCurrencyChange}
                                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                            >
                                {currencyOptions.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Input
                        label="Tax Rate (%)"
                        type="number"
                        step="0.01"
                        value={form.taxRate ?? ''}
                        onChange={(e) => setField('taxRate', e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="20"
                    />

                    <div>
                        <label className="mb-1 block text-sm text-gray-600">Language *</label>
                        <select
                            value={form.language}
                            onChange={handleLanguageChange}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                            required
                        >
                            {languageOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {pricingTips && (
                        <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-800 md:col-span-2">
                            <p className="font-medium">Pricing tip from request context</p>
                            <p className="mt-1">Requested budget range: {pricingTips.budgetLabel}</p>
                            <p className="mt-1">{pricingTips.flexibilityText}</p>
                            {pricingTips.showRangeTip && (
                                <p className="mt-1 text-blue-700">
                                    Try anchoring this offer close to the stated range, then justify any deviations in the description.
                                </p>
                            )}
                        </div>
                    )}

                    <Input label="Valid until" type="date" value={validUntilInput} onChange={handleValidUntilChange} />

                    <div className="md:col-span-2">
                        <Textarea
                            label="Description (optional)"
                            value={form.description ?? ''}
                            onChange={handleDescriptionChange}
                            rows={4}
                            placeholder="Scope, deliverables, terms..."
                        />
                    </div>
                </div>

                {errorMessage && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorMessage}</p>}

                <div className="flex gap-2 pt-2">
                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="flex-1 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                    >
                        {createMutation.isPending ? 'Creating...' : 'Create offer'}
                    </button>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </SlideSheet>
    );
};
