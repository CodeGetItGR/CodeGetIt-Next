import { usePublicOffer } from './usePublicOffer';

export const ScopeSection = () => {
    const { offer, text } = usePublicOffer();

    if (!offer.offer.description) {
        return null;
    }

    return (
        <section className="mt-6 rounded-[10px] border border-slate-900/[0.08] bg-white p-5">
            <h2 className="font-display mb-2 text-base font-bold text-slate-900">{text.scope}</h2>
            <p className="whitespace-pre-wrap text-sm text-slate-600">{offer.offer.description}</p>
        </section>
    );
};
