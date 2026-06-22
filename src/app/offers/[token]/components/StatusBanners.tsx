import { usePublicOffer } from './usePublicOffer';

const CheckIcon = () => (
    <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const StatusBanners = () => {
    const { offer, text, isActionable, isCancelled, showAccepted, showRejected, actionState } = usePublicOffer();

    return (
        <>
            {showAccepted && actionState !== 'rejected' && (
                <div
                    className="border-b border-brand-500/20"
                    style={{ background: 'linear-gradient(90deg, rgba(246,137,86,0.07) 0%, rgba(13,148,136,0.05) 100%)' }}
                >
                    <div className="mx-auto flex max-w-[700px] items-center gap-3 px-7 py-[14px]">
                        <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-brand-600">
                            <CheckIcon />
                        </div>
                        <div>
                            <p className="text-[13.5px] font-semibold text-slate-900">{text.acceptedTitle}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{text.acceptedBody}</p>
                        </div>
                    </div>
                </div>
            )}

            {showRejected && actionState !== 'accepted' && (
                <div className="border-b border-orange-200 bg-orange-50">
                    <div className="mx-auto max-w-[700px] px-7 py-[14px]">
                        <p className="text-[13.5px] font-semibold text-orange-900">
                            {actionState === 'rejected' ? text.feedbackSubmittedTitle : text.rejectedBanner}
                        </p>
                        {offer.rejectionNote && (
                            <p className="mt-1 text-xs text-orange-800">
                                {text.yourFeedback} {offer.rejectionNote}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {isCancelled && (
                <div className="border-b border-slate-300 bg-slate-100">
                    <div className="mx-auto max-w-[700px] px-7 py-[14px]">
                        <p className="text-[13.5px] font-medium text-slate-700">{text.cancelledBanner}</p>
                    </div>
                </div>
            )}

            {offer.expired && !isActionable && !showAccepted && !showRejected && (
                <div className="border-b border-amber-200 bg-amber-50">
                    <div className="mx-auto max-w-[700px] px-7 py-[14px]">
                        <p className="text-[13.5px] font-medium text-amber-900">{text.expiredBanner}</p>
                    </div>
                </div>
            )}
        </>
    );
};
