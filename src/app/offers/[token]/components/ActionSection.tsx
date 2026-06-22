import { usePublicOffer } from './usePublicOffer';

export const ActionSection = () => {
    const { text, showActions, isAccepting, handleAccept, openRejectModal } = usePublicOffer();

    if (!showActions) {
        return null;
    }

    return (
        <div className="mt-3">
            <div className="rounded-[10px] border border-slate-900/[0.08] bg-white px-[26px] py-6">
                <p className="mb-1 text-[14px] font-semibold text-slate-900">{text.readyToMoveForward}</p>
                <p className="mb-5 text-[13px] leading-[1.65] text-slate-500">{text.readyToMoveForwardBody}</p>
                <button
                    onClick={handleAccept}
                    disabled={isAccepting}
                    className="block w-full cursor-pointer rounded-lg border-none bg-brand-600 px-6 py-[15px] text-[14.5px] font-semibold tracking-[-0.01em] text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isAccepting ? text.processing : text.acceptThisOffer}
                </button>
            </div>
            <div className="pt-2.5 text-center">
                <button
                    type="button"
                    onClick={openRejectModal}
                    className="cursor-pointer rounded-md border-none bg-transparent px-3 py-2 text-[12.5px] text-slate-400 underline underline-offset-[3px] transition-colors hover:text-slate-500"
                >
                    {text.rejectThisOffer}
                </button>
            </div>
        </div>
    );
};
