import { usePublicOffer } from './usePublicOffer';

export const ConfidentialFooter = () => {
    const { offer, text } = usePublicOffer();

    return (
        <p className="mt-10 text-center text-[11px] text-slate-400">
            {text.confidentialFooter} {offer.recipientName || text.valuedClient}
        </p>
    );
};
