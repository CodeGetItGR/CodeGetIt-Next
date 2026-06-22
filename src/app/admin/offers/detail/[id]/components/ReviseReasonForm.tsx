import { Textarea } from '@/components/ui/Textarea';
import { useOfferDetail } from './useOfferDetail';

export const ReviseReasonForm = () => {
    const { text, reviseReason, setReviseReason, closeReviseReason, handleConfirmRevise, isRevising } = useOfferDetail();

    return (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">{text.actions.reviseReasonLabel}</label>
            <Textarea
                value={reviseReason}
                onChange={(e) => setReviseReason(e.target.value)}
                placeholder={text.actions.reviseReasonPlaceholder}
                rows={3}
                className="mb-3 w-full"
            />
            <div className="flex gap-2">
                <button
                    onClick={handleConfirmRevise}
                    disabled={isRevising}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                    {text.actions.confirmRevise}
                </button>
                <button onClick={closeReviseReason} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {text.actions.back}
                </button>
            </div>
        </div>
    );
};
