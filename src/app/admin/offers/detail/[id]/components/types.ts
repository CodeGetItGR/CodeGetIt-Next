import type { OfferCurrency, OfferLanguage } from '@/api';

export interface OfferFormState {
    title: string;
    description: string;
    recipientName: string;
    recipientEmail: string;
    priceAmount: string;
    taxRate: string;
    currency: OfferCurrency | '';
    language: OfferLanguage | '';
    validUntil: string;
}

export const defaultFormState: OfferFormState = {
    title: '',
    description: '',
    recipientName: '',
    recipientEmail: '',
    priceAmount: '',
    taxRate: '',
    currency: 'EUR',
    language: '',
    validUntil: '',
};

export function toIsoDateInput(value?: string | null): string {
    if (!value) return '';
    return value.slice(0, 10);
}

export interface LineItemFormState {
    description: string;
    quantity: string;
    unitPrice: string;
    taxRate: string;
    sortOrder: string;
}

export const defaultLineItemFormState: LineItemFormState = {
    description: '',
    quantity: '1',
    unitPrice: '',
    taxRate: '',
    sortOrder: '',
};
