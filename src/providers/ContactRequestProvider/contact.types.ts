import type { DetailedRequestFormState } from '../../components/sections/Contact/useUIReducer';

export interface ContactFormData {
    name: string;
    email: string;
    message: string;
    language: string;
}

export interface ContactOption {
    value: string;
    label: string;
}

export interface ContactOptions {
    projectTypeOptions: ContactOption[];
    desiredStartWindowOptions: ContactOption[];
    budgetRangeOptions: ContactOption[];
    budgetFlexibilityOptions: ContactOption[];
    communicationPreferenceOptions: ContactOption[];
    dataSensitivityOptions: ContactOption[];
    priorityOptions: ContactOption[];
    languageOptions?: ContactOption[];
}

export interface ContactFormState {
    formData: ContactFormData;
    detailedRequest: DetailedRequestFormState;
    useDetailedRequest: boolean;
    currentStep: number;
    isSubmitting: boolean;
    submitState: 'idle' | 'success' | 'error';
    submittedRequestId: string | null;
    errorText: string;
    fieldErrors: Record<string, string>;
    optionNotice: string;
    hasDetailedRequiredOptions: boolean;
}
