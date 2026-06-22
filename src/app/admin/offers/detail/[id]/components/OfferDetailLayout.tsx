import { EntityAuxPanels } from '@/components';
import { useOfferDetail } from './useOfferDetail';
import { OfferDetailHeader } from './OfferDetailHeader';
import { SectionNav } from './SectionNav';
import { ActionsSection } from './ActionsSection';
import { DetailsForm } from './DetailsForm';
import { LineItemsSection } from './LineItemsSection';
import { SubmissionHistory } from './SubmissionHistory';

export const OfferDetailLayout = () => {
    const { offer, errorMessage, text } = useOfferDetail();

    return (
        <div className="space-y-6">
            <OfferDetailHeader />

            {errorMessage && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorMessage}</p>}

            {offer.rejectionNote && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <p className="text-sm font-semibold text-orange-900">{text.clientFeedbackLabel}</p>
                    <p className="mt-2 text-sm text-orange-800">{offer.rejectionNote}</p>
                </div>
            )}

            <SectionNav />
            <ActionsSection />
            <DetailsForm />
            <LineItemsSection />
            <SubmissionHistory />

            <section id="offer-aux">
                <EntityAuxPanels entityType="OFFER" entityId={offer.id} />
            </section>
        </div>
    );
};
