# Admin full-width layout + Messages tab redesign

## Context

The admin shell (`AdminLayoutClient.tsx`) wraps all admin pages in a `max-w-360 mx-auto` grid, capping usable width at 1440px regardless of viewport size. Separately, the Contact Messages admin endpoint (`GET /api/contact-messages`) now returns an `aiAcknowledgments` history array per message (status, response text, model, cost, tokens), but the current Messages tab renders a flat card list with no way to surface that data, and doesn't scale well as message volume grows.

This change does two independent things:
1. Makes the admin panel use the full browser width, with a collapsible icon-rail sidebar so the content area gets the space instead of the sidebar.
2. Redesigns the Messages tab as a compact table with expandable rows that surface the new AI acknowledgment history per message.

## Part 1: Full-width admin shell + collapsible sidebar

### Layout

- Remove the `max-w-360 mx-auto` wrapper in `AdminLayoutClient.tsx` so the outer grid spans 100% of the viewport width.
- Grid columns become state-dependent: `grid-cols-[72px_1fr]` when collapsed, `grid-cols-[260px_1fr]` when expanded. The sidebar itself does not grow with viewport width in either state — only the content column (`<main>`) absorbs the extra space.
- Add `isCollapsed` state (`useState<boolean>(false)`) in `AdminLayoutContent`. No persistence (localStorage or otherwise) — always resets to expanded on load, per explicit decision.

### Sidebar — expanded mode

Unchanged from current behavior: text nav links, "CodeGetIt / Admin Panel" header, "Signed in as [username]" block with full Logout button.

### Sidebar — collapsed mode (icon rail)

- Nav links render as icon-only buttons (lucide-react, already a project dependency):
  - Overview → `LayoutDashboard`
  - Requests → `Inbox`
  - Offers → `FileText`
  - Projects → `FolderKanban`
  - Messages → `Mail`
  - Settings → `Settings`
- Each icon button has a `title` attribute matching its label (native tooltip on hover).
- Active-state styling (currently `bg-gray-900 text-white shadow-sm` vs hover gray) applies to the icon button container, same logic as `isLinkActive`.
- The "Signed in as" block collapses to a single icon-only Logout button (lucide `LogOut`), no username text, no "Signed in as" label.
- A toggle button (lucide `PanelLeftClose` when expanded / `PanelLeftOpen` when collapsed) sits near the top of the sidebar, above the nav, in both modes.

### Out of scope

- Persisting collapsed/expanded state across reloads.
- Auto-collapsing based on viewport width (this is a manual toggle only, not a responsive breakpoint behavior — though the existing `lg:` breakpoint behavior for the grid going single-column on small screens is preserved).

## Part 2: Messages tab redesign

### Data model changes

`src/api/types.ts` — extend `ContactMessageResponse`:

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

No changes to `src/api/contactMessages.ts` — the existing `list()` call already returns the richer shape; only the TS type grows.

### StatusBadge extension

`src/components/admin/StatusBadge.tsx` — add the four `AiAcknowledgmentStatus` values to `colorMap`:
- `SUCCESS` → green (reuse the existing emerald success styling)
- `ERROR` → red (reuse existing rose styling)
- `RATE_LIMITED` → amber
- `TIMEOUT` → amber

Extend the `StatusValue` union type to include `AiAcknowledgmentStatus`.

### Messages list page (`src/app/admin/messages/page.tsx`)

Replace the card list with a table (matching the existing Requests list visual pattern: `overflow-x-auto rounded-xl border` wrapping a `<table>`).

Columns:
1. **Name**
2. **Email** (mailto link, as today)
3. **Message** — first ~80 characters, truncated with `…`
4. **AI status** — derived badge (see below)
5. **Created** — date, as today
6. **Expand** — chevron button toggling the row

AI status badge derivation, based on `aiAcknowledgments[0]` (array is newest-first per the API contract):
- Empty array → gray badge, "Static fallback"
- Latest entry `status === 'SUCCESS'` → green badge, "AI sent"
- Latest entry `status === 'ERROR'` → red badge, "AI failed"
- Latest entry `status === 'RATE_LIMITED'` → amber badge, "Rate limited"
- Latest entry `status === 'TIMEOUT'` → amber badge, "Timed out"
- If `aiAcknowledgments.length > 1`, append a small suffix to the badge text, e.g. "AI sent · 1 retry" (count = `length - 1`).

### Expandable row content

Clicking a row or its chevron toggles an inline expanded section (no separate route — there is no `GET /api/contact-messages/{id}` endpoint, so a detail page would have no reliable way to load a single message on direct navigation/refresh; inline expansion reuses data already present in the list response).

Expanded section shows:
1. Full message text (untruncated, `whitespace-pre-wrap`).
2. "Reply via email" link (carried over from the current card design).
3. **AI Acknowledgment History**:
   - If `aiAcknowledgments` is empty: a single line, "Static fallback text was used (AI disabled or sender rate-capped)."
   - Otherwise: a vertical timeline, newest first (matching API order — no client-side re-sorting needed), one block per entry:
     - `StatusBadge` for that entry's `status`
     - `response` text, not truncated, in a scrollable container if long (e.g. `max-h-48 overflow-y-auto`) — per the guide's explicit note not to truncate aggressively since it's used for debugging guardrail rejections
     - `errorMessage` in red text, only when present (i.e. `status === 'ERROR'`)
     - A metadata line: `modelUsed`, `estimatedCost` formatted as USD to 6 decimals (e.g. `$0.001840`), `totalTokens`, and `createdAt` formatted as a locale datetime string

### Pagination

Page size stays at 15 (unchanged).

### Out of scope

- Any retry/edit action tied to AI acknowledgments — this is read-only monitoring data per the guide.
- A dedicated detail page/route for messages.
