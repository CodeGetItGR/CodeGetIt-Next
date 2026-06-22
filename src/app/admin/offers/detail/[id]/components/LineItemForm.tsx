import { Input } from '@/components/ui/Input';
import { useOfferDetail } from './useOfferDetail';

export const LineItemForm = () => {
    const { text, lineItemFormState, editingLineItemId, handleLineItemFieldChange, handleSaveLineItem, handleCancelLineItemForm, isSavingLineItem } =
        useOfferDetail();

    return (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-3 font-semibold text-gray-900">{editingLineItemId ? text.lineItems.editItem : text.lineItems.newItem}</h4>
            <div className="grid gap-3 md:grid-cols-2">
                <Input
                    label={text.lineItems.descriptionLabel}
                    value={lineItemFormState.description}
                    onChange={(e) => handleLineItemFieldChange('description', e.target.value)}
                    required
                />
                <Input
                    label={text.lineItems.quantityLabel}
                    type="number"
                    step="0.01"
                    value={lineItemFormState.quantity}
                    onChange={(e) => handleLineItemFieldChange('quantity', e.target.value)}
                    required
                />
                <Input
                    label={text.lineItems.unitPriceLabel}
                    type="number"
                    step="0.01"
                    value={lineItemFormState.unitPrice}
                    onChange={(e) => handleLineItemFieldChange('unitPrice', e.target.value)}
                    required
                />
                <Input
                    label={text.lineItems.taxRateLabel}
                    type="number"
                    step="0.01"
                    value={lineItemFormState.taxRate}
                    onChange={(e) => handleLineItemFieldChange('taxRate', e.target.value)}
                />
                <Input
                    label={text.lineItems.sortOrderLabel}
                    type="number"
                    value={lineItemFormState.sortOrder}
                    onChange={(e) => handleLineItemFieldChange('sortOrder', e.target.value)}
                />
            </div>
            <div className="mt-4 flex gap-2">
                <button
                    onClick={handleSaveLineItem}
                    disabled={isSavingLineItem}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                    {isSavingLineItem ? text.lineItems.saving : text.lineItems.save}
                </button>
                <button
                    onClick={handleCancelLineItemForm}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    {text.lineItems.cancel}
                </button>
            </div>
        </div>
    );
};
