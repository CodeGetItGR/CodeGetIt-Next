import { Textarea } from '@/components/ui/Textarea';
import { useOfferDetail } from './useOfferDetail';

export const CancelReasonForm = () => {
    const { text, cancelReason, setCancelReason, closeCancelReason, handleConfirmCancel, isCancelling } = useOfferDetail();

    return (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">{text.actions.cancelReasonLabel}</label>
            <Textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} rows={3} className="mb-3 w-full" />
            <div className="flex gap-2">
                <button
                    onClick={handleConfirmCancel}
                    disabled={isCancelling}
                    className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
                >
                    {text.actions.confirmCancel}
                </button>
                <button onClick={closeCancelReason} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {text.actions.back}
                </button>
            </div>
        </div>
    );
};
