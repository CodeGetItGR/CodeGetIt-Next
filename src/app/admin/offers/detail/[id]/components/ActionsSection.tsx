import { useOfferDetail } from './useOfferDetail';
import { CancelReasonForm } from './CancelReasonForm';
import { ReviseReasonForm } from './ReviseReasonForm';

export const ActionsSection = () => {
    const {
        offer,
        text,
        isDraft,
        isSent,
        isRejected,
        handleSend,
        isSending,
        handleCancel,
        handleRejectStatus,
        handleRevise,
        showCancelReason,
        showReviseReason,
    } = useOfferDetail();

    return (
        <section id="offer-actions" className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">{text.actions.title}</h3>
            <p className="mt-0.5 text-sm text-gray-500">
                {text.actions.statusLabel} <span className="font-medium text-gray-700">{offer.status.replace(/_/g, ' ')}</span>
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                {isDraft && (
                    <>
                        <button
                            onClick={handleSend}
                            disabled={isSending}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                            {isSending ? text.actions.sending : text.actions.sendToClient}
                        </button>
                        <button onClick={handleCancel} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">
                            {text.actions.cancelOffer}
                        </button>
                        <button
                            onClick={handleRejectStatus}
                            className="rounded-lg border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100"
                        >
                            {text.actions.discardDraft}
                        </button>
                    </>
                )}
                {isSent && (
                    <button onClick={handleCancel} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">
                        {text.actions.cancelOffer}
                    </button>
                )}
                {isRejected && (
                    <button onClick={handleRevise} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        {text.actions.reviseToDraft}
                    </button>
                )}
            </div>

            {showCancelReason && <CancelReasonForm />}
            {showReviseReason && <ReviseReasonForm />}
        </section>
    );
};
