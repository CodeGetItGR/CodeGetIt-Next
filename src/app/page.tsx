'use client'

import { ContactRequestProvider, ScrollHighlightProvider } from '@/providers';
import { PublicSettingsProvider } from '@/settings/PublicSettingsProvider';
import {
    ActCodeSection,
    ActGetSection,
    ComparisonSection,
    CookieNotice,
    FAQSection,
    FooterSection,
    HeroSection,
    HowWeWorkSection,
    ItProvider,
    MarketingBanner,
    ProjectsSection,
    ServicesSection,
    Navbar,
} from '@/components/landing';
import { Contact } from '@/components';

export default function LandingPage() {
    return (
        <PublicSettingsProvider>
            <ContactRequestProvider>
                <ScrollHighlightProvider>
                    {/* overflow-x-clip (not -hidden): hidden would make this a scroll container and break the Act II sticky pin */}
                    <div className="relative min-h-screen overflow-x-clip bg-[#fafafa] text-slate-900">
                        {/* Fixed film-grain overlay — one instance for the whole page */}
                        <div className="page-grain" aria-hidden="true" />
                        {/* The It journey: Act I (hero) → Act II (hop list) → absence → Act III (handover) */}
                        <MarketingBanner />
                        <ItProvider>
                            <Navbar />
                            <HeroSection />
                            <ActCodeSection />
                            <ServicesSection />
                            <ComparisonSection />
                            <HowWeWorkSection />
                            <ProjectsSection />
                            <FAQSection />
                            <ActGetSection />
                            <Contact />
                            <FooterSection />
                        </ItProvider>
                        <CookieNotice />
                    </div>
                </ScrollHighlightProvider>
            </ContactRequestProvider>
        </PublicSettingsProvider>
    );
}
