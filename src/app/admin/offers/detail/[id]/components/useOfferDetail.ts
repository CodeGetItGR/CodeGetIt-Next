import { useContext } from 'react';
import { OfferDetailContext } from './offer-detail-context';

export function useOfferDetail() {
    const context = useContext(OfferDetailContext);

    if (!context) {
        throw new Error('useOfferDetail must be used within an OfferDetailProvider');
    }

    return context;
}
