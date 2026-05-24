export type Locale = 'en' | 'es' | 'fr' | 'de';

export interface Translations {
    // Navigation
    nav: {
        home: string;
        services: string;
        about: string;
        contact: string;
    };

    // Hero Section
    hero: {
        title: string;
        subtitle: string;
        cta: string;
        learnMore: string;
        badge: string;
        reimagined: string;
        startProject: string;
        viewWork: string;
        latestProject: string;
        ecommercePlatform: string;
        ecommerceDesc: string;
        scroll: string;
    };

    // Services Section
    services: {
        title: string;
        subtitle: string;
        badge: string;
        fullStack: {
            title: string;
            description: string;
            simpleDescription: string;
            features: string[];
            technicalDetails: {
                title: string;
                items: string[];
            };
        };
        api: {
            title: string;
            description: string;
            simpleDescription: string;
            features: string[];
            technicalDetails: {
                title: string;
                items: string[];
            };
        };
        learnMore: string;
        viewDetails: string;
        hideDetails: string;
        customSolutions: string;
        contactCTA: string;
    };

    // Portfolio Section
    portfolio: {
        badge: string;
        title: string;
        subtitle: string;
        viewAll: string;
        allProjects: string;
        viewCaseStudy: string;
        projectCTA: string;
        projectCTADesc: string;
        startProject: string;
    };

    // About Section
    about: {
        title: string;
        subtitle: string;
        description: string;
        badge: string;
        features: string[];
        testimonialQuote: string;
        testimonialAuthor: string;
    };

    // Stats Section
    stats: {
        projects: string;
        clients: string;
        experience: string;
        satisfaction: string;
    };

    // Contact Section
    contact: {
        title: string;
        subtitle: string;
        badge: string;
        namePlaceholder: string;
        emailPlaceholder: string;
        messagePlaceholder: string;
        sendButton: string;
        sending: string;
        success: string;
        nameLabel: string;
        emailLabel: string;
        messageLabel: string;
        email: string;
        phone: string;
        location: string;
        availability: string;
        availabilityTitle: string;
        availabilityDesc: string;
        availableNow: string;
    };

    // Footer
    footer: {
        tagline: string;
        rights: string;
    };
}
