'use client'

import { ContactRequestProvider } from '@/providers';
import { useLocale } from '@/i18n/UseLocale';
import { PublicSettingsProvider } from '@/settings/PublicSettingsProvider';
import { ComparisonSection, FAQSection, FooterSection, HeroSection, HowWeWorkSection, ProjectsSection, ServicesSection, Navbar, SEO, Contact} from '@/components';

export default function LandingPage() {
    const { t } = useLocale();

    return (
        <PublicSettingsProvider>
            <ContactRequestProvider>
                <div className="min-h-screen overflow-x-hidden bg-[#0a0e27] pt-10 text-slate-100 lg:pt-0">
                    <SEO title={t.landing.seo.title} description={t.landing.seo.description} canonicalUrl="https://codegetit.com" />
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
