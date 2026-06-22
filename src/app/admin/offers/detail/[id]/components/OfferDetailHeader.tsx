import Link from 'next/link';
import { StatusBadge } from '@/components';
import { useOfferDetail } from './useOfferDetail';

export const OfferDetailHeader = () => {
    const { offer, text, publicOfferUrl } = useOfferDetail();

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
                <p className="text-sm tracking-[0.16em] text-gray-500 uppercase">{text.eyebrow}</p>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">{offer.title}</h2>
                <div className="mt-2 flex items-center gap-2">
                    <StatusBadge value={offer.status} />
                    {offer.revisionNumber > 0 && (
                        <span className="text-sm text-gray-600">
                            {text.revisionLabel} {offer.revisionNumber}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <Link
                    href={publicOfferUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    {text.previewPublicView}
                </Link>
                <Link href="/admin/offers" className="text-sm font-medium text-gray-700 underline">
                    {text.backToOffers}
                </Link>
            </div>
        </div>
    );
};
