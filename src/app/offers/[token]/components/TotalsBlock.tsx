import { usePublicOffer } from './usePublicOffer';

export const TotalsBlock = () => {
    const { offer, text, fmt } = usePublicOffer();
    const hasTax = typeof offer.offer.taxAmount === 'number' && offer.offer.taxAmount > 0;

    return (
        <div className="px-[26px] py-[22px]" style={{ background: '#f9f9f7' }}>
            <div className="ml-auto max-w-[264px]">
                <div className="flex items-center justify-between py-[5px]">
                    <span className="text-[13px] text-slate-500">{text.subtotal}</span>
                    <span className="text-[13px] font-medium text-slate-900">{fmt(offer.offer.subtotalAmount ?? 0)}</span>
                </div>

                {hasTax && (
                    <div className="flex items-center justify-between py-[5px]">
                        <span className="text-[13px] text-slate-500">
                            {text.tax} ({offer.offer.taxRate}%)
                        </span>
                        <span className="text-[13px] font-medium text-slate-900">{fmt(offer.offer.taxAmount as number)}</span>
                    </div>
                )}

                <div className="mt-[10px] flex items-baseline justify-between pt-[14px]" style={{ borderTop: '1.5px solid rgba(15,23,42,0.1)' }}>
                    <span className="text-[10.5px] font-bold tracking-[0.14em] text-slate-500 uppercase">{text.total}</span>
                    <span className="font-extrabold leading-none tracking-[-0.03em] text-brand-600" style={{ fontSize: '1.85rem' }}>
                        {fmt(offer.offer.totalAmount ?? 0)}
                    </span>
                </div>
            </div>
        </div>
    );
};
