import { Logo } from '@/components/landing/Logo';
import { usePublicOffer } from './usePublicOffer';

export const OfferHeader = () => {
    const { offer, text, fmtDate } = usePublicOffer();

    return (
        <header className="sticky top-0 z-10 border-b border-slate-900/[0.08] bg-white">
            <div className="mx-auto flex max-w-[700px] items-center justify-between px-7 py-4">
                <Logo variant="full" className="h-auto w-28" />
                <div className="text-right text-xs text-slate-400">
                    <p>
                        {text.revision} #{offer.revisionNumber}
                    </p>
                    {offer.sentAt && (
                        <p className="mt-0.5">
                            {text.sentOn} {fmtDate(offer.sentAt)}
                        </p>
                    )}
                </div>
            </div>
        </header>
    );
};
