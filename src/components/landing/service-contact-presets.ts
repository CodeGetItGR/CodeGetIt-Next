import type { ContactRequestPreset } from '@/providers';
import type { DetailedRequestFormState } from '@/components/sections/Contact/useUIReducer';

type ServiceContactSelection = Pick<
    DetailedRequestFormState,
    'projectType' | 'desiredStartWindow' | 'budgetRange' | 'budgetFlexibility' | 'communicationPreference' | 'dataSensitivity' | 'priority'
>;

const serviceContactSelections: ReadonlyArray<ServiceContactSelection> = [
    {
        projectType: 'WEBSITE',
        desiredStartWindow: 'WITHIN_1_MONTH',
        budgetRange: 'FROM_2K_TO_5K',
        budgetFlexibility: 'FIXED',
        communicationPreference: 'EMAIL',
        dataSensitivity: 'NONE',
        priority: 'MEDIUM',
    },
    {
        projectType: 'WEB_APP',
        desiredStartWindow: 'WITHIN_3_MONTHS',
        budgetRange: 'FROM_5K_TO_10K',
        budgetFlexibility: 'SOMEWHAT_FLEXIBLE',
        communicationPreference: 'EMAIL',
        dataSensitivity: 'NONE',
        priority: 'HIGH',
    },
    {
        projectType: 'WEB_APP',
        desiredStartWindow: 'WITHIN_3_MONTHS',
        budgetRange: 'FROM_10K_TO_25K',
        budgetFlexibility: 'FLEXIBLE',
        communicationPreference: 'EMAIL',
        dataSensitivity: 'NONE',
        priority: 'HIGH',
    },
];

export function getServiceContactPreset(serviceIndex: number): ContactRequestPreset {
    const selection = serviceContactSelections[serviceIndex] ?? serviceContactSelections[0];

    return {
        useDetailedRequest: true,
        detailedRequest: selection,
    };
}
