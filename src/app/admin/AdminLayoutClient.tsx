'use client'

import Link from "next/link";
import {Suspense, useCallback, useState} from "react";
import {useNavigation} from "@/hooks";
import {useAuth} from "@/auth/useAuth";
import {
    LayoutDashboard,
    Inbox,
    FileText,
    FolderKanban,
    Mail,
    Settings,
    PanelLeftClose,
    PanelLeftOpen,
    LogOut,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links: ReadonlyArray<{ to: string; label: string; end?: boolean; icon: LucideIcon }> = [
    { to: '/admin', label: 'Overview', end: true, icon: LayoutDashboard },
    { to: '/admin/requests/list', label: 'Requests', icon: Inbox },
    { to: '/admin/offers/list', label: 'Offers', icon: FileText },
    { to: '/admin/projects/list', label: 'Projects', icon: FolderKanban },
    { to: '/admin/messages', label: 'Messages', icon: Mail },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayoutClient({children}: { children: React.ReactNode }) {
    return <Suspense fallback={null}>
        <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
}

function AdminLayoutContent({children}: { children: React.ReactNode }) {
    const { auth, logout } = useAuth();
    const {location} = useNavigation()
    const [isCollapsed, setIsCollapsed] = useState(false);

    const resolveNavLinkClassName = useCallback(
        (isActive: boolean) =>
            cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition',
                isActive ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                isCollapsed && 'justify-center px-2'
            ),
        [isCollapsed]
    );

    const isLinkActive = useCallback(
        (link: (typeof links)[number]) => {
            if (link.end) {
                return location === link.to;
            }

            return location.startsWith(link.to);
        },
        [location]
    );

    const handleToggleCollapsed = useCallback(() => {
        setIsCollapsed((current) => !current);
    }, []);

    return <div className="min-h-screen bg-gray-50">
        <div className={cn('grid min-h-screen grid-cols-1', isCollapsed ? 'lg:grid-cols-[72px_1fr]' : 'lg:grid-cols-[260px_1fr]')}>
            <aside className={cn('flex h-full flex-col border-r border-gray-200 bg-white', isCollapsed ? 'items-center p-3' : 'p-6')}>
                <div className={cn('mb-8 flex w-full items-center', isCollapsed ? 'justify-center' : 'justify-between')}>
                    {!isCollapsed && (
                        <div>
                            <p className="text-xs tracking-[0.2em] text-gray-500 uppercase">CodeGetIt</p>
                            <h1 className="mt-1 text-2xl font-semibold text-gray-900">Admin Panel</h1>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleToggleCollapsed}
                        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
                    </button>
                </div>

                <nav className="w-full space-y-2">
                    {links.map((link) => {
                        const isActive = isLinkActive(link);
                        const Icon = link.icon;
                        return (
                            <Link key={link.to} href={link.to} title={link.label} className={resolveNavLinkClassName(isActive)}>
                                <Icon className="h-5 w-5 shrink-0" />
                                {!isCollapsed && <span>{link.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className={cn('mt-auto w-full', isCollapsed ? 'pt-10' : 'mt-10 rounded-xl border border-gray-200 bg-gray-50 p-3')}>
                    {isCollapsed ? (
                        <button
                            type="button"
                            onClick={logout}
                            title="Logout"
                            className="flex w-full items-center justify-center rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    ) : (
                        <>
                            <p className="text-xs text-gray-500">Signed in as</p>
                            <p className="truncate text-sm font-medium text-gray-900">{auth?.username}</p>
                            <button
                                type="button"
                                onClick={logout}
                                className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </aside>

            <main className="p-5 md:p-8">
                {children}
            </main>
        </div>
    </div>
}
