import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useOfferDetail } from './useOfferDetail';

export const DetailsForm = () => {
    const {
        text,
        isEditable,
        formState,
        languageOptions,
        currencyOptions,
        handleTitleChange,
        handleRecipientNameChange,
        handleRecipientEmailChange,
        handleCurrencyChange,
        handleLanguageChange,
        handlePriceAmountChange,
        handleTaxRateChange,
        handleValidUntilChange,
        handleDescriptionChange,
        handleUpdate,
        isSaving,
    } = useOfferDetail();

    return (
        <section id="offer-details" className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">{text.details.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{isEditable ? text.details.editableHint : text.details.readOnlyHint}</p>

            <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleUpdate}>
                <Input label={text.details.titleLabel} value={formState.title} onChange={handleTitleChange} disabled={!isEditable} required />
                <Input
                    label={text.details.recipientNameLabel}
                    value={formState.recipientName}
                    onChange={handleRecipientNameChange}
                    disabled={!isEditable}
                />
                <Input
                    label={text.details.recipientEmailLabel}
                    type="email"
                    value={formState.recipientEmail}
                    onChange={handleRecipientEmailChange}
                    disabled={!isEditable}
                    required
                />
                <div>
                    <label className="mb-1 block text-sm text-gray-600">{text.details.currencyLabel}</label>
                    <select
                        value={formState.currency}
                        onChange={handleCurrencyChange}
                        disabled={!isEditable}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    >
                        {currencyOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mb-1 block text-sm text-gray-600">{text.details.languageLabel}</label>
                    <select
                        value={formState.language}
                        onChange={handleLanguageChange}
                        disabled={!isEditable}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    >
                        {languageOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
                <Input
                    label={text.details.priceAmountLabel}
                    type="number"
                    step="0.01"
                    value={formState.priceAmount}
                    onChange={handlePriceAmountChange}
                    disabled={!isEditable}
                />
                <Input
                    label={text.details.taxRateLabel}
                    type="number"
                    step="0.01"
                    value={formState.taxRate}
                    onChange={handleTaxRateChange}
                    disabled={!isEditable}
                />
                <Input
                    label={text.details.validUntilLabel}
                    type="date"
                    value={formState.validUntil}
                    onChange={handleValidUntilChange}
                    disabled={!isEditable}
                />
                <div className="md:col-span-2">
                    <Textarea
                        label={text.details.descriptionLabel}
                        value={formState.description}
                        onChange={handleDescriptionChange}
                        disabled={!isEditable}
                        rows={4}
                    />
                </div>
                {isEditable && (
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                        >
                            {isSaving ? text.details.saving : text.details.saveChanges}
                        </button>
                    </div>
                )}
            </form>
        </section>
    );
};
