import { usePublicOffer } from './usePublicOffer';
import { OfferHeader } from './OfferHeader';
import { StatusBanners } from './StatusBanners';
import { OfferIntro } from './OfferIntro';
import { ProjectCard } from './ProjectCard';
import { MetaStrip } from './MetaStrip';
import { DeliverablesSection } from './DeliverablesSection';
import { ActionSection } from './ActionSection';
import { ScopeSection } from './ScopeSection';
import { ConfidentialFooter } from './ConfidentialFooter';
import { RejectModal } from './RejectModal';

// Accepted state: warm orange ambient glow — brand "delivery" moment
const ACCEPTED_BG = 'radial-gradient(ellipse 140% 36% at 50% -2%, rgba(246,137,86,0.08) 0%, #f5f4f0 52%)';
const DEFAULT_BG = '#f5f4f0';

export const PublicOfferLayout = () => {
    const { showAccepted } = usePublicOffer();

    return (
        <div className="min-h-screen" style={{ background: showAccepted ? ACCEPTED_BG : DEFAULT_BG }}>
            <OfferHeader />
            <StatusBanners />

            <main className="mx-auto max-w-175 px-7 py-10">
                <OfferIntro />
                <ProjectCard />
                <MetaStrip />
                <DeliverablesSection />
                <ActionSection />
                <ScopeSection />
                <ConfidentialFooter />
            </main>

            <RejectModal />
        </div>
    );
};
