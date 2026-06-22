import { usePublicOffer } from './usePublicOffer';
import { LineItemRow } from './LineItemRow';
import { TotalsBlock } from './TotalsBlock';

export const DeliverablesSection = () => {
    const { offer, text } = usePublicOffer();

    return (
        <section className="mt-6 overflow-hidden rounded-[10px] border border-slate-900/[0.08] bg-white">
            <div className="border-b border-slate-900/[0.08] px-[26px] py-5">
                <h2 className="font-display text-base font-bold text-slate-900">{text.deliverables}</h2>
            </div>

            {offer.offer.lineItems.map((item, index) => (
                <LineItemRow key={item.id} item={item} index={index} />
            ))}

            <TotalsBlock />
        </section>
    );
};
