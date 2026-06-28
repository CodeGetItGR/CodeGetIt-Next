# Admin Full-Width Layout + Messages Tab Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the admin panel use full browser width via a collapsible icon-rail sidebar, and redesign the Messages tab as a table with expandable rows that surface the new per-message AI acknowledgment history.

**Architecture:** Two independent slices. (1) `AdminLayoutClient.tsx` gains an `isCollapsed` toggle that swaps the sidebar between a labeled nav and an icon-only rail, and drops the `max-w-360` cap so the content column fills the viewport. (2) The Messages page becomes a table backed by an extended `ContactMessageResponse` type; a small `messages` component group (`MessageAiStatusBadge`, `AiAcknowledgmentTimeline`) handles the AI-status derivation and the expanded-row timeline, composed into the rewritten list page.

**Tech Stack:** Next.js App Router, React 19, TypeScript (strict), Tailwind v4, `@tanstack/react-query`, `lucide-react` icons, `cn` helper (`clsx` + `tailwind-merge`) from `src/lib/utils.ts`.

**No test runner exists in this repo** (no Jest/Vitest, no `test` script). Verification per task is `npx tsc --noEmit` (type safety) and `npm run lint` (style/correctness rules, including the `react-refresh/only-export-components` rule this codebase has hit before — see `src/components/landing/process/stepIcons.ts` precedent of keeping non-component exports out of component files). A final manual pass uses the Claude Preview tools against the running dev server.

---

### Task 1: Extend contact message types for AI acknowledgments

**Files:**
- Modify: `src/api/types.ts:207-214`

- [ ] **Step 1: Confirm the current shape**

Read the existing block (already known, shown here for reference):

```ts
export interface ContactMessageResponse {
    id: UUID;
    name: string;
    email: string;
    message: string;
    language: OfferLanguage;
    createdAt: string;
}
```

- [ ] **Step 2: Replace it with the extended types**

Replace lines 207-214 of `src/api/types.ts` with:

```ts
export type AiAcknowledgmentStatus = 'SUCCESS' | 'ERROR' | 'RATE_LIMITED' | 'TIMEOUT';

export interface AiAcknowledgmentResponse {
    id: UUID;
    status: AiAcknowledgmentStatus;
    response: string | null;
    errorMessage: string | null;
    modelUsed: string;
    estimatedCost: number;
    totalTokens: number;
    createdAt: string;
}

export interface ContactMessageResponse {
    id: UUID;
    name: string;
    email: string;
    message: string;
    language: OfferLanguage;
    createdAt: string;
    updatedAt: string;
    aiAcknowledgments: AiAcknowledgmentResponse[];
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors. (The codebase currently has no test runner, so this is the correctness gate for this task.)

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/api/types.ts
git commit -m "Add AI acknowledgment fields to ContactMessageResponse"
```

---

### Task 2: Extend StatusBadge with AI acknowledgment statuses

**Files:**
- Modify: `src/components/admin/StatusBadge.tsx`

- [ ] **Step 1: Update the type import and union**

In `src/components/admin/StatusBadge.tsx`, change the top of the file from:

```ts
import type { GithubRepoStatus, OfferStatus, Priority, ProjectStatus, RequestStatus } from '@/api';

type StatusValue = RequestStatus | OfferStatus | ProjectStatus | Priority | GithubRepoStatus;
```

to:

```ts
import type { AiAcknowledgmentStatus, GithubRepoStatus, OfferStatus, Priority, ProjectStatus, RequestStatus } from '@/api';

type StatusValue = RequestStatus | OfferStatus | ProjectStatus | Priority | GithubRepoStatus | AiAcknowledgmentStatus;
```

`AiAcknowledgmentStatus` is exported from `src/api/types.ts` (Task 1) and re-exported through the `@/api` barrel — confirm this by checking `src/api/index.ts` exports `* from './types'` before relying on the `@/api` import path; if it doesn't, import from `@/api/types` directly instead.

- [ ] **Step 2: Add the four new colors to `colorMap`**

Add these entries to the `colorMap` object (after the existing `URGENT` entry, before the closing `};`):

