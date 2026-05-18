# Shiksha Tech — Frontend

> The operating system for modern schools. Admissions, attendance, fees, communication, and academics — unified in one platform.

A Next.js 16 + React 19 + Tailwind v4 application for school administrators and the Shiksha Tech operator team. Built with shadcn/ui primitives, refined indigo branding, and a token-driven design system.

---

## Table of Contents

1. [Quick start](#quick-start)
2. [Tech stack](#tech-stack)
3. [Repository layout](#repository-layout)
4. [Routing map](#routing-map) — every URL → file
5. [Design system](#design-system) — tokens, primitives, conventions
6. [Component map](#component-map) — where to find any UI piece
7. [Data layer](#data-layer) — services, hooks, types
8. [Authentication & roles](#authentication--roles)
9. [Common tasks — "where do I…"](#common-tasks)
10. [Conventions](#conventions)
11. [The `new-design/` reference folder](#the-new-design-folder)

---

## Quick start

```bash
# Node ≥ 20 recommended
npm install
cp .env.example .env       # fill in NEXT_PUBLIC_API_URL
npm run dev                # http://localhost:3000
npm run build              # production build
npm run lint               # eslint
```

**Environment variables** (read in `process.env.NEXT_PUBLIC_*`):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend REST root, used by every service in [src/services/](src/services/) |

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** App Router (Turbopack) | [next.config.ts](next.config.ts) |
| UI runtime | **React 19** | strict mode, RSC where applicable |
| Styling | **Tailwind CSS v4** + `tw-animate-css` | tokens in [src/app/globals.css](src/app/globals.css) |
| Component primitives | **shadcn/ui** on Radix | wrapped in [src/components/ui/](src/components/ui/) |
| Forms | **react-hook-form** + **zod** | schemas live alongside types in [src/types/](src/types/) |
| Data fetching | **SWR** + thin wrapper in [src/hooks/useSWR.ts](src/hooks/useSWR.ts) | axios under the hood ([src/lib/api.ts](src/lib/api.ts)) |
| Charts | **recharts** | + bespoke inline SVG for marketing/dashboard hero |
| Rich text | **TipTap** | template editor — [src/components/notifications/templates/editor/](src/components/notifications/templates/editor/) |
| Toasts | **sonner** | configured in [src/components/ui/sonner.tsx](src/components/ui/sonner.tsx) |
| Icons | **lucide-react** | preferred over react-icons |
| Date | **date-fns** | dd-MM-yyyy for backend (`toDDMMYYYY` in [src/lib/utils.ts](src/lib/utils.ts)) |
| Fonts | Geist + Geist Mono + **Instrument Serif** (display) | wired in [src/app/layout.tsx](src/app/layout.tsx) |

---

## Repository layout

```
sheeksh-tech-frontend/
├── new-design/              ← READ-ONLY visual reference (HTML+JSX artboards)
├── src/
│   ├── app/                 ← Next.js App Router pages + layouts
│   │   ├── layout.tsx       ← root layout, fonts, Toaster
│   │   ├── globals.css      ← design tokens + Tailwind v4 @theme + utility classes
│   │   ├── page.tsx         ← public marketing landing page
│   │   ├── auth/
│   │   │   ├── school/page.tsx   ← school sign-in / signup (tabbed)
│   │   │   └── admin/page.tsx    ← system-admin sign-in
│   │   ├── dashboard/       ← school-admin product (auth-guarded)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx          ← overview
│   │   │   ├── sessions/
│   │   │   ├── classes/
│   │   │   ├── sections/
│   │   │   ├── students/
│   │   │   ├── teachers/
│   │   │   ├── guardians/
│   │   │   ├── subjects/
│   │   │   ├── templates/{new,edit/[id]}/
│   │   │   ├── notifications/draft/[templateId]/
│   │   │   ├── billing/
│   │   │   └── profile/
│   │   └── admin/           ← Shiksha Tech operator console (adminToken-guarded)
│   │       ├── layout.tsx
│   │       ├── schools/
│   │       ├── plans/
│   │       └── ledger/
│   ├── components/
│   │   ├── common/          ← ★ shared design primitives (see below)
│   │   ├── ui/              ← shadcn primitives, token-themed
│   │   ├── dashboard/       ← chrome (sidebar) + feature widgets
│   │   ├── admin/           ← system-admin chrome + plan modals
│   │   ├── landing/         ← marketing site header
│   │   ├── school/          ← auth tabs (login / register)
│   │   ├── session/         ← session dialog
│   │   ├── classes/         ← class rows, section CRUD dialog
│   │   ├── students/        ← table, dialogs, bulk upload, section selector
│   │   ├── teachers/        ← dialogs, assign-class, bulk upload
│   │   ├── guardians/       ← guardian mapping modal
│   │   ├── billing/         ← active plan card, store card, ledger table
│   │   └── notifications/
│   │       ├── templates/{TemplateBuilder, TemplateCard, CategoriesBar, VariablesBar, editor/}
│   │       └── draft/{RecipientSelector, LogicController, UserSearchList}
│   ├── hooks/               ← SWR-backed feature hooks (one per resource)
│   ├── services/            ← axios CRUD wrappers per resource
│   ├── lib/                 ← api client, helpers, tiptap utils, cn() helper
│   ├── types/               ← zod schemas + TypeScript types per resource
│   └── actions/             ← server actions (currently minimal)
└── public/                  ← static assets (favicon, etc.)
```

---

## Routing map

Every page is one file under `src/app/**/page.tsx`. App-Router conventions: `layout.tsx` wraps children, `[param]` is dynamic.

### Public

| URL | File | Notes |
|---|---|---|
| `/` | [src/app/page.tsx](src/app/page.tsx) | Marketing landing — hero, features, metrics, testimonials, pricing |
| `/auth/school` | [src/app/auth/school/page.tsx](src/app/auth/school/page.tsx) | Tabbed sign-in / signup for school admins |
| `/auth/admin` | [src/app/auth/admin/page.tsx](src/app/auth/admin/page.tsx) | Sign-in for Shiksha Tech operators |

### School Admin (requires `localStorage.authToken`)

Layout: [src/app/dashboard/layout.tsx](src/app/dashboard/layout.tsx) (sidebar + topbar)

| URL | File | Hooks used |
|---|---|---|
| `/dashboard` | [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx) | `useSWR` for class/student/teacher counts |
| `/dashboard/sessions` | [src/app/dashboard/sessions/page.tsx](src/app/dashboard/sessions/page.tsx) | `useSessions` |
| `/dashboard/classes` | [src/app/dashboard/classes/page.tsx](src/app/dashboard/classes/page.tsx) | `useClasses` + `useSections` |
| `/dashboard/sections` | [src/app/dashboard/sections/page.tsx](src/app/dashboard/sections/page.tsx) | direct axios |
| `/dashboard/students` | [src/app/dashboard/students/page.tsx](src/app/dashboard/students/page.tsx) | `useStudents` + `useClasses` + `useSections` |
| `/dashboard/teachers` | [src/app/dashboard/teachers/page.tsx](src/app/dashboard/teachers/page.tsx) | `useTeachers` + mapping endpoint |
| `/dashboard/guardians` | [src/app/dashboard/guardians/page.tsx](src/app/dashboard/guardians/page.tsx) | `userService.search({role:"GUARDIAN"})` |
| `/dashboard/subjects` | [src/app/dashboard/subjects/page.tsx](src/app/dashboard/subjects/page.tsx) | `useSubjects` |
| `/dashboard/templates` | [src/app/dashboard/templates/page.tsx](src/app/dashboard/templates/page.tsx) | `notificationService.templates.list()` |
| `/dashboard/templates/new` | [src/app/dashboard/templates/new/page.tsx](src/app/dashboard/templates/new/page.tsx) | TipTap builder |
| `/dashboard/templates/edit/[id]` | [src/app/dashboard/templates/edit/[id]/page.tsx](src/app/dashboard/templates/edit/[id]/page.tsx) | TipTap builder |
| `/dashboard/notifications` | [src/app/dashboard/notifications/page.tsx](src/app/dashboard/notifications/page.tsx) | `notificationService.notifications.admin()` |
| `/dashboard/notifications/draft/[templateId]` | [src/app/dashboard/notifications/draft/[templateId]/page.tsx](src/app/dashboard/notifications/draft/[templateId]/page.tsx) | recipient selector + logic |
| `/dashboard/billing` | [src/app/dashboard/billing/page.tsx](src/app/dashboard/billing/page.tsx) | `billingService` (plans, purchased, ledger) |
| `/dashboard/profile` | [src/app/dashboard/profile/page.tsx](src/app/dashboard/profile/page.tsx) | `userService.getProfile` |

### System Admin (requires `localStorage.adminToken`)

Layout: [src/app/admin/layout.tsx](src/app/admin/layout.tsx)

| URL | File | Service |
|---|---|---|
| `/admin/schools` | [src/app/admin/schools/page.tsx](src/app/admin/schools/page.tsx) | `adminService.getSchools()` |
| `/admin/plans` | [src/app/admin/plans/page.tsx](src/app/admin/plans/page.tsx) | `adminService.getNotificationPlans()` |
| `/admin/ledger` | [src/app/admin/ledger/page.tsx](src/app/admin/ledger/page.tsx) | `adminService.getLedger(page, size)` |

---

## Design system

The visual language is **refined indigo + warm neutrals**, modeled on the artboards in [new-design/](new-design/).

### Tokens — `src/app/globals.css`

All design tokens are declared as CSS custom properties on `:root` and exposed to Tailwind via the `@theme inline` block. Use Tailwind utilities like `bg-brand`, `text-ink-3`, `border-divider`, `bg-surface-2` directly.

| Group | Tokens | Tailwind class examples |
|---|---|---|
| **Brand (indigo)** | `--brand`, `--brand-hover`, `--brand-soft`, `--brand-soft-2`, `--brand-ink` | `bg-brand`, `text-brand-ink` |
| **Accent (teal)** | `--teal`, `--teal-soft`, `--teal-ink` | `bg-teal-soft`, `text-teal-ink` |
| **Semantic** | `--success`, `--warning`, `--danger`, `--info` (each with `-soft` and `-ink`) | `bg-warning-soft`, `text-warning-ink` |
| **Neutrals** | `--bg`, `--bg-2`, `--surface`, `--surface-2`, `--surface-3`, `--border`, `--border-strong`, `--divider` | `bg-bg-2`, `border-divider` |
| **Ink (text)** | `--ink`, `--ink-2`, `--ink-3`, `--ink-4` | `text-ink-2`, `text-ink-3` |
| **Fonts** | `--font-sans` (Geist), `--font-mono` (Geist Mono), `--font-display` (Instrument Serif italic) | `font-sans`, `font-mono`, `font-display` or `.serif` utility |
| **Radii / shadows / motion** | `--r-*`, `--shadow-*`, `--ease`, `--t-*` | use raw vars in inline styles when needed |

The shadcn vars (`--background`, `--primary`, etc.) are **re-routed** to these tokens at the bottom of `:root`, so every shadcn primitive auto-inherits the new look without any rewrite.

### Utility classes (defined in `globals.css`)

- `.serif` — Instrument Serif (display)
- `.mono` — Geist Mono
- `.eyebrow` — uppercase 11px label
- `.tnum` — tabular-nums for numbers
- `.muted`, `.muted-2` — secondary/tertiary text colors
- `.app-shell` — sidebar(248px) + content grid (responsive to 1 col < lg)
- `.sidebar`, `.sb-org`, `.sb-section`, `.sb-section-label`, `.sb-item`, `.sb-user`, `.sb-footer` — sidebar chrome
- `.tile`, `.tile-brand|teal|success|warning|danger|info` — colored icon container
- `.stat`, `.stat .label`, `.stat .value`, `.stat .delta` — KPI block
- `.chip`, `.chip.active` — pill filter
- `.empty`, `.empty .ill` — empty state
- `.skel` — animated skeleton shimmer
- `.kbd` — keyboard key chip

### Shared primitives — `src/components/common/`

Centralized building blocks. **Use these everywhere** — do not re-implement variants inline.

| Component | File | When to use |
|---|---|---|
| `<Logo />` | [logo.tsx](src/components/common/logo.tsx) | App + marketing logo. `size: sm/md/lg/xl`, `showWord`, `invert` (for dark backgrounds). |
| `<Tile icon={...} tone="..." />` | [tile.tsx](src/components/common/tile.tsx) | Colored icon container — for stats, feature cards, list rows. |
| `<Stat label value delta icon />` | [stat.tsx](src/components/common/stat.tsx) | KPI card with optional ↑/↓ delta. |
| `<PageHeader title subtitle breadcrumb actions />` | [page-header.tsx](src/components/common/page-header.tsx) | Top of every dashboard / admin page. Use instead of bespoke `<h1>` blocks. |
| `<SectionCard title actions footer noPadding />` | [section-card.tsx](src/components/common/section-card.tsx) | Bordered card with header/body/footer. Use for any boxed content section. |
| `<EmptyState icon title description action />` | [empty-state.tsx](src/components/common/empty-state.tsx) | Rendered when a list is empty. |
| `<InitialsAvatar name size tone />` | [initials-avatar.tsx](src/components/common/initials-avatar.tsx) | Auto-tone avatar from name initials. `pickTone()` exported for deterministic coloring. |
| `<Chip active>...</Chip>` | [chip.tsx](src/components/common/chip.tsx) | Filter pill. |
| `<Eyebrow>...</Eyebrow>` | [eyebrow.tsx](src/components/common/eyebrow.tsx) | Uppercase label above headings. |
| `<AuthShell side="left|right" quote quoteName />` | [auth-shell.tsx](src/components/common/auth-shell.tsx) | Two-column auth layout (dark testimonial + form). |
| `<DataTable data columns isLoading onEdit onDelete />` | [data-table.tsx](src/components/common/data-table.tsx) | Generic table with skeletons + empty state. |
| `<CrudDialog title form onSubmit size="default|lg|xl" />` | [crud-dialog.tsx](src/components/common/crud-dialog.tsx) | Wrapped dialog for create/edit forms. |

### shadcn primitives — `src/components/ui/`

All shadcn components have been **re-themed** to the design tokens. New variants worth knowing:

| Component | Variants / sizes |
|---|---|
| `Button` | variants: `default`, `secondary`, `outline`, `ghost`, `soft`, `destructive`, `danger-soft`, `link`. sizes: `xs`, `sm`, `default`, `lg`, `icon`, `icon-sm`, `icon-xs`. |
| `Badge` | variants: `default`, `brand`, `teal`, `success`, `warning`, `danger`, `info`, `outline`. sizes: `sm`, `md`, `lg`. `dot` prop renders a leading dot. |
| `Input` / `Textarea` / `Select` | 38px height, brand focus ring. |
| `Tabs` | `TabsList` accepts `variant="pill"` (default) or `variant="underline"`. |
| `Dialog` | `DialogHeader`/`DialogFooter` are pre-padded; rounded-2xl, shadow-xl. A new `DialogBody` export wraps body padding. |
| `Progress` | new `tone="brand|success|warning|danger"` prop. |
| `Skeleton` | renders the `.skel` shimmer. |

---

## Component map

If you're looking for "where does X live", start here.

### Chrome (sidebars, layouts)

| Where | File |
|---|---|
| School-admin sidebar (nav, org block, user footer) | [src/components/dashboard/sidebar.tsx](src/components/dashboard/sidebar.tsx) |
| School-admin layout (mobile header, sidebar wrapper) | [src/app/dashboard/layout.tsx](src/app/dashboard/layout.tsx) |
| System-admin sidebar | [src/components/admin/Sidebar.tsx](src/components/admin/Sidebar.tsx) |
| System-admin layout | [src/app/admin/layout.tsx](src/app/admin/layout.tsx) |
| Marketing site header | [src/components/landing/header.tsx](src/components/landing/header.tsx) |
| Auth shell (split screen) | [src/components/common/auth-shell.tsx](src/components/common/auth-shell.tsx) |
| Logout button | [src/components/logout-btn.tsx](src/components/logout-btn.tsx) |

### Feature components by domain

| Domain | Files |
|---|---|
| Sessions | [src/components/session/session-dialog-content.tsx](src/components/session/session-dialog-content.tsx) |
| Classes & sections | [src/components/classes/class-row.tsx](src/components/classes/class-row.tsx) · [src/components/classes/section-crud-dialog.tsx](src/components/classes/section-crud-dialog.tsx) |
| Students | [src/components/students/students-table.tsx](src/components/students/students-table.tsx) · [src/components/students/student-dialog-content.tsx](src/components/students/student-dialog-content.tsx) · [src/components/students/section-selector.tsx](src/components/students/section-selector.tsx) · [src/components/students/UploadModal.tsx](src/components/students/UploadModal.tsx) |
| Teachers | [src/components/teachers/teacher-dialog-content.tsx](src/components/teachers/teacher-dialog-content.tsx) · [src/components/teachers/assign-dialog.tsx](src/components/teachers/assign-dialog.tsx) · [src/components/teachers/upload-modal.tsx](src/components/teachers/upload-modal.tsx) |
| Guardians | [src/components/guardians/GuardiansMappingModal.tsx](src/components/guardians/GuardiansMappingModal.tsx) |
| Templates (notification) | [src/components/notifications/templates/TemplateCard.tsx](src/components/notifications/templates/TemplateCard.tsx) · [src/components/notifications/templates/TemplateBuilder.tsx](src/components/notifications/templates/TemplateBuilder.tsx) · [src/components/notifications/templates/editor/](src/components/notifications/templates/editor/) |
| Notification drafts | [src/components/notifications/draft/RecipientSelector.tsx](src/components/notifications/draft/RecipientSelector.tsx) · [src/components/notifications/draft/LogicController.tsx](src/components/notifications/draft/LogicController.tsx) · [src/components/notifications/draft/UserSearchList.tsx](src/components/notifications/draft/UserSearchList.tsx) |
| Billing | [src/components/billing/ActivePlanCard.tsx](src/components/billing/ActivePlanCard.tsx) · [src/components/billing/PlanStoreCard.tsx](src/components/billing/PlanStoreCard.tsx) · [src/components/billing/LedgerTable.tsx](src/components/billing/LedgerTable.tsx) · [src/components/billing/BillingSkeleton.tsx](src/components/billing/BillingSkeleton.tsx) |
| Admin plans | [src/components/admin/plans/PurchasePlanModal.tsx](src/components/admin/plans/PurchasePlanModal.tsx) · [src/components/admin/plans/CreatePlanForm.tsx](src/components/admin/plans/CreatePlanForm.tsx) |
| School auth tabs | [src/components/school/login-tab.tsx](src/components/school/login-tab.tsx) · [src/components/school/register-tab.tsx](src/components/school/register-tab.tsx) |

---

## Data layer

### Services — `src/services/`

Each service is an axios CRUD wrapper for one backend resource. They share a common pattern via [src/services/baseCRUDService.ts](src/services/baseCRUDService.ts). All require `localStorage.authToken` (or `adminToken` for admin endpoints).

| Service | Endpoints used by |
|---|---|
| `sessionService` | `/dashboard/sessions` |
| `classService` | `/dashboard/classes`, overview |
| `sectionService` | `/dashboard/sections`, students page |
| `studentService` | `/dashboard/students` |
| `teacherService` | `/dashboard/teachers` (+ `createClassMap`, `getMapping`) |
| `subjectService` | `/dashboard/subjects` |
| `guardianService` | `/dashboard/guardians` |
| `userService` | `/dashboard/profile`, user search (guardians) |
| `notificationService` | templates + notifications + drafts |
| `billingService` | `/dashboard/billing` (plans, purchased, ledger) |
| `adminService` | `/admin/*` (schools, plans, ledger) |

### Hooks — `src/hooks/`

SWR-backed feature hooks. Most expose `{ data, isLoading, create, update, remove, mutate }`. A generic `useCRUD` factory in [src/hooks/useCRUD.ts](src/hooks/useCRUD.ts) powers most of them. The thin `useSWR` wrapper at [src/hooks/useSWR.ts](src/hooks/useSWR.ts) is used in the dashboard overview for ad-hoc lookups.

### Types & Zod schemas — `src/types/`

One file per resource. Each file exports:
- A TypeScript type for the entity (`SessionItem`, `StudentItem`, `TeacherItem`, etc.)
- A zod schema for the create/edit form (`sessionSchema`, `studentSchema`, …) consumed by react-hook-form

The cross-cutting `src/types/index.ts` re-exports common DTOs (`ClassDto`, `StudentDto`, `TeacherDto`, …).

### lib

| File | Purpose |
|---|---|
| [src/lib/api.ts](src/lib/api.ts) | Axios instance with auth-token interceptor + error normalizer. |
| [src/lib/utils.ts](src/lib/utils.ts) | `cn()` (tailwind-merge + clsx), `formatDate`, `toDDMMYYYY` (backend format), `decodeJWT`. |
| [src/lib/helpers.ts](src/lib/helpers.ts) | `extractErrorMessage(err, fallback)` for axios errors. |
| [src/lib/tiptap-utils.ts](src/lib/tiptap-utils.ts) | `convertHtmlVariablesToUpperCase` etc. for notification template HTML. |

---

## Authentication & roles

Tokens are stored in `localStorage` (no cookies). The sidebar's `useSession()` hook in [src/components/dashboard/sidebar.tsx](src/components/dashboard/sidebar.tsx) decodes the JWT to pull `name`, `email`, `role`.

| Token | Set on | Used in | Cleared by |
|---|---|---|---|
| `authToken` | Successful `POST /auth/login` with `isSuperAdmin: true` (school-side) | `/dashboard/*`, school admin API calls | Logout from sidebar, `dashboard/layout` guard, `LogoutBtn` |
| `adminToken` | Successful `POST /auth/login` with `isSystemAdmin: true` (operator-side) | `/admin/*` | Same as above |

Route guards live in the two dashboard layouts — they redirect to `/` if the relevant token is absent.

---

## Common tasks

### "I want to change the primary brand color"
Edit `--brand`, `--brand-hover`, `--brand-soft`, `--brand-soft-2`, `--brand-ink` in `:root` of [src/app/globals.css](src/app/globals.css). Everything (buttons, badges, sidebar, marketing) inherits.

### "Where do I add a new dashboard page?"
1. Create `src/app/dashboard/<slug>/page.tsx`.
2. Add nav entry in [src/components/dashboard/sidebar.tsx](src/components/dashboard/sidebar.tsx) (`workspaceNav` or `communicationsNav` array).
3. Use `<PageHeader />`, `<SectionCard />`, and the shared primitives — don't roll bespoke chrome.
4. Wrap data in an SWR hook (mirror `useSessions.ts` pattern) under `src/hooks/`.

### "I need a CRUD form / dialog"
Use `<CrudDialog>` from [src/components/common/crud-dialog.tsx](src/components/common/crud-dialog.tsx). Pass it a `react-hook-form` instance and `onSubmit`. See [src/app/dashboard/sessions/page.tsx](src/app/dashboard/sessions/page.tsx) for the canonical pattern.

### "I need a data table"
Use `<DataTable>` from [src/components/common/data-table.tsx](src/components/common/data-table.tsx). It handles loading skeletons, empty states, and row actions. See [src/app/dashboard/teachers/page.tsx](src/app/dashboard/teachers/page.tsx).

### "I need a colored icon container"
`<Tile tone="brand|teal|success|warning|danger|info" icon={LucideIcon} size={36} />`. See almost any dashboard page.

### "I need a stat / KPI"
`<Stat label="Total students" value="1,248" delta="+24 this month" icon={GraduationCap} />`. Used in the overview and notifications pages.

### "Add a new badge tone"
Extend `cva` in [src/components/ui/badge.tsx](src/components/ui/badge.tsx) — define a new variant pointing at the appropriate `--*-soft` / `--*-ink` token pair.

### "Add a new toast"
Import `toast` from `sonner` anywhere. The Toaster lives in [src/app/layout.tsx](src/app/layout.tsx) and is themed via [src/components/ui/sonner.tsx](src/components/ui/sonner.tsx).

### "Test a UI change at scale"
Run `npm run dev` and visit the sections in order:
- `/` → marketing
- `/auth/school` → tabbed split-screen
- `/dashboard` → KPI overview (mobile + desktop)
- `/dashboard/students` → tables (the densest layout)
- `/admin/schools` → operator console

### "Where are the design references?"
[new-design/](new-design/) — open `index.html` in any browser (it bundles React + Babel via UNPKG). Artboards are React components in [new-design/artboards/](new-design/artboards/). This folder is **read-only** — it's the visual contract the implementation matches.

---

## Conventions

### File naming
- Pages: `page.tsx`. Layouts: `layout.tsx`. Dynamic: `[slug]/page.tsx`.
- Components: kebab-case files exporting PascalCase components — `data-table.tsx → DataTable`.
- Hooks: camelCase, prefix `use*` — `useSessions.ts`.
- Services: camelCase, suffix `Service` — `studentService.ts`.

### Styling
- Prefer Tailwind utility classes pointing at design tokens (`bg-surface`, `text-ink-3`).
- Reach for raw CSS vars (`style={{ background: "var(--brand-soft)" }}`) only when you need a dynamic value.
- **Never** hard-code hex colors in components — go through a token.
- For icons, use `lucide-react` with `size={NUMBER}` and `strokeWidth={1.6}` to match the design.
- The display serif (`.serif` or `font-display`) should be reserved for **branding moments** — hero headlines, big metric numbers, session year names, quote marks.

### Forms
- Always use `react-hook-form` + `zodResolver`.
- Schemas live in `src/types/<resource>.ts`.
- Error messages render via `<FormMessage />` or a small `<ErrorMessage>` component (see [src/components/students/student-dialog-content.tsx](src/components/students/student-dialog-content.tsx)).

### Data
- Fetch via SWR hooks; mutate via the hook's own `create` / `update` / `remove`.
- For one-off lookups in a page, the thin `useSWR` wrapper from [src/hooks/useSWR.ts](src/hooks/useSWR.ts) is fine.
- Backend expects `dd-MM-yyyy` dates — convert via `toDDMMYYYY()` from [src/lib/utils.ts](src/lib/utils.ts).

### Responsiveness
- The app is mobile-first. Breakpoints used: `sm` (≥640), `md` (≥768), `lg` (≥1024), `xl` (≥1280).
- Sidebar collapses to off-canvas under `lg`; a topbar with a hamburger appears.
- Tables use `overflow-x-auto` (built into the `<Table>` wrapper) so they scroll on small screens.

---

## The `new-design/` folder

This is a **read-only visual reference** delivered alongside the implementation.

```
new-design/
├── index.html               ← open in a browser to see every artboard
├── design-canvas.jsx        ← canvas + section/artboard wrappers
├── styles/
│   ├── tokens.css           ← canonical design tokens (mirrored into globals.css)
│   └── components.css       ← canonical primitive styles (mirrored into globals.css + ui/*)
└── artboards/
    ├── icons.jsx            ← inline SVG icon set
    ├── primitives.jsx       ← reusable Btn/Badge/Avatar/Field/Sidebar/Topbar JSX
    ├── brand.jsx            ← logo, color, typography, spacing
    ├── components.jsx       ← buttons, cards, tables, modals, menus, tabs, toasts, banners
    ├── marketing.jsx        ← landing page
    ├── auth.jsx             ← sign-in, signup, forgot password
    ├── dashboard.jsx        ← overview + every dashboard page
    ├── sysadmin.jsx         ← institutions, plans, ledger
    ├── states.jsx           ← empty, loading, error, validation
    ├── mobile.jsx           ← responsive previews
    └── print.jsx            ← report card + receipt
```

When in doubt about a visual detail, **check the artboard first.**

---

## Scripts

```bash
npm run dev      # Turbopack dev server
npm run build    # production build
npm start        # serve the production build
npm run lint     # eslint (next + typescript-eslint configs)
```

---

## Architecture diagram

```
                ┌──────────────────────────────────────────┐
                │            Next.js App Router            │
                │  /  /auth/*  /dashboard/*  /admin/*      │
                └────────────────────┬─────────────────────┘
                                     │
                ┌────────────────────┼─────────────────────┐
                │                    │                     │
        ┌───────▼─────────┐  ┌───────▼────────┐   ┌────────▼────────┐
        │   layouts +     │  │  page (RSC /   │   │  server actions │
        │   chrome        │  │   "use client")│   │  (minimal)      │
        │   (sidebar,     │  └───────┬────────┘   └─────────────────┘
        │    topbar)      │          │
        └─────────────────┘          │
                                     │
                 ┌───────────────────┼───────────────────┐
                 │                   │                   │
         ┌───────▼─────┐     ┌───────▼─────┐     ┌───────▼──────┐
         │ common/     │     │   ui/       │     │  feature     │
         │ Primitives  │     │ shadcn      │     │  components  │
         │ (PageHeader,│     │ (re-themed) │     │  (students/, │
         │  Stat, Tile,│     │             │     │  teachers/,  │
         │  SectionCard│     │             │     │  billing/,…) │
         │  …)         │     │             │     │              │
         └─────┬───────┘     └─────┬───────┘     └──────┬───────┘
               │                   │                    │
               └───────────┬───────┴────────────────────┘
                           │
                ┌──────────▼──────────┐
                │   globals.css       │
                │   design tokens     │
                │   (single source of │
                │    visual truth)    │
                └─────────────────────┘

   Pages call hooks (src/hooks/*) → services (src/services/*) → axios (src/lib/api.ts) → REST backend
```

---

## License

Proprietary — © Shiksha Tech.
