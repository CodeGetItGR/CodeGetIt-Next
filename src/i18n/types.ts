export type Locale = string | 'en' | 'el';

export interface Translations {
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
        responseTimeLabel: string;
        responseTimeValue: string;
        locationValue: string;
        trustNote: string;
        errorFixFields: string;
        errorGeneric: string;
        helpfulTips: string;
        tips: string[];
        detailed?: {
            detailedToggleTitle: string;
            detailedToggleHint: string;
            contactInfo: string;
            projectEssentials: string;
            extraContext: string;
            projectTitle: string;
            phone: string;
            enterpriseInquiry: string;
            enterpriseHint: string;
            businessGoal: string;
            projectType: string;
            selectProjectType: string;
            desiredStart: string;
            selectStartWindow: string;
            budgetRange: string;
            selectBudgetRange: string;
            budgetFlexibility: string;
            selectFlexibility: string;
            communicationPreference: string;
            selectPreference: string;
            dataSensitivity: string;
            selectSensitivity: string;
            priority: string;
            organizationNameOptional: string;
            industryOptional: string;
            targetAudienceOptional: string;
            targetLaunchWindowOptional: string;
            legalConstraintsOptional: string;
            optionsLoadingHint: string;
            projectDescriptionOptional: string;
            back: string;
            nextStep: string;
            submitProjectRequest: string;
            submittedWithId: string;
        };
    };

    /** The 404 page — an empty field, one lost dot: "This isn't it." */
    notFound: {
        /** Declaration without its period glyph — a static dot serves as the period. */
        line: string;
        sub: string;
        back: string;
    };

    landing: {
        seo: {
            title: string;
            description: string;
        };
        hero: {
            navigation: {
                brandInitial: string;
                brandLabel: string;
                links: [string, string, string];
                contactButton: string;
            };
            /** Act I — the declaration is set without a trailing period; It is the period. */
            actLabel: string;
            line: string;
            sub: string;
            ctas: {
                primary: string;
                secondary: string;
            };
        };
        /** The three-act story the name spells out: you bring it, we code it, you get it. */
        story: {
            code: {
                actLabel: string;
                line: string;
                sub: string;
                /** Cue shown while the pinned scene waits for the first scroll segment. */
                scrollCue: string;
                /** The hop list — the dot serves as each item's period while its spec card swaps in. */
                items: Array<{
                    title: string;
                    description: string;
                    deliverables: [string, string, string];
                }>;
            };
            get: {
                actLabel: string;
                line: string;
                sub: string;
                cta: string;
            };
        };
        /**
         * Status whispers — the parenthetical voice that keeps It alive while
         * it's in the shop. Whispers never end in a period: sentences can't
         * finish while It is away (the footer's epilogue earns its full stop).
         */
        whispers: {
            /** Act II resolution — shown in the spec-card slot as the pin closes. */
            code: string;
            services: string;
            process: string;
            projects: string;
            faq: string;
        };
        stats: {
            labels: [string, string, string, string];
        };
        services: {
            from: string;
            eyebrow: string;
            title: string;
            description: string;
            featured: string;
            getStarted: string;
            priceDisclaimer: string;
            timeEstimateDisclaimer:string;
            items: Array<{
                title: string;
                description: string;
                features: string[];
                priceKey: string;
                defaultPrice: string;
            }>;
        };
        comparison: {
            eyebrow: string;
            title: string;
            description: string;
            headers: {
                feature: string;
                staticWebsite: string;
                webApplication: string;
                fullStackApplication: string;
            };
            rows: [string, string, string, string, string, string, string, string];
            stackTitle: string;
            maintenanceStatic: string;
            maintenanceWeb: string;
            maintenanceFull: string;
            managedLabel: string;
            customLabel: string;
            disclaimer: string;
        };
        process: {
            eyebrow: string;
            title: string;
            description: string;
            steps: Array<{
                title: string;
                description: string;
            }>;
        };
        projects: {
            eyebrow: string;
            title: string;
            description: string;
            viewProject: string;
            viewAll: string;
            items: Array<{
                title: string;
                description: string;
                tags: string[];
            }>;
        };
        testimonials: {
            eyebrow: string;
            title: string;
            description: string;
            prev: string;
            next: string;
            indicatorAria: string;
            items: Array<{
                quote: string;
                author: string;
                role: string;
                company: string;
            }>;
        };
        faq: {
            eyebrow: string;
            title: string;
            description: string;
            items: Array<{
                question: string;
                answer: string;
            }>;
        };
        footer: {
            brandName: string;
            /** Caption under the permanently dotless wordmark: "(you have it now.)" */
            lentDot: string;
            tagline: string;
            categories: {
                services: string;
                company: string;
                resources: string;
            };
            rights: string;
            privacy: string;
            terms: string;
            social: {
                github: string;
                linkedin: string;
                email: string;
            };
            links: {
                services: string[];
                company: string[];
                resources: string[];
            };
        };
    };

    // Testimonials Section
    testimonials: {
        badge: string;
        title: string;
        subtitle: string;
        metrics: {
            satisfaction: string;
            projects: string;
            clients: string;
            experience: string;
        };
        controls: {
            previousSlide: string;
            nextSlide: string;
        };
        items: Array<{
            role: string;
            company: string;
            content: string;
        }>;
    };

    // Footer
    footer: {
        tagline: string;
        rights: string;
        basedIn: string;
        emailAria: string;
    };

    // Closing CTA
    closingCTA: {
        title: string;
        subtitle: string;
        button: string;
        buttonAria: string;
    };

    // Admin
    admin: {
        settings: {
            page: {
                eyebrow: string;
                title: string;
                description: string;
                draftBuffer: string;
                unsavedChanges: string;
                noUnsavedChanges: string;
                draftEditing: string;
                publishedPreview: string;
                searchPlaceholder: string;
                draft: string;
                published: string;
                noMatches: string;
                loading: string;
                loadError: string;
                saveError: string;
                publishSuccess: string;
                publishChanges: string;
                publishing: string;
                discardDraft: string;
                backToDraft: string;
                switchBackHint: string;
                draftHint: string;
            };
            sections: {
                availability: {
                    title: string;
                    description: string;
                };
                pricing: {
                    title: string;
                    description: string;
                };
                marketingHero: {
                    title: string;
                    description: string;
                };
                cta: {
                    title: string;
                    description: string;
                };
                banner: {
                    title: string;
                    description: string;
                };
                contact: {
                    title: string;
                    description: string;
                };
                requestOptions: {
                    title: string;
                    description: string;
                    loading: string;
                    failed: string;
                    noGroups: string;
                    noMatch: string;
                };
            };
            states: {
                modified: string;
                saved: string;
                enabled: string;
                disabled: string;
                defaultLabel: string;
                resetToDefault: string;
                changesRemainHint: string;
                sectionLabel: string;
                fieldsLabel: string;
                enabledLabel: string;
                groupKeyLabel: string;
            };
            tables: {
                plan: string;
                default: string;
                current: string;
                action: string;
            };
            fields: {
                availability: {
                    acceptingProjects: string;
                    statusMessage: string;
                    contactFormEnabled: string;
                    requestSubmissionEnabled: string;
                };
                marketingHero: {
                    heroTitle: string;
                    heroSubtitle: string;
                };
                cta: {
                    primaryText: string;
                    primaryUrl: string;
                };
                banner: {
                    bannerEnabled: string;
                    bannerText: string;
                    bannerSeverity: string;
                };
                contact: {
                    publicContactEmail: string;
                };
                pricing: {
                    staticStartingPrice: string;
                    webStartingPrice: string;
                    fullStartingPrice: string;
                };
            };
        };
        detailTabs: {
            notes: string;
            history: string;
        };
        entityAux: {
            notes: string;
            auditHistory: string;
        };
        projectDetail: {
            loading: string;
            notFound: string;
            title: string;
            back: string;
            noTransitions: string;
            save: string;
            saving: string;
            details: string;
            name: string;
            description: string;
            linkedRequest: string;
            linkedOffer: string;
            noRequest: string;
            noOffer: string;
            viewRequest: string;
            viewOffer: string;
            statusActions: string;
            status: string;
            navActions: string;
            navLinked: string;
            navDetails: string;
            cancelTitle: string;
            cancelBody: string;
            keep: string;
            confirmCancel: string;
            cancelling: string;
            moveTo: string;
            deadline: string;
            noDeadline: string;
            overdue: string;
            daysLeft: string;
            links: string;
            noLinks: string;
            addLink: string;
            linkTitle: string;
            linkUrl: string;
            createLink: string;
            creatingLink: string;
            remove: string;
            open: string;
            payments: string;
            totalPaid: string;
            noPayments: string;
            amount: string;
            paidAt: string;
            notes: string;
            notesOptional: string;
            registerPayment: string;
            registeringPayment: string;
            noNotes: string;
            statusLabels: {
                IN_PROGRESS: string;
                COMPLETED: string;
                ON_HOLD: string;
                CANCELLED: string;
                PLANNING: string;
            };
        };
        projectGithub: {
            card: {
                title: string;
                addRepo: string;
                createRepo: string;
                linkRepo: string;
                linkedRepos: string;
                provider: string;
                primaryRepo: string;
                noRepo: string;
                noProvider: string;
                open: string;
                lastError: string;
            };
            sheets: {
                createTitle: string;
                createDesc: string;
                repoNameOptional: string;
                repoNamePlaceholder: string;
                privateRepo: string;
                creating: string;
                createRepo: string;
                cancel: string;
                linkTitle: string;
                linkDesc: string;
                repoUrl: string;
                repoUrlPlaceholder: string;
                repoNameOverride: string;
                repoNameOverridePlaceholder: string;
                linking: string;
                linkRepo: string;
            };
            actions: {
                success: string;
                invalidGithubUrl: string;
            };
        };
        aiChat: {
            title: string;
            newConversation: string;
            sendMessage: string;
            placeholder: string;
            loading: string;
            error: string;
            disabled: string;
            analyzeOffer: string;
            analyzing: string;
            analysisComplete: string;
            risks: string;
            timeline: string;
            requirements: string;
            recommendations: string;
            complexity: string;
            effort: string;
            summary: string;
            tokensUsed: string;
            estimatedCost: string;
            usage: string;
            messages: string;
            archived: string;
            archive: string;
            retry: string;
            rateLimited: string;
            tryAgain: string;
        };
        createRequestSheet: {
            title: string;
            description: string;
            submitButton: string;
            submitting: string;
            cancel: string;
            enterpriseHint: string;
            enterpriseEnabled: string;
            labels: {
                title: string;
                requesterName: string;
                requesterEmail: string;
                requesterPhone: string;
                description: string;
                projectType: string;
                businessGoal: string;
                organizationName: string;
                industry: string;
                targetAudience: string;
                desiredStartWindow: string;
                targetLaunchWindow: string;
                budgetRange: string;
                budgetFlexibility: string;
                communicationPreference: string;
                dataSensitivity: string;
                legalOrBrandConstraints: string;
                priority: string;
            };
            placeholders: {
                title: string;
                description: string;
                businessGoal: string;
                targetLaunchWindow: string;
                legalOrBrandConstraints: string;
            };
        };
        requestAnalysis: {
            title: string;
            description: string;
            queueAnalysis: string;
            refreshAnalysis: string;
            preparingAnalysis: string;
            queued: string;
            ready: string;
            notGenerated: string;
            loading: string;
            queuedNotice: string;
            emptyStateTitle: string;
            emptyStateBody: string;
            summaryLabel: string;
            tokensUsed: string;
            estimatedCost: string;
            estimatedEffort: string;
            hoursLabel: string;
            complexity: string;
            analysisMetadata: string;
            analysisId: string;
            requestId: string;
            jobId: string;
            jobType: string;
            targetType: string;
            retryCount: string;
            createdAt: string;
            updatedAt: string;
            nextAttemptAt: string;
            status: string;
            latestSnapshot: string;
            whatThisReportCovers: string;
            risksAndBlockers: string;
            timelineSignals: string;
            requirements: string;
            recommendations: string;
            noRisks: string;
            noTimeline: string;
            noRequirements: string;
            noRecommendations: string;
            missingStructuredBlock: string;
            statusLabels: {
                PENDING: string;
                IN_PROGRESS: string;
                DONE: string;
                FAILED: string;
                CANCELLED: string;
            };
            jobTypeLabels: {
                ANALYZE_REQUEST: string;
            };
            targetTypeLabels: {
                REQUEST: string;
            };
            complexityLabels: {
                LOW: string;
                MEDIUM: string;
                HIGH: string;
                CRITICAL: string;
            };
        };
    };

    publicOffer: {
        loadingOffer: string;
        offerNotFoundTitle: string;
        offerNotFoundBody: string;
        forLabel: string;
        valuedClient: string;
        expiredBanner: string;
        acceptedBanner: string;
        rejectedBanner: string;
        yourFeedback: string;
        cancelledBanner: string;
        acceptedTitle: string;
        acceptedBody: string;
        feedbackSubmittedTitle: string;
        feedbackSubmittedBody: string;
        offerDetails: string;
        validUntil: string;
        notSpecified: string;
        sentOn: string;
        revision: string;
        deliverables: string;
        description: string;
        quantity: string;
        unitPrice: string;
        subtotal: string;
        tax: string;
        total: string;
        processing: string;
        acceptOffer: string;
        rejectOffer: string;
        scope: string;
        rejectModalTitle: string;
        rejectModalBody: string;
        feedbackLabel: string;
        feedbackPlaceholder: string;
        cancel: string;
        submitting: string;
        confirmReject: string;
    };
}
