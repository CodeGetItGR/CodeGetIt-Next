'use client'

import { ContactRequestProvider } from '@/providers';
import { useLocale } from '@/i18n/UseLocale';
import { PublicSettingsProvider } from '@/settings/PublicSettingsProvider';
import {
    ComparisonSection,
    FAQSection,
    FooterSection,
    HeroSection,
    HowWeWorkSection,
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
                    <Navbar />
                    <HeroSection />
                    <ServicesSection />
                    <ComparisonSection />
                    <HowWeWorkSection />
                    <ProjectsSection />
                    <FAQSection />
                    <Contact />
                    <FooterSection />
                </div>
            </ContactRequestProvider>
        </PublicSettingsProvider>
    );
}
