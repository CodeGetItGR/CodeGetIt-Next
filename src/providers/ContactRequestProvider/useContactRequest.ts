import { useContext } from 'react';
import { ContactRequestContext } from '@/providers';

export function useContactRequest() {
    const context = useContext(ContactRequestContext);

    if (!context) {
        throw new Error('useContactRequest must be used within a ContactRequestProvider');
    }

    return context;
}
