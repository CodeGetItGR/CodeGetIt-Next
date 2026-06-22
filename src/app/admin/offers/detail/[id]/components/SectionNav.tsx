import { useOfferDetail } from './useOfferDetail';

export const SectionNav = () => {
    const { text, isEditable } = useOfferDetail();

    const links = [
        { label: text.nav.actions, href: '#offer-actions' },
        { label: text.nav.details, href: '#offer-details' },
        ...(isEditable ? [{ label: text.nav.lineItems, href: '#offer-lineitems' }] : []),
        { label: text.nav.history, href: '#offer-history' },
        { label: text.nav.notesAndAudit, href: '#offer-aux' },
    ];

    return (
        <nav className="sticky top-0 z-10 -mx-1 flex gap-1 overflow-x-auto rounded-b-2xl border border-gray-200 bg-white/90 px-3 py-2 backdrop-blur">
            {links.map(({ label, href }) => (
                <a
                    key={href}
                    href={href}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                    {label}
                </a>
            ))}
        </nav>
    );
};
