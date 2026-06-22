import { useContext } from 'react';
import { PublicOfferContext } from './public-offer-context';

export function usePublicOffer() {
    const context = useContext(PublicOfferContext);

    if (!context) {
        throw new Error('usePublicOffer must be used within a PublicOfferProvider');
    }

    return context;
}
