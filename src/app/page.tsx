'use client'

import { ContactRequestProvider } from '@/providers';
import { useLocale } from '@/i18n/UseLocale';
import { PublicSettingsProvider } from '@/settings/PublicSettingsProvider';
import {
    ActCodeSection,
    ActGetSection,
    ComparisonSection,
    FAQSection,
    FooterSection,
    HeroSection,
    HowWeWorkSection,
    ItProvider,
    ProjectsSection,
    ServicesSection,
    Navbar,
} from '@/components/landing';
import { Contact, SEO } from '@/components';

export default function LandingPage() {
    const { t } = useLocale();

    return (
        <PublicSettingsProvider>
            <ContactRequestProvider>
                <div className="relative min-h-screen overflow-x-hidden bg-[#fafafa] text-slate-900">
                    <SEO title={t.landing.seo.title} description={t.landing.seo.description} canonicalUrl="https://codegetit.com" />
                    {/* Fixed film-grain overlay — one instance for the whole page */}
                    <div className="page-grain" aria-hidden="true" />
                    {/* The It journey: Act I (hero) → Act II (hop list) → absence → Act III (handover) */}
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
                </div>
            </ContactRequestProvider>
        </PublicSettingsProvider>
    );
}
