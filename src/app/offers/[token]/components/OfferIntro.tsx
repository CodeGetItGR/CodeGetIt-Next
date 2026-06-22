import { usePublicOffer } from './usePublicOffer';

export const OfferIntro = () => {
    const { offer, text } = usePublicOffer();

    return (
        <div>
            <p className="text-[11px] font-bold tracking-[0.14em] text-brand-600 uppercase">{text.proposal}</p>
            <h1 className="font-display mt-2 text-[1.85rem] font-extrabold tracking-[-0.03em] text-slate-900">{offer.offer.title}</h1>
            <p className="mt-1.5 text-sm text-slate-500">
                {text.forLabel} <span className="font-medium text-slate-700">{offer.recipientName || text.valuedClient}</span>
            </p>
        </div>
    );
};
