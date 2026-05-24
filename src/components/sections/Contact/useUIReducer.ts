export type SubmitState = 'idle' | 'success' | 'error';

export interface UIState {
    currentStep: number;
    isSubmitting: boolean;
    submitState: SubmitState;
    errorText: string;
    submittedRequestId: string | null;
}

export type UIAction =
    | { type: 'RESET_MESSAGES' }
    | { type: 'NEXT_STEP'; maxSteps: number }
    | { type: 'PREVIOUS_STEP' }
    | { type: 'SET_STEP'; step: number }
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_SUCCESS'; requestId?: string }
    | { type: 'SUBMIT_ERROR'; errorText: string }
    | { type: 'RESET_ALL' };

export const initialUIState: UIState = {
    currentStep: 0,
    isSubmitting: false,
    submitState: 'idle',
    errorText: '',
    submittedRequestId: null,
};

export interface DetailedRequestFormState {
    title: string;
    requesterPhone: string;
    projectType: string;
    businessGoal: string;
    organizationName: string;
    industry: string;
    targetAudience: string;
    desiredStartWindow: string;
    targetLaunchWindow: string;
    budgetRange: string;
    budgetFlexibility: string;
    enterpriseInquiry: boolean;
    communicationPreference: string;
    legalOrBrandConstraints: string;
    dataSensitivity: string;
    priority: string;
}

export const blankDetailedRequest: DetailedRequestFormState = {
    title: '',
    requesterPhone: '',
    projectType: '',
    businessGoal: '',
    organizationName: '',
    industry: '',
    targetAudience: '',
    desiredStartWindow: '',
    targetLaunchWindow: '',
    budgetRange: '',
    budgetFlexibility: '',
    enterpriseInquiry: false,
    communicationPreference: '',
    legalOrBrandConstraints: '',
    dataSensitivity: '',
    priority: 'MEDIUM',
};

export function uiReducer(state: UIState, action: UIAction): UIState {
    switch (action.type) {
        case 'RESET_MESSAGES':
            return { ...state, submitState: 'idle', errorText: '', submittedRequestId: null };

        case 'NEXT_STEP':
            return {
                ...state,
                currentStep: Math.min(state.currentStep + 1, action.maxSteps - 1),
            };

        case 'PREVIOUS_STEP':
            return {
                ...state,
                currentStep: Math.max(state.currentStep - 1, 0),
            };

        case 'SET_STEP':
            return { ...state, currentStep: action.step };

        case 'SUBMIT_START':
            return { ...state, isSubmitting: true, submitState: 'idle', errorText: '' };

        case 'SUBMIT_SUCCESS':
            return {
                ...state,
                isSubmitting: false,
                submitState: 'success',
                submittedRequestId: action.requestId ?? null,
            };

        case 'SUBMIT_ERROR':
            return {
                ...state,
                isSubmitting: false,
                submitState: 'error',
                errorText: action.errorText,
            };

        case 'RESET_ALL':
            return initialUIState;

        default:
            return state;
    }
}
