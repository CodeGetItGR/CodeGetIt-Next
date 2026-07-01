import type { Translations } from '../types';

import { en } from './en';

/**
 * Greek translations.
 *
 * Scope note: the three-act narrative ("You bring it" / "We code it" / "You
 * get it"), the whispers, the dotless-wordmark caption, and the brand name
 * itself are the core of the site's theme and are deliberately left in
 * English everywhere — translating them would break the wordplay the whole
 * design is built around. Everything informational a customer actually
 * needs to read — forms, services, pricing, FAQ, footer links — is
 * translated below. `landing.hero.navigation` and `landing.seo` are unused
 * dead code (the navbar hardcodes its own labels; `layout.tsx` always reads
 * metadata from `en` regardless of locale), so they're left untouched too.
 */
export const el: Translations = {
    ...en,
    contact: {
        title: 'Πες μας τι θέλεις να φτιάξουμε',
        subtitle: 'Τρία πεδία και απάντηση εντός 24 ωρών — ή ολόκληρο το brief, αν ξέρεις ήδη τι θέλεις.',
        badge: 'Επικοινωνία',
        namePlaceholder: 'Το όνομά σου',
        emailPlaceholder: 'Το email σου',
        messagePlaceholder: 'Τι είναι; Τι πρέπει να κάνει; Πότε το χρειάζεσαι;',
        sendButton: 'Στείλε το',
        sending: 'Αποστολή...',
        success: 'Είναι ήδη στον δρόμο.',
        nameLabel: 'Το όνομά σου',
        emailLabel: 'Το email σου',
        messageLabel: 'Το μήνυμά σου',
        languageLabel: 'Προτιμώμενη γλώσσα',
        email: 'Email',
        phone: 'Τηλέφωνο',
        location: 'Τοποθεσία',
        availability: 'Διαθεσιμότητα',
        availabilityTitle: 'Έτοιμος να ξεκινήσουμε;',
        availabilityDesc: 'Δέχομαι νέα έργα και είμαι έτοιμος να σε βοηθήσω να φτιάξεις λογισμικό που δουλεύει. Ας φτιάξουμε κάτι αξιόλογο μαζί.',
        availableNow: 'Διαθέσιμος τώρα',
        responseTimeLabel: 'Χρόνος απόκρισης',
        responseTimeValue: 'Εντός 24 ωρών',
        locationValue: 'Ελλάδα',
        trustNote: 'Σαφές αντικείμενο εργασίας, ειλικρινή χρονοδιαγράμματα και άμεση συνεργασία από την πρώτη μέρα.',
        errorFixFields: 'Διόρθωσε τα παρακάτω σφάλματα.',
        errorGeneric: 'Κάτι πήγε στραβά. Δοκίμασε ξανά ή στείλε μας email απευθείας.',
        helpfulTips: 'Χρήσιμες συμβουλές',
        tips: [
            'Περίγραψε τι θέλεις να φτιάξεις',
            'Πες μου το χρονοδιάγραμμα ή την προθεσμία σου',
            'Μοιράσου τυχόν ιδιαίτερες ανάγκες ή απαιτήσεις',
            'Πες μου τον προϋπολογισμό σου (προαιρετικό)',
            'Μοιράσου παραδείγματα ή έμπνευση (αν έχεις)',
        ],
        detailed: {
            detailedToggleTitle: 'Ξέρω το αντικείμενο του έργου και θέλω να υποβάλω αναλυτικό αίτημα τώρα.',
            detailedToggleHint: 'Θα χρησιμοποιήσουμε αυτά τα στοιχεία για να δημιουργήσουμε το αίτημά σου απευθείας στη ροή υλοποίησής μας.',
            contactInfo: 'Στοιχεία επικοινωνίας',
            projectEssentials: 'Βασικά στοιχεία έργου',
            extraContext: 'Επιπλέον πληροφορίες',
            projectTitle: 'Τίτλος έργου',
            phone: 'Τηλέφωνο',
            enterpriseInquiry: 'Πρόκειται για επιχειρηματικό αίτημα - προτιμώ άμεση επικοινωνία.',
            enterpriseHint:
                'Το σημείωσες ως επιχειρηματικό αίτημα. Μοιράσου τα βασικά στοιχεία τώρα και θα επικοινωνήσουμε απευθείας για να οριστικοποιήσουμε το αντικείμενο του έργου.',
            businessGoal: 'Επιχειρηματικός στόχος',
            projectType: 'Τύπος έργου',
            selectProjectType: 'Επίλεξε τύπο έργου',
            desiredStart: 'Επιθυμητή έναρξη',
            selectStartWindow: 'Επίλεξε περίοδο έναρξης',
            budgetRange: 'Εύρος προϋπολογισμού',
            selectBudgetRange: 'Επίλεξε εύρος προϋπολογισμού',
            budgetFlexibility: 'Ευελιξία προϋπολογισμού',
            selectFlexibility: 'Επίλεξε ευελιξία',
            communicationPreference: 'Προτίμηση επικοινωνίας',
            selectPreference: 'Επίλεξε προτίμηση',
            dataSensitivity: 'Ευαισθησία δεδομένων',
            selectSensitivity: 'Επίλεξε επίπεδο ευαισθησίας',
            priority: 'Προτεραιότητα',
            organizationNameOptional: 'Όνομα οργανισμού (προαιρετικό)',
            industryOptional: 'Κλάδος (προαιρετικό)',
            targetAudienceOptional: 'Κοινό-στόχος (προαιρετικό)',
            targetLaunchWindowOptional: 'Επιθυμητή περίοδος launch (προαιρετικό)',
            legalConstraintsOptional: 'Νομικοί ή εταιρικοί περιορισμοί (προαιρετικό)',
            optionsLoadingHint: 'Οι επιλογές φορτώνουν ακόμα. Μπορείς ωστόσο να στείλεις ένα απλό μήνυμα τώρα.',
            projectDescriptionOptional: 'Περιγραφή έργου (προαιρετικό)',
            back: 'Πίσω',
            nextStep: 'Επόμενο βήμα',
            submitProjectRequest: 'Υποβολή αιτήματος έργου',
            submittedWithId: 'Στάλθηκε! Αριθμός αναφοράς:',
        },
    },
    notFound: {
        line: 'Δεν είναι αυτό',
        sub: 'Η σελίδα που ψάχνεις δεν υπάρχει.',
        back: 'Επιστροφή στην αρχική',
    },
    landing: {
        // Dead code — layout.tsx always reads metadata from `en`, regardless of locale.
        seo: en.landing.seo,
        hero: {
            navigation: {
                links: {
                    build: 'Ανάπτυξη',
                    services: 'Υπηρεσίες',
                    compare: 'Σύγκριση',
                    process: 'Διαδικασία',
                    work: 'Έργα',
                    faq: 'Ερωτήσεις',
                },
                contactButton: 'Ζήτησε προσφορά',
                openMenuAria: 'Άνοιγμα μενού',
                closeMenuAria: 'Κλείσιμο μενού',
            },
            // Act I — theme, left in English.
            actLabel: en.landing.hero.actLabel,
            line: en.landing.hero.line,
            sub: 'Μια ιδέα. Ένα πρόβλημα. Ένα σκίτσο σε χαρτί. Ό,τι κι αν είναι — μια ολοκληρωμένη εφαρμογή, μια ιστοσελίδα — ξεκινάει δικό σου, και παραμένει δικό σου.',
            ctas: {
                primary: 'Πάμε να ξεκινήσουμε',
                secondary: 'Δες τη δουλειά μας',
            },
            plates: {
                idea:  { eyebrow: en.landing.hero.plates.idea.eyebrow,  caption: 'Μια σκέψη, ακριβώς όπως είναι.' },
                brief: { eyebrow: en.landing.hero.plates.brief.eyebrow, caption: 'Η ίδια ιδέα, διαμορφωμένη σε πλάνο.' },
            },
        },
        story: {
            code: {
                // Act II title — theme, left in English.
                actLabel: en.landing.story.code.actLabel,
                line: en.landing.story.code.line,
                sub: 'Σχεδιασμός και ανάπτυξη κάτω από την ίδια στέγη, μέχρι αυτό που έχεις στο μυαλό σου να αποκτήσει όνομα, μορφή και τη δική του διεύθυνση στο διαδίκτυο.',
                scrollCue: 'Συνέχισε να σκρολάρεις',
                artifactEyebrow: en.landing.story.code.artifactEyebrow,
                items: [
                    {
                        title: 'Σελίδες που πουλάνε',
                        description:
                            'Μία σελίδα με έναν σκοπό: να μετατρέπει το ενδιαφέρον σε δράση. Καθαρή δομή, στιγμιαία φόρτωση, και ένας ξεκάθαρος δρόμος προς το κουμπί που μετράει.',
                        deliverables: ['Πρώτα οι πωλήσεις', 'Συγκρίνεις εκδοχές', 'Έτοιμο σε μέρες'],
                    },
                    {
                        title: 'Δική σου ιστοσελίδα',
                        description:
                            'Σχεδιασμένες και φτιαγμένες από το μηδέν — χωρίς έτοιμα templates, χωρίς να μυρίζουν «καλούπι». Γρήγορες, προσβάσιμες, και προσαρμοσμένες στο περιεχόμενό σου, όχι σε κάποιο ξένο πρότυπο.',
                        deliverables: ['Μοναδικός σχεδιασμός', 'Εύκολη διαχείριση περιεχομένου', 'Έτοιμο για Google'],
                    },
                    {
                        title: 'Πλήρεις εφαρμογές',
                        description:
                            'Λογισμικό με μυαλό και πρόσωπο: μια προσεγμένη εμφάνιση μπροστά, και η λογική, τα δεδομένα και οι συνδέσεις σου να δουλεύουν από πίσω. Μία ομάδα έχει την ευθύνη για όλο το έργο, από την αρχή μέχρι το τέλος.',
                        deliverables: ['Εφαρμογή + διασύνδεση', 'Πίνακες διαχείρισης', 'Συνδέσεις'],
                    },
                ],
            },
            get: {
                // Act III title & CTA — the heart of the theme, left in English.
                actLabel: en.landing.story.get.actLabel,
                line: en.landing.story.get.line,
                sub: 'Αναρτημένο online, πλήρως καταγραμμένο, και στα χέρια σου. Όχι νοικιασμένο, όχι παραχωρημένο με άδεια χρήσης — δικό σου.',
                cta: en.landing.story.get.cta,
            },
        },
        // The parenthetical "It" voice — same theme, left in English.
        whispers: en.landing.whispers,
        stats: {
            labels: ['Παραδοτέα έργα', 'Ικανοποίηση πελατών', 'Ικανοποιημένοι πελάτες', 'Χρόνια εμπειρίας'],
        },
        services: {
            from: 'Από {price} €',
            artifactEyebrow: en.landing.services.artifactEyebrow,
            eyebrow: 'Υπηρεσίες',
            title: 'Επίλεξε τη λύση που ταιριάζει στο έργο σου',
            description:
                'Από απλές ιστοσελίδες παρουσίασης έως πλήρεις web εφαρμογές, σχεδιάζουμε και φτιάχνουμε λύσεις προσαρμοσμένες σε αυτό που πραγματικά προωθεί την επιχείρησή σου. Κάθε επίπεδο χτίζεται πάνω στο προηγούμενο, προσθέτοντας περισσότερες δυνατότητες και επιχειρηματικό αντίκτυπο.',
            featured: 'Πιο δημοφιλές',
            getStarted: 'Ξεκίνα τώρα',
            estimatedTimelineLabel: 'Εκτιμώμενος χρόνος',
            timelineEstimates: ['2–4 εβδομάδες', '4–8 εβδομάδες', '8–16+ εβδομάδες'],
            priceDisclaimer:
                'Αυτές είναι ειλικρινείς αρχικές τιμές — όχι σταθερές προσφορές. Κάθε έργο εξετάζεται σε μια σύντομη κλήση γνωριμίας, έτσι ώστε το ποσό που πληρώνεις να αντιστοιχεί σε αυτό που πραγματικά χρειάζεσαι.',
            timeEstimateDisclaimer:
                'Τα χρονοδιαγράμματα οριστικοποιούνται μετά τη γνωριμία, τον καθορισμό του αντικειμένου και την αξιολόγηση της τεχνικής πολυπλοκότητας και της τρέχουσας διαθεσιμότητας.',
            pricingFactorsLabel: 'Τι καθορίζει την τελική τιμή',
            pricingFactors: [
                { label: 'Αντικείμενο & λειτουργίες', description: 'Περισσότερες οθόνες, ροές χρήστη και λειτουργίες προσθέτουν χρόνο σχεδίασης και ανάπτυξης.' },
                { label: 'Πολυπλοκότητα σχεδίασης', description: 'Προσαρμοσμένη κίνηση, εικονογράφηση και συστήματα branding απαιτούν περισσότερο χρόνο επιμέλειας.' },
                { label: 'Σύνδεση με άλλες υπηρεσίες', description: 'Συστήματα πληρωμών και σύνδεση με άλλες υπηρεσίες προσθέτουν επιπλέον δουλειά συντονισμού.' },
                { label: 'Χρονοδιάγραμμα', description: 'Πιο σύντομες προθεσμίες απαιτούν αποκλειστική εστίαση και μπορούν να επηρεάσουν τον προγραμματισμό.' },
                { label: 'Όγκος περιεχομένου', description: 'Περισσότερες σελίδες, γλώσσες ή τύποι περιεχομένου επηρεάζουν την ανάπτυξη και τον έλεγχο ποιότητας.' },
                { label: 'Τεχνολογίες που θα χρησιμοποιηθούν', description: 'Συγκεκριμένες πλατφόρμες, περιορισμοί ή παλιά συστήματα επηρεάζουν τον τρόπο που θα χτιστεί το έργο.' },
                { label: 'Υποστήριξη μετά την κυκλοφορία', description: 'Η συντήρηση, η παρακολούθηση και οι ενημερώσεις καθορίζονται ξεχωριστά ανά έργο.' },
            ],
            items: [
                {
                    title: 'Στατικές Ιστοσελίδες',
                    description: 'Γρήγορες, κομψές ιστοσελίδες για brands που χρειάζονται σαφήνεια, ταχύτητα και ισχυρή πρώτη εντύπωση.',
                    features: ['Προσαρμόζεται σε όλες τις συσκευές', 'Βελτιστοποιημένο για Google', 'Ταχύτατη φόρτωση', 'Εύκολη συντήρηση'],
                    priceKey: 'marketing.staticStartingPrice',
                    defaultPrice: '1000',
                },
                {
                    title: 'Web Εφαρμογές',
                    description: 'Διαδραστικές εφαρμογές και πίνακες ελέγχου που συνδέονται με τα εργαλεία και τις υπηρεσίες που ήδη χρησιμοποιείς — χωρίς να χτίζουμε δικό σου σύστημα από την αρχή.',
                    features: ['Όλα όσα περιλαμβάνουν οι Στατικές Ιστοσελίδες', 'Διαδραστικές οθόνες και πίνακες ελέγχου', 'Ασφαλής σύνδεση χρηστών', 'Σύνδεση με άλλες υπηρεσίες'],
                    priceKey: 'marketing.webStartingPrice',
                    defaultPrice: '3500',
                },
                {
                    title: 'Ολοκληρωμένες Λύσεις (Full-Stack)',
                    description: 'Ολοκληρωμένα συστήματα φτιαγμένα στα μέτρα σου, με δική τους βάση δεδομένων και εργαλεία διαχείρισης — σχεδιασμένα και στην κυριότητά σου.',
                    features: ['Όλα όσα περιλαμβάνουν οι Web Εφαρμογές', 'Δικό σου σύστημα φτιαγμένο στα μέτρα σου', 'Οργάνωση των δεδομένων σου', 'Πίνακας διαχείρισης'],
                    priceKey: 'marketing.fullStartingPrice',
                    defaultPrice: '10000',
                },
            ],
        },
        comparison: {
            eyebrow: 'Σύγκριση',
            title: 'Ποιο επίπεδο ταιριάζει στο έργο σου;',
            description:
                'Κάθε επίπεδο χτίζεται πάνω στο προηγούμενο — από μια απλή ιστοσελίδα παρουσίασης έως μια πλατφόρμα φτιαγμένη εντελώς στα μέτρα σου, με δική της βάση δεδομένων και εργαλεία διαχείρισης.',
            headers: {
                feature: 'Χαρακτηριστικό',
                staticWebsite: 'Στατικό',
                webApplication: 'Web Εφαρμογή',
                fullStackApplication: 'Full-Stack',
            },
            rows: ['Σχεδιασμός', 'Εμφάνιση ιστοσελίδας', 'Λειτουργία στο παρασκήνιο', 'Βάση δεδομένων', 'Σύνδεση χρηστών', 'Πίνακας διαχείρισης', 'Σύνδεση με άλλες υπηρεσίες', 'Συντήρηση'],
            stackTitle: 'Βασικές τεχνολογίες',
            maintenanceStatic: 'Χαμηλή (περιστασιακές ενημερώσεις)',
            maintenanceWeb: 'Μεσαία (το φροντίζουμε εμείς)',
            maintenanceFull: 'Συνεχής (ενημερώσεις & αναβαθμίσεις)',
            managedLabel: 'Το αναλαμβάνουμε εμείς',
            customLabel: 'Φτιαγμένο στα μέτρα σου',
            disclaimer:
                'Τα χαρακτηριστικά και η πολυπλοκότητα διαφέρουν ανάλογα με το έργο. Οι Full-Stack λύσεις είναι φτιαγμένες στα μέτρα σου και μπορεί να περιλαμβάνουν επιπλέον στοιχεία που δεν αναφέρονται παραπάνω.',
            plates: {
                tierStatic: { eyebrow: en.landing.comparison.plates.tierStatic.eyebrow, caption: 'Μια γρήγορη, στοχευμένη σελίδα.' },
                tierApp:    { eyebrow: en.landing.comparison.plates.tierApp.eyebrow,    caption: 'Διαδραστική σελίδα και διαχειριζόμενες υπηρεσίες.' },
                tierFull:   { eyebrow: en.landing.comparison.plates.tierFull.eyebrow,   caption: 'Custom backend, δεδομένα και πλήρης κυριότητα.' },
            },
        },
        process: {
            eyebrow: 'Διαδικασία',
            title: 'Απλή διαδικασία, γρήγορος ρυθμός',
            description: 'Κάθε έργο ακολουθεί την ίδια δοκιμασμένη πορεία — αυτό που αλλάζει είναι το αντικείμενο εργασίας σε κάθε βήμα.',
            artifactEyebrow: en.landing.process.artifactEyebrow,
            deliverablesLabel: 'Παραδοτέα',
            outcomeLabel: 'Αποτέλεσμα',
            badges: {
                allProjects: { label: 'Όλα τα έργα', description: 'Ισχύει για κάθε τύπο έργου' },
                webAppPlus: { label: 'Web App+', description: 'Web Εφαρμογές και Full-Stack Λύσεις' },
                fullStack: { label: 'Full-Stack', description: 'Μόνο Full-Stack Λύσεις' },
            },
            steps: [
                {
                    title: 'Σχεδιασμός & Κατανόηση',
                    description:
                        'Συμφωνούμε στους επιχειρηματικούς στόχους, τις απαιτήσεις, τους χρήστες, τους περιορισμούς και τα κριτήρια επιτυχίας πριν ξεκινήσει ο σχεδιασμός ή η ανάπτυξη.',
                    deliverables: [
                        { label: 'Πρώτη συνάντηση γνωριμίας' },
                        { label: 'Ανάγκες της επιχείρησης σου' },
                        { label: 'Έρευνα χρηστών' },
                        { label: 'Τεχνικός έλεγχος' },
                        { label: 'Πλάνο του έργου' },
                    ],
                    outcome: 'Ένα σαφές αντικείμενο έργου και πλάνο υλοποίησης.',
                },
                {
                    title: 'Σχεδιασμός & Δομή',
                    description:
                        'Μετατρέπουμε το brief σε μια ξεκάθαρη σχεδιαστική κατεύθυνση — διαμορφώνοντας πώς θα φαίνεται η εφαρμογή, πώς θα είναι οργανωμένη η πληροφορία και, όπου χρειάζεται, πώς θα λειτουργεί από πίσω.',
                    deliverables: [
                        { label: 'Σχεδιασμός εμφάνισης & πρώτα δείγματα' },
                        { label: 'Ενιαίο στυλ σχεδίασης' },
                        { label: 'Σχεδιασμός συστήματος', badge: 'fullStack' },
                        { label: 'Σχεδιασμός βάσης δεδομένων', badge: 'fullStack' },
                        { label: 'Πλάνο υποδομής', badge: 'fullStack' },
                    ],
                    outcome: 'Μια επικυρωμένη σχεδιαστική κατεύθυνση και τεχνικό πλάνο, προσαρμοσμένο στο σωστό επίπεδο πολυπλοκότητας για το έργο σου.',
                },
                {
                    title: 'Ανάπτυξη & Δοκιμές',
                    description:
                        'Η δουλειά προχωρά σε μικρά, οργανωμένα βήματα — κάθε λειτουργία φτιάχνεται, ενσωματώνεται στο σύνολο και ελέγχεται συνεχώς, με τακτική επικοινωνία ώστε οι προτεραιότητες να παραμένουν ξεκάθαρες.',
                    deliverables: [
                        { label: 'Ανάπτυξη σε φάσεις' },
                        { label: 'Σύνδεση χρηστών', badge: 'webAppPlus' },
                        { label: 'Πίνακας διαχείρισης', badge: 'webAppPlus' },
                        { label: 'Σύνδεση με άλλες υπηρεσίες', badge: 'webAppPlus' },
                        { label: 'Έλεγχος ποιότητας & δοκιμές' },
                    ],
                    outcome: 'Ένα προϊόν πλήρως έτοιμο, καλά ελεγμένο και έτοιμο να κυκλοφορήσει.',
                },
                {
                    title: 'Κυκλοφορία & Υποστήριξη',
                    description:
                        'Ανεβάζουμε το έργο online, σου δίνουμε τα εργαλεία για να παρακολουθείς πώς πάει, και παραμένουμε διαθέσιμοι ώστε να συνεχίζει να λειτουργεί καθώς μεγαλώνει η επιχείρησή σου.',
                    deliverables: [
                        { label: 'Ανέβασμα online' },
                        { label: 'Βελτιστοποίηση για Google', badge: 'allProjects' },
                        { label: 'Στατιστικά επισκεψιμότητας', badge: 'allProjects' },
                        { label: 'Παρακολούθηση απόδοσης' },
                        { label: 'Πλάνο υποστήριξης μετά την κυκλοφορία' },
                    ],
                    outcome: 'Ένα προϊόν online και σε λειτουργία, έτοιμο για προβολή και ανάπτυξη, με πλάνο υποστήριξης σε ισχύ.',
                },
            ],
        },
        projects: {
            // "Previous It" is the same wordplay device as the Acts — left in English.
            eyebrow: en.landing.projects.eyebrow,
            artifactEyebrow: en.landing.projects.artifactEyebrow,
            artifactCaption: 'Κατασκευάστηκε, παραδόθηκε και ανήκει σε σένα.',
            title: 'Δουλειά που παραμένει',
            description: 'Κάθε έργο σχεδιάζεται με ακρίβεια, υλοποιείται με επιμέλεια και παραδίδεται στο σύνολό του — ένα προϊόν που σου ανήκει εξ ολοκλήρου.',
            challengeLabel: 'Η Πρόκληση',
            solutionLabel: 'Η Λύση',
            visitSite: 'Επισκέψου την ιστοσελίδα',
            live: 'Live',
        },
        artifacts: {
            variants: {
                idea:       { eyebrow: en.landing.artifacts.variants.idea.eyebrow,       title: en.landing.artifacts.variants.idea.title},
                brief:      { eyebrow: en.landing.artifacts.variants.brief.eyebrow,      title: en.landing.artifacts.variants.brief.title},
                design:     { eyebrow: en.landing.artifacts.variants.design.eyebrow,     title: en.landing.artifacts.variants.design.title},
                build:      { eyebrow: en.landing.artifacts.variants.build.eyebrow,      title: en.landing.artifacts.variants.build.title },
                handover:   { eyebrow: en.landing.artifacts.variants.handover.eyebrow,   title: en.landing.artifacts.variants.handover.title},
                tierStatic: { eyebrow: en.landing.artifacts.variants.tierStatic.eyebrow, title: en.landing.artifacts.variants.tierStatic.title},
                tierApp:    { eyebrow: en.landing.artifacts.variants.tierApp.eyebrow,    title: en.landing.artifacts.variants.tierApp.title},
                tierFull:   { eyebrow: en.landing.artifacts.variants.tierFull.eyebrow,   title: en.landing.artifacts.variants.tierFull.title},
            },
        },
        testimonials: {
            eyebrow: 'Μαρτυρίες',
            title: 'Λίγα λόγια από πελάτες',
            description: 'Αυτά λένε όσοι συνεργάστηκαν μαζί μας.',
            prev: 'Προηγούμενη μαρτυρία',
            next: 'Επόμενη μαρτυρία',
            indicatorAria: 'Προβολή μαρτυρίας {index}',
            // Quotes are real client wording — kept in the original English for authenticity.
            items: en.landing.testimonials.items,
        },
        faq: {
            eyebrow: 'Συχνές Ερωτήσεις',
            title: 'Ερωτήσεις που συνήθως μας κάνουν',
            items: [
                {
                    question: 'Πόσο διαρκεί συνήθως ένα έργο;',
                    answer: 'Οι μικρότερες ιστοσελίδες συνήθως διαρκούν 2 έως 4 εβδομάδες, ενώ πιο σύνθετες εφαρμογές μπορούν να διαρκέσουν 8 έως 16 εβδομάδες, ανάλογα με το αντικείμενο και τις απαραίτητες εγκρίσεις.',
                },
                {
                    question: 'Τι περιλαμβάνει η συνεχής υποστήριξη;',
                    answer: 'Η υποστήριξη μπορεί να περιλαμβάνει διορθώσεις σφαλμάτων, ενημερώσεις ασφαλείας, βοήθεια όταν χρειάζεται να ανέβει κάτι online, ελέγχους απόδοσης και μικρές βελτιώσεις μετά την κυκλοφορία.',
                },
                {
                    question: 'Αναλαμβάνετε να ανεβάσετε την ιστοσελίδα online;',
                    answer: 'Ναι. Φροντίζουμε να ανέβει η ιστοσελίδα ή η εφαρμογή σου online σε αξιόπιστους servers, διαλέγοντας τη λύση που ταιριάζει στις ανάγκες, τον προϋπολογισμό και την επισκεψιμότητά σου.',
                },
                {
                    question: 'Τι γίνεται μετά την κυκλοφορία;',
                    answer: 'Μπορούμε να παραμείνουμε ενεργά μετά την κυκλοφορία, για να παρακολουθούμε, να βελτιώνουμε και να διασφαλίζουμε ότι το προϊόν λειτουργεί ομαλά στην πραγματικότητα.',
                },
                {
                    question: 'Προσφέρετε πλάνα πληρωμής;',
                    answer: 'Για μεγαλύτερα έργα, διατίθενται πλάνα πληρωμής σε δόσεις, συνδεδεμένες με στάδια του έργου, ώστε η συνεργασία να παραμένει προβλέψιμη και για τις δύο πλευρές.',
                },
            ],
        },
        footer: {
            // Brand name and the dotless-wordmark caption stay in English — same theme rule.
            brandName: en.landing.footer.brandName,
            lentDot: en.landing.footer.lentDot,
            tagline: 'Φτιάχνουμε προσεγμένες εμπειρίες στο διαδίκτυο που βοηθούν τις ομάδες να παρουσιάζουν, να πουλάνε και να λειτουργούν καλύτερα online.',
            categories: {
                services: 'Υπηρεσίες',
                // `company` / `resources` columns are commented out in FooterSection — left untranslated, unused.
                company: en.landing.footer.categories.company,
                resources: en.landing.footer.categories.resources,
            },
            rights: 'Με την επιφύλαξη παντός δικαιώματος.',
            privacy: 'Πολιτική Απορρήτου',
            terms: 'Όροι Χρήσης',
            yourData: 'Διαχείριση Δεδομένων',
            social: {
                github: 'GitHub',
                linkedin: 'LinkedIn',
                email: 'Email',
            },
            links: {
                services: ['Στατικές Ιστοσελίδες', 'Web Εφαρμογές', 'Ολοκληρωμένες Λύσεις (Full-Stack)'],
                // Unused — the FooterSection component has these columns commented out.
                company: en.landing.footer.links.company,
                resources: en.landing.footer.links.resources,
            },
        },
        cookieNotice: {
            text: 'Δεν χρησιμοποιούμε cookies παρακολούθησης ή analytics σε αυτή την ιστοσελίδα.',
            linkLabel: 'Μάθε περισσότερα',
            dismiss: 'Το κατάλαβα',
        },
        marketingBanner: {
            dismissAria: 'Απόρριψη ανακοίνωσης',
        },
    },
    publicOffer: {
        loadingOffer: 'Φόρτωση προσφοράς...',
        offerNotFoundTitle: 'Η προσφορά δεν βρέθηκε',
        offerNotFoundBody: 'Δεν ήταν δυνατή η φόρτωση της προσφοράς. Ελέγξτε τον σύνδεσμο και δοκιμάστε ξανά.',
        proposal: 'Πρόταση',
        project: 'Έργο',
        offerLabel: 'Προσφορά',
        readyToMoveForward: 'Έτοιμοι να προχωρήσουμε;',
        readyToMoveForwardBody: 'Αποδεχτείτε για να επιβεβαιώσετε το αντικείμενο εργασιών και να ξεκινήσουμε, ή πείτε μας αν θέλετε αλλαγές.',
        acceptThisOffer: '✓  Αποδοχή προσφοράς',
        rejectThisOffer: 'Θα ήθελα να απορρίψω αυτή την προσφορά',
        eachUnit: 'το καθένα',
        unit: 'τεμάχιο',
        units: 'τεμάχια',
        notAvailable: '—',
        confidentialFooter: 'Εμπιστευτικό — προορίζεται για',
        forLabel: 'Για:',
        valuedClient: 'Αγαπητέ πελάτη',
        expiredBanner: 'Αυτή η προσφορά έχει λήξει και δεν μπορεί πλέον να γίνει αποδοχή ή απόρριψη.',
        acceptedBanner: '✓ Έχετε αποδεχτεί αυτή την προσφορά.',
        rejectedBanner: '✗ Έχετε απορρίψει αυτή την προσφορά.',
        yourFeedback: 'Τα σχόλιά σας:',
        cancelledBanner: 'Αυτή η προσφορά έχει ακυρωθεί.',
        acceptedTitle: '✓ Η προσφορά έγινε αποδεκτή!',
        acceptedBody: 'Σας ευχαριστούμε που αποδεχτήκατε αυτή την προσφορά. Θα επικοινωνήσουμε σύντομα μαζί σας για τα επόμενα βήματα.',
        feedbackSubmittedTitle: '✓ Τα σχόλια καταχωρήθηκαν',
        feedbackSubmittedBody: 'Σας ευχαριστούμε για τα σχόλιά σας — θα τα εξετάσουμε με προσοχή.',
        offerDetails: 'Στοιχεία προσφοράς',
        validUntil: 'Ισχύει έως',
        notSpecified: 'Δεν έχει οριστεί',
        sentOn: 'Στάλθηκε στις',
        revision: 'Αναθεώρηση',
        language: 'Γλώσσα',
        languageNames: {
            EN: 'Αγγλικά',
            EL: 'Ελληνικά',
        },
        deliverables: 'Παραδοτέα',
        description: 'Περιγραφή',
        quantity: 'Ποσότητα',
        unitPrice: 'Τιμή μονάδας',
        subtotal: 'Υποσύνολο',
        tax: 'ΦΠΑ',
        total: 'Σύνολο',
        processing: 'Επεξεργασία...',
        acceptOffer: '✓ Αποδοχή προσφοράς',
        rejectOffer: '✗ Απόρριψη προσφοράς',
        scope: 'Αντικείμενο εργασιών',
        rejectModalTitle: 'Απόρριψη προσφοράς',
        rejectModalBody: 'Επιβεβαιώστε και μοιραστείτε τα σχόλιά σας, ώστε να βελτιώσουμε την πρόταση.',
        feedbackLabel: 'Σχόλια *',
        feedbackPlaceholder: 'Πείτε μας τι θα μας βοηθούσε να βελτιώσουμε αυτή την προσφορά...',
        cancel: 'Άκυρο',
        submitting: 'Αποστολή...',
        confirmReject: 'Επιβεβαίωση απόρριψης',
    },
};
