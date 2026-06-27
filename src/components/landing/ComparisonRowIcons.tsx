// Content-accurate row icons for the Comparison table — one per
// `comparison.rows` entry (Design, Frontend, Backend, Database, User
// Authentication, Admin Dashboard, API Integration, Maintenance). Same
// ultra-light 1.5px-stroke Phosphor-style language as Services' icon set.

export function DesignRowIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
    );
}

export function FrontendRowIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="14" rx="1" />
            <path d="M3 8h18" />
        </svg>
    );
}

export function BackendRowIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="6" rx="1" />
            <rect x="3" y="14" width="18" height="6" rx="1" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
            <line x1="7" y1="17" x2="7.01" y2="17" />
        </svg>
    );
}

export function DatabaseRowIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
            <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
        </svg>
    );
}

export function AuthRowIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="9" rx="1" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
    );
}

export function AdminDashboardRowIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7.5" height="7.5" rx="1" />
            <rect x="13.5" y="3" width="7.5" height="7.5" rx="1" />
            <rect x="3" y="13.5" width="7.5" height="7.5" rx="1" />
            <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1" />
        </svg>
    );
}

export function ApiIntegrationRowIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    );
}

export function MaintenanceRowIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
}
