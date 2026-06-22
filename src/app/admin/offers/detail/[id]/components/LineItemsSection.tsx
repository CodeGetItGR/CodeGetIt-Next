import { useOfferDetail } from './useOfferDetail';
import { LineItemForm } from './LineItemForm';
import { LineItemsTable } from './LineItemsTable';
import { LineItemsTotals } from './LineItemsTotals';

export const LineItemsSection = () => {
    const { text, isEditable, showLineItemForm, handleAddLineItem } = useOfferDetail();

    return (
        <section id="offer-lineitems" className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{text.lineItems.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{isEditable ? text.lineItems.editableHint : text.lineItems.readOnlyHint}</p>
                </div>
                {isEditable && (
                    <button
                        onClick={handleAddLineItem}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        {text.lineItems.addItem}
                    </button>
                )}
            </div>

            {isEditable && showLineItemForm && <LineItemForm />}

            <LineItemsTable />
            <LineItemsTotals />
        </section>
    );
};
