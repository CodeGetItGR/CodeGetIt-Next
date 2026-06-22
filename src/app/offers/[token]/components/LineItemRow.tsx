import type { OfferLineItemResponse } from '@/api';
import { usePublicOffer } from './usePublicOffer';

interface LineItemRowProps {
    item: OfferLineItemResponse;
    index: number;
}

export const LineItemRow = ({ item, index }: LineItemRowProps) => {
    const { text, fmt } = usePublicOffer();

    return (
        <div className="border-b border-slate-900/[0.05] px-[26px] py-[18px] last:border-none">
            {/* Line 1: index + description + subtotal */}
            <div className="flex items-start justify-between gap-5">
                <div className="flex min-w-0 flex-1 items-start gap-[14px]">
                    <span className="mt-[3px] shrink-0 text-[10.5px] font-bold tracking-[0.05em]" style={{ color: 'rgba(13,148,136,0.3)' }}>
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[14.5px] font-semibold leading-[1.4] text-slate-900">{item.description}</span>
                </div>
                <span className="shrink-0 whitespace-nowrap text-[14.5px] font-bold text-slate-900">{fmt(item.lineSubtotal)}</span>
            </div>

            {/* Line 2: quantity detail */}
            <p className="mt-[5px] pl-7 text-[12px] tracking-[0.01em] text-slate-400">
                {item.quantity} {item.quantity !== 1 ? text.units : text.unit} · {fmt(item.unitPrice)} {text.eachUnit}
            </p>
        </div>
    );
};