```ts
    SUCCESS: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    ERROR: 'bg-rose-50 text-rose-700 border-rose-200',
    RATE_LIMITED: 'bg-amber-50 text-amber-700 border-amber-200',
    TIMEOUT: 'bg-amber-50 text-amber-700 border-amber-200',
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. If `@/api` doesn't re-export `AiAcknowledgmentStatus`, this step will fail with "has no exported member" — switch the import to `@/api/types` and re-run.

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/StatusBadge.tsx
git commit -m "Add AI acknowledgment statuses to StatusBadge"
```

---

### Task 3: Create the compact AI status badge for the messages table

**Files:**
- Create: `src/components/admin/messages/MessageAiStatusBadge.tsx`
- Create: `src/components/admin/messages/index.ts`
- Modify: `src/components/admin/index.ts`

This component derives a compact badge from a message's `aiAcknowledgments` array (newest-first, per the API contract) for use in the table's "AI status" column.

- [ ] **Step 1: Create the component**

Create `src/components/admin/messages/MessageAiStatusBadge.tsx`:

```tsx
import type { AiAcknowledgmentResponse } from '@/api';
import { StatusBadge } from '@/components/admin/StatusBadge';

interface MessageAiStatusBadgeProps {
    aiAcknowledgments: AiAcknowledgmentResponse[];
}

const labelByStatus: Record<AiAcknowledgmentResponse['status'], string> = {
    SUCCESS: 'AI sent',
    ERROR: 'AI failed',
    RATE_LIMITED: 'Rate limited',
    TIMEOUT: 'Timed out',
};

export const MessageAiStatusBadge = ({ aiAcknowledgments }: MessageAiStatusBadgeProps) => {
    if (aiAcknowledgments.length === 0) {
        return <StatusBadge value="DRAFT" label="Static fallback" />;
    }

    const latest = aiAcknowledgments[0];
    const retryCount = aiAcknowledgments.length - 1;
    const label = retryCount > 0 ? `${labelByStatus[latest.status]} · ${retryCount} retry` : labelByStatus[latest.status];

    return <StatusBadge value={latest.status} label={label} />;
};
```

This relies on `StatusBadge` accepting an optional `label` override (to show "Static fallback" / "AI sent · 1 retry" instead of the raw enum value). Add that now:

- [ ] **Step 2: Add an optional `label` override to `StatusBadge`**

In `src/components/admin/StatusBadge.tsx`, change the props and render to support an override:

```ts
interface StatusBadgeProps {
    value: StatusValue;
    label?: string;
}

export const StatusBadge = ({ value, label }: StatusBadgeProps) => {
    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${colorMap[value] ?? 'border-gray-200 bg-gray-100 text-gray-700'}`}
        >
            {label ?? value.replace(/_/g, ' ')}
        </span>
    );
};
```

- [ ] **Step 3: Create the barrel export**

Create `src/components/admin/messages/index.ts`:

```ts
export * from './MessageAiStatusBadge'
```

- [ ] **Step 4: Wire into the admin component barrel**

In `src/components/admin/index.ts`, add a line (alphabetically placed, matching existing style):

```ts
export * from './messages'
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Lint**

Run: `npm run lint`
Expected: no errors. Note `MessageAiStatusBadge.tsx` only exports the component plus a local (non-exported) `labelByStatus` const, so it won't trip the `react-refresh/only-export-components` rule that previously required extracting `stepIcons` into its own module.

- [ ] **Step 7: Commit**

```bash
git add src/components/admin/StatusBadge.tsx src/components/admin/messages src/components/admin/index.ts
git commit -m "Add MessageAiStatusBadge for compact AI status display"
```

---

### Task 4: Create the AI acknowledgment timeline for expanded rows

**Files:**
- Create: `src/components/admin/messages/AiAcknowledgmentTimeline.tsx`
- Modify: `src/components/admin/messages/index.ts`

- [ ] **Step 1: Create the component**

Create `src/components/admin/messages/AiAcknowledgmentTimeline.tsx`:

