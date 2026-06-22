import { usePublicOffer } from './usePublicOffer';

const MetaItem = ({ label, value }: { label: string; value: string }) => (
    <div>
        <p className="text-[10px] font-bold tracking-[0.1em] text-slate-400 uppercase">{label}</p>
        <p className="mt-1 text-[13px] font-semibold text-slate-900">{value}</p>
    </div>
);

export const MetaStrip = () => {
    const { offer, text, fmtDate, offerLanguageLabel } = usePublicOffer();

    return (
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-[10px] border border-slate-900/[0.08] bg-white p-5 sm:grid-cols-4">
            <MetaItem label={text.sentOn} value={offer.sentAt ? fmtDate(offer.sentAt) : text.notAvailable} />
            <MetaItem label={text.validUntil} value={offer.offer.validUntil ? fmtDate(offer.offer.validUntil) : text.notSpecified} />
            <MetaItem label={text.revision} value={`#${offer.revisionNumber}`} />
            <MetaItem label={text.language} value={offerLanguageLabel} />
        </div>
    );
};
