import { Textarea } from '@/components/ui/Textarea';
import { usePublicOffer } from './usePublicOffer';

export const RejectModal = () => {
    const {
        text,
        isActionable,
        actionState,
        showRejectModal,
        closeRejectModal,
        rejectionNote,
        setRejectionNote,
        handleRejectSubmit,
        isRejecting,
    } = usePublicOffer();

    if (!showRejectModal || !isActionable || actionState !== 'none') {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={closeRejectModal} aria-hidden="true" />
            <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
                <h3 className="text-lg font-semibold text-slate-900">{text.rejectModalTitle}</h3>
                <p className="mt-2 text-sm text-slate-500">{text.rejectModalBody}</p>

                <form onSubmit={handleRejectSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">{text.feedbackLabel}</label>
                        <Textarea
                            value={rejectionNote}
                            onChange={(event) => setRejectionNote(event.target.value)}
                            placeholder={text.feedbackPlaceholder}
                            rows={4}
                            className="w-full rounded-lg px-3 py-2"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={closeRejectModal}
                            disabled={isRejecting}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            {text.cancel}
                        </button>
                        <button
                            type="submit"
                            disabled={!rejectionNote.trim() || isRejecting}
                            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isRejecting ? text.submitting : text.confirmReject}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