```tsx
import type { AiAcknowledgmentResponse } from '@/api';
import { StatusBadge } from '@/components/admin/StatusBadge';

interface AiAcknowledgmentTimelineProps {
    aiAcknowledgments: AiAcknowledgmentResponse[];
}

const formatCost = (cost: number) => `$${cost.toFixed(6)}`;

export const AiAcknowledgmentTimeline = ({ aiAcknowledgments }: AiAcknowledgmentTimelineProps) => {
    if (aiAcknowledgments.length === 0) {
        return (
            <p className="text-sm text-gray-500">
                Static fallback text was used (AI disabled or sender rate-capped).
            </p>
        );
    }

    return (
        <ol className="space-y-3">
            {aiAcknowledgments.map((entry) => (
                <li key={entry.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <StatusBadge value={entry.status} />
                        <time className="text-xs text-gray-500 tabular-nums">{new Date(entry.createdAt).toLocaleString()}</time>
                    </div>

                    {entry.response && (
                        <p className="mt-2 max-h-48 overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                            {entry.response}
                        </p>
                    )}

                    {entry.errorMessage && <p className="mt-2 text-sm text-rose-700">{entry.errorMessage}</p>}

                    <p className="mt-2 text-xs text-gray-500">
                        {entry.modelUsed} · {formatCost(entry.estimatedCost)} · {entry.totalTokens} tokens
                    </p>
                </li>
            ))}
        </ol>
    );
};
```

- [ ] **Step 2: Add to the barrel export**

Update `src/components/admin/messages/index.ts` to:

```ts
export * from './MessageAiStatusBadge'
export * from './AiAcknowledgmentTimeline'
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/messages
git commit -m "Add AiAcknowledgmentTimeline for expanded message rows"
```

---

### Task 5: Rewrite the Messages page as a table with expandable rows

**Files:**
- Modify: `src/app/admin/messages/page.tsx`

- [ ] **Step 1: Replace the page with the table + expandable-row version**

Replace the full contents of `src/app/admin/messages/page.tsx` with:

```tsx
'use client'

import { Fragment, useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contactMessageApi, type ContactMessageListQuery } from '@/api/contactMessages';
import type { ContactMessageResponse } from '@/api';
import { PaginationControls, MessageAiStatusBadge, AiAcknowledgmentTimeline } from '@/components';
import { usePaginationState } from '@/hooks';
import { ChevronDown, ChevronRight } from 'lucide-react';

const SNIPPET_LENGTH = 80;

const toSnippet = (message: string) =>
    message.length > SNIPPET_LENGTH ? `${message.slice(0, SNIPPET_LENGTH)}…` : message;

export default function ContactMessagesPage() {
    const { page, goToNextPage, goToPreviousPage } = usePaginationState();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const queryParams = useMemo<ContactMessageListQuery>(() => ({ page, size: 15, sort: 'createdAt,desc' }), [page]);

    const messagesQuery = useQuery({
        queryKey: ['contact-messages', queryParams],
        queryFn: () => contactMessageApi.list(queryParams),
    });

    const handleNextPage = useCallback(() => {
        goToNextPage(messagesQuery.data?.totalPages ?? 0);
    }, [goToNextPage, messagesQuery.data?.totalPages]);

    const handleToggleExpanded = useCallback((id: string) => {
        setExpandedId((current) => (current === id ? null : id));
    }, []);

    return (
        <div>
            <div className="mb-6">
                <p className="text-sm tracking-[0.16em] text-gray-500 uppercase">Inbox</p>
                <h2 className="mt-1 text-3xl font-bold text-gray-900">Contact messages</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Messages submitted via the marketing contact form.{' '}
                    <span className="font-medium text-gray-900">{messagesQuery.data?.totalElements ?? 0} total</span>
                </p>
            </div>

            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50 text-left text-xs tracking-wide text-gray-500 uppercase">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Message</th>
                                <th className="px-4 py-3">AI status</th>
                                <th className="px-4 py-3">Created</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {messagesQuery.data?.content.map((msg: ContactMessageResponse) => {
                                const isExpanded = expandedId === msg.id;

                                return (
                                    <Fragment key={msg.id}>
                                        <tr
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleToggleExpanded(msg.id)}
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-900">{msg.name}</td>
                                            <td className="px-4 py-3">
                                                <a
                                                    href={`mailto:${msg.email}`}
                                                    onClick={(event) => event.stopPropagation()}
                                                    className="text-gray-600 underline decoration-gray-300 underline-offset-2 hover:text-gray-900"
                                                >
                                                    {msg.email}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{toSnippet(msg.message)}</td>
                                            <td className="px-4 py-3">
                                                <MessageAiStatusBadge aiAcknowledgments={msg.aiAcknowledgments} />
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{new Date(msg.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 text-gray-400">
                                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="bg-gray-50">
                                                <td colSpan={6} className="px-4 py-4">
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{msg.message}</p>

                                                    <a
                                                        href={`mailto:${msg.email}?subject=Re: your message`}
                                                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                                    >
                                                        Reply via email
                                                    </a>

                                                    <h4 className="mt-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                                        AI acknowledgment history
                                                    </h4>
                                                    <div className="mt-2">
                                                        <AiAcknowledgmentTimeline aiAcknowledgments={msg.aiAcknowledgments} />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {messagesQuery.isLoading && <p className="mt-4 text-sm text-gray-500">Loading messages...</p>}
                {!messagesQuery.isLoading && messagesQuery.data?.content.length === 0 && (
                    <p className="mt-4 text-sm text-gray-500">No messages yet.</p>
                )}

                <div className="mt-4">
                    <PaginationControls
                        page={page}
                        totalPages={messagesQuery.data?.totalPages ?? 0}
                        onPrevious={goToPreviousPage}
                        onNext={handleNextPage}
                    />
                </div>
            </section>
        </div>
    );
};
```

