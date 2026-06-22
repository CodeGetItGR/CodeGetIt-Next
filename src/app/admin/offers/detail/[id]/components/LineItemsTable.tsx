import { useOfferDetail } from './useOfferDetail';

export const LineItemsTable = () => {
    const { offer, text, isEditable, handleEditLineItem, handleDeleteLineItem, isDeletingLineItem } = useOfferDetail();

    if (offer.lineItems.length === 0) {
        return <p className="text-sm text-gray-500">{text.lineItems.empty}</p>;
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">{text.lineItems.tableDescription}</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">{text.lineItems.tableQty}</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">{text.lineItems.tableUnitPrice}</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">{text.lineItems.tableTotal}</th>
                        {isEditable && <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">{text.lineItems.tableAction}</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {offer.lineItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900">{item.description}</td>
                            <td className="px-4 py-3 text-right text-gray-600">{item.quantity}</td>
                            <td className="px-4 py-3 text-right text-gray-600">
                                {item.unitPrice.toFixed(2)} {offer.currency}
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-gray-900">
                                {item.lineTotal.toFixed(2)} {offer.currency}
                            </td>
                            {isEditable && (
                                <td className="px-4 py-3 text-center">
                                    <button onClick={() => handleEditLineItem(item)} className="mr-2 text-sm text-blue-600 hover:text-blue-800">
                                        {text.lineItems.edit}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteLineItem(item.id)}
                                        disabled={isDeletingLineItem}
                                        className="text-sm text-rose-600 hover:text-rose-800"
                                    >
                                        {text.lineItems.delete}
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
