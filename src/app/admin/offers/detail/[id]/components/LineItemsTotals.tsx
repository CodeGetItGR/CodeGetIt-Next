import { useOfferDetail } from './useOfferDetail';

export const LineItemsTotals = () => {
    const { offer, text } = useOfferDetail();

    if (offer.lineItems.length === 0) {
        return null;
    }

    return (
        <div className="mt-4 ml-auto max-w-xs rounded-lg bg-gray-50 p-4">
            <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">{text.lineItems.subtotal}</span>
                <span className="font-medium">
                    {(offer.subtotalAmount || 0).toFixed(2)} {offer.currency}
                </span>
            </div>
            {typeof offer.taxAmount === 'number' && offer.taxAmount > 0 && (
                <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-600">
                        {text.lineItems.tax} ({offer.taxRate}%):
                    </span>
                    <span className="font-medium">
                        {offer.taxAmount.toFixed(2)} {offer.currency}
                    </span>
                </div>
            )}
            <div className="flex justify-between border-t border-gray-300 pt-2 font-semibold">
                <span>{text.lineItems.total}</span>
                <span>
                    {(offer.totalAmount || 0).toFixed(2)} {offer.currency}
                </span>
            </div>
        </div>
    );
};