`Fragment` (imported from `'react'`, not the `<>` shorthand) is used here because each iteration of `.map()` renders a `<tr>` / conditional `<tr>` pair and needs a single `key` — the shorthand fragment syntax can't carry a `key` prop, so the explicit `Fragment` component is required.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/messages/page.tsx
git commit -m "Redesign Messages tab as a table with expandable AI acknowledgment rows"
```

---

### Task 6: Full-width admin shell with collapsible icon-rail sidebar

**Files:**
- Modify: `src/app/admin/AdminLayoutClient.tsx`

- [ ] **Step 1: Replace the file contents**

Replace the full contents of `src/app/admin/AdminLayoutClient.tsx` with:

```tsx
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
```

Key differences from the original: the outer wrapper drops `mx-auto max-w-360` (the source of the width cap), `grid-cols-[260px_1fr]` becomes a two-way `cn()` choice driven by `isCollapsed`, the `<aside>` is now a flex column (`flex h-full flex-col`) so the account/logout block can be pinned to the bottom via `mt-auto`, and nav links render an icon (always) plus a label (only when expanded).

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/AdminLayoutClient.tsx
git commit -m "Make admin shell full-width with a collapsible icon-rail sidebar"
```

---

### Task 7: Manual verification in the browser

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Use the Claude Preview tool (`preview_start`) rather than a raw `npm run dev` shell command, per this project's UI-verification workflow.

- [ ] **Step 2: Log into the admin panel and check the full-width layout**

Navigate to `/admin`. Confirm the content area now extends to the edges of a wide viewport (no more centered 1440px cap). Confirm the sidebar still looks reasonable (not stretched).

- [ ] **Step 3: Check the collapse toggle**

Click the `PanelLeftClose` button. Confirm:
- Sidebar shrinks to an icon-only rail.
- Each icon has a hover tooltip matching its label (browser-native `title` tooltip).
- The active nav item (the current page) is still visually highlighted in icon form.
- The footer becomes a single icon-only logout button.
- Clicking `PanelLeftOpen` restores the full labeled sidebar.
- Reloading the page resets the sidebar to expanded (no persistence), per the design.

- [ ] **Step 4: Check the Messages table**

Navigate to `/admin/messages`. Confirm:
- Messages render as table rows (Name, Email, Message snippet, AI status, Created, chevron).
- The AI status badge matches expectations: gray "Static fallback" for messages with an empty `aiAcknowledgments` array, green "AI sent" for a latest `SUCCESS` entry, red "AI failed" for `ERROR`, amber for `RATE_LIMITED`/`TIMEOUT`.
- Clicking a row expands it inline to show the full message text, the "Reply via email" link, and the AI Acknowledgment History section (or the static-fallback sentence when the array is empty).
- Clicking the same row again collapses it; clicking a different row switches the expansion to that row.

- [ ] **Step 5: Capture proof**

Use `preview_screenshot` to capture: (a) the full-width expanded sidebar view, (b) the collapsed icon-rail view, (c) a Messages row expanded showing the AI acknowledgment timeline. Share these with the user as confirmation.

- [ ] **Step 6: Stop the dev server**

Use `preview_stop` if it was started solely for this verification pass and the user doesn't need it left running.
