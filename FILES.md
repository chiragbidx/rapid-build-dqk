<<<<<<< HEAD
# FILES.md — Structural & Architectural Index (Next.js SaaS Starter)

> Note: This codebase is a **Next.js 16 App Router** template, not a NestJS project. The sections below map the requested NestJS concepts to their closest equivalents in this stack (route handlers, server actions, middleware, and feature segments).

## 1) High-Level Overview
- **Purpose**: Full-stack SaaS starter providing auth, team management, billing (Stripe), and a dashboard-ready UI scaffold.
- **Architecture style**: Modular by feature (App Router segments), layered by concern (`app` UI/routes, `lib` domain/services, `components` UI system, `scripts` ops). Server actions and route handlers play the “controller” role; `lib` holds “services.”
- **Key technologies**: Next.js 16 App Router, React 19, TypeScript, Drizzle ORM (PostgreSQL), Stripe SDK, Zod validation, bcryptjs, SWR for client data fetching, Tailwind CSS 4 (via PostCSS 8), Next middleware for auth/session refresh.

## 2) Application Entry Points
- **`app/layout.tsx`**: Root React tree wrapper; sets fonts, `<SWRConfig>` with cached `/api/user` and `/api/team`, and global `<html>/<body>` structure.
- **`middleware.ts`**: Runs before requests; guards `/dashboard*`, enforces session cookie, refreshes JWT on GET, redirects unauthenticated users to `/sign-in`.
- **Route handlers (Next “API”)**: Located under `app/api/**/route.ts` — process HTTP requests server-side.
- **Server actions**: Functions in `app/(login)/actions.ts`, `lib/payments/actions.ts` invoked via `<form action=...>`; act as controller-like entrypoints for mutations.
- **Global pipes/guards/interceptors/filters**: Not Nest-style; instead:
  - Guards: `middleware.ts` route protection; `validatedAction*` wrappers enforce auth + validation per action.
  - Pipes/validation: Zod schemas inside server actions.
  - Interceptors/filters: None globally; error handling is local (try/catch in handlers).
- **Bootstrap logic**: Next.js runtime handles bootstrap; environment is configured via `.env` read in `lib/db/drizzle.ts` and `lib/auth/session.ts`.

## 3) Module Index (feature/shared/infrastructure)
- **Feature modules (UI + actions)**
  - `app/(login)/` — Auth flow (sign-in/up UI + server actions). Public.
  - `app/(dashboard)/` — Marketing landing + authenticated dashboard shell and feature pages (team, general, activity, security, pricing).
  - `app/api/stripe/*` — Stripe webhook + checkout completion endpoints (backend-only).
  - `app/api/user`, `app/api/team` — Authenticated data fetchers for SWR.
- **Shared modules**
  - `components/ui/*` — Reusable UI primitives (buttons, cards, inputs, dropdowns, avatar, etc.).
  - `lib/auth/*` — Auth/session utilities and action validation helpers.
  - `lib/payments/*` — Stripe client plus billing-related actions.
  - `lib/db/*` — DB client, schema, queries, seeding/setup helpers.
  - `lib/cache.ts`, `lib/utils.ts` — Generic helpers.
- **Infrastructure modules**
  - `middleware.ts` — Edge/server middleware for auth.
  - `drizzle.config.ts`, `railway.json`, `Dockerfile`, `next.config.ts`, `postcss.config.mjs`, `tsconfig.json` — tooling/runtime config.
  - `scripts/*.js` — Ops/automation (treated as immutable infrastructure).

## 4) Controllers (Route Handlers & Server Actions)
- **HTTP Route Handlers**
  - `GET /api/user` → `app/api/user/route.ts` — returns current user (or null); uses `getUser()`.
  - `GET /api/team` → `app/api/team/route.ts` — returns team for current user; uses `getTeamForUser()`.
  - `GET /api/stripe/checkout` → `app/api/stripe/checkout/route.ts` — post-checkout flow; validates Stripe session, updates team subscription, refreshes session cookie, redirects to `/dashboard`.
  - `POST /api/stripe/webhook` → `app/api/stripe/webhook/route.ts` — validates Stripe signature, handles subscription updated/deleted events via `handleSubscriptionChange`.
- **Server Actions (mutation endpoints)**
  - Auth & account: `signIn`, `signUp`, `signOut`, `updatePassword`, `deleteAccount`, `updateAccount` in `app/(login)/actions.ts`.
  - Team membership: `removeTeamMember`, `inviteTeamMember` in same file.
  - Billing: `checkoutAction`, `customerPortalAction` in `lib/payments/actions.ts`.
- **DTOs / validation per endpoint**
  - Zod schemas inside `actions.ts` (e.g., `signInSchema`, `signUpSchema`, `updatePasswordSchema`, `inviteTeamMemberSchema`) parse `FormData` into typed payloads; errors returned as `{ error }`.
  - Stripe webhooks use raw body + signature; rely on Stripe SDK parsing.
- **Guards / decorators**
  - `validatedActionWithUser` enforces authentication before running an action.
  - `withTeam` loads team and redirects to `/sign-in` if absent (used by billing actions).
- **Related services**
  - Auth actions depend on `lib/auth/session.ts` (hash/compare/set/verify), `lib/db/queries.ts`, and Drizzle tables.
  - Billing actions depend on `lib/payments/stripe.ts` and Stripe API.

## 5) Services & Providers
- **`lib/db/drizzle.ts`** — Drizzle client (singleton) wrapping `postgres` driver; requires `POSTGRES_URL`.
- **`lib/db/queries.ts`** — Query helpers: `getUser`, `getTeamForUser`, `getActivityLogs`, `getTeamByStripeCustomerId`, `updateTeamSubscription`, `getUserWithTeam`. Side effects: DB reads/writes; session verification via JWT.
- **`lib/auth/session.ts`** — Stateless helpers for hashing/comparing passwords (bcryptjs), signing/verifying JWTs (jose), and managing `session` cookie (httpOnly, secure, SameSite=None). Stateless except cookie I/O; effectively singleton utilities.
- **`lib/auth/middleware.ts`** — Higher-order action wrappers providing validation + auth checks; redirects via Next navigation.
- **`lib/payments/stripe.ts`** — Configured Stripe SDK client (singleton), checkout/customer-portal creation, webhook subscription updater, cached product/price fetchers (`unstable_cache`).
- **`lib/payments/actions.ts`** — Server actions orchestrating billing flows; depend on `withTeam` guard.
- **`lib/cache.ts` / `lib/utils.ts`** — Small stateless helpers (caching wrapper, className merge).
- **Statefulness**: All services are stateless singletons (module-scope instances). No request-scoped providers.

## 6) Data Layer
- **ORM**: Drizzle ORM with PostgreSQL driver (`postgres`).
- **Schema**: `lib/db/schema.ts` defines tables `users`, `teams`, `team_members`, `activity_logs`, `invitations` plus relations and TS types.
- **Repositories/queries**: Centralized in `lib/db/queries.ts`; actions sometimes query directly via `db`.
- **Migrations**: SQL snapshots in `lib/db/migrations/**` generated by drizzle-kit; `_journal.json` tracks applied migrations. Avoid manual edits.
- **Transactions**: Not currently used; writes are individual statements.
- **Seeding & setup**: `lib/db/seed.ts` seeds initial user/team and Stripe products; `lib/db/setup.ts` interactive script to create `.env`, Docker PG, and Stripe webhook.

## 7) DTOs, Schemas & Validation
- **Locations**: Zod schemas embedded in `app/(login)/actions.ts` for auth/account/team mutations.
- **Strategy**: `validatedAction` / `validatedActionWithUser` wrap server actions to parse `FormData` → typed DTOs, returning error objects on failure.
- **Mapping**: DTOs map directly to Drizzle inserts/updates (`NewUser`, `NewTeam`, etc. from `schema.ts`). API responses are plain JSON of Drizzle result rows (no dedicated response DTOs).

## 8) Cross-Cutting Concerns
- **Auth**: JWT signed with `AUTH_SECRET`, stored in `session` cookie (httpOnly, Secure, SameSite=None, 1-day TTL). Middleware refreshes token on GET; guards protect `/dashboard`.
- **Authorization**: Role stored on `users.role` (owner/member); UI checks owner before inviting/removing members.
- **Validation**: Zod per action; Stripe webhook verification with signed payload.
- **Logging/Tracing**: Minimal; console errors in middleware/handlers; no structured logging.
- **Error handling**: Local try/catch; user-facing errors returned via action state.
- **Caching**: `unstable_cache` for Stripe price/product fetches; SWR on client with fallback data provided in `app/layout.tsx`.

## 9) Configuration & Environment
- **Config files**: `next.config.ts` (Next), `drizzle.config.ts` (ORM), `postcss.config.mjs` (Tailwind 4), `tsconfig.json`, `Dockerfile`, `railway.json`.
- **Env vars (contract)**: `POSTGRES_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `BASE_URL`, `AUTH_SECRET` (written by `lib/db/setup.ts`). Scripts also read `DATABASE_URL`, `PREVIEW_BRANCH`, `REPO_URL`, `PORT`, `GIT_POLL_INTERVAL`.
- **Secrets management**: `.env` loaded via `dotenv` in server modules; cookies carry encrypted session only.

## 10) Async & Background Processing
- No message queues or schedulers. Stripe webhooks provide event-driven updates. `unstable_cache` schedules revalidation for Stripe reads.

## 11) Testing Structure
- **Current state**: No test directory or test framework configured.
- **Guidance**: Add unit tests under `__tests__/` or `tests/` using Vitest/Jest; for integration, mock Drizzle/Stripe; for e2e use Playwright against `next dev`. Ensure auth/session cookies are stubbed; avoid hitting live Stripe—mock via stripe-mock or fixtures.

## 12) File & Directory Index (one-line purpose each)
```
./Dockerfile                # Node 20 image; installs deps, builds, runs Next app
./LICENSE                   # Repository license
./README.md                 # Operational manifesto and usage rules (authoritative)
./components.json           # shadcn / Tailwind design tokens config
./drizzle.config.ts         # Drizzle ORM configuration (schema path, migrations out)
./next.config.ts            # Next.js config
./postcss.config.mjs        # Tailwind 4 + autoprefixer pipeline
./railway.json              # Railway deployment metadata
./package.json              # Scripts and dependencies
./package-lock.json         # npm lockfile
./pnpm-lock.yaml            # pnpm lockfile
./tsconfig.json             # TypeScript compiler options
./middleware.ts             # Global middleware protecting /dashboard and refreshing session cookies
./app/                      # Next.js App Router source
  ├─ globals.css            # Global Tailwind styles
  ├─ layout.tsx             # Root layout, fonts, SWR fallback, <html>/<body>
  ├─ not-found.tsx          # 404 page
  ├─ favicon.ico            # App icon
  ├─ (login)/               # Auth feature module
  │   ├─ login.tsx          # Client component rendering sign-in/sign-up form
  │   ├─ actions.ts         # Server actions for auth/account/team mutations
  │   ├─ sign-in/page.tsx   # Sign-in page wrapper
  │   └─ sign-up/page.tsx   # Sign-up page wrapper
  ├─ (dashboard)/           # Marketing + authenticated dashboard surface
  │   ├─ layout.tsx         # Header + user menu for dashboard scope
  │   ├─ page.tsx           # Landing/marketing hero with Terminal showcase
  │   ├─ terminal.tsx       # Animated terminal component for hero
  │   ├─ pricing/           # Pricing + checkout flow
  │   │   ├─ page.tsx       # Pricing page pulling Stripe products/prices
  │   │   └─ submit-button.tsx # Client submit button with pending state
  │   └─ dashboard/         # Auth-required settings area
  │       ├─ layout.tsx     # Sidebar shell and nav for settings pages
  │       ├─ page.tsx       # Team settings overview (subscription + members + invites)
  │       ├─ activity/page.tsx  # Server component rendering recent activity log
  │       ├─ general/page.tsx   # Client component for account info update form
  │       └─ security/page.tsx  # Client component for password update/delete account
  └─ api/                   # Route handlers (backend endpoints)
      ├─ user/route.ts      # GET current user JSON
      ├─ team/route.ts      # GET current team JSON
      └─ stripe/            # Stripe integration endpoints
          ├─ checkout/route.ts  # Handles success redirect; updates team subscription
          └─ webhook/route.ts   # Receives Stripe webhooks, verifies signature
./components/               # Reusable UI components
  └─ ui/                    # Design system primitives
      ├─ avatar.tsx         # Avatar image/fallback
      ├─ button.tsx         # Button variants
      ├─ card.tsx           # Card container elements
      ├─ dropdown-menu.tsx  # Dropdown menu (Radix)
      ├─ input.tsx          # Text inputs
      ├─ label.tsx          # Form labels
      ├─ radio-group.tsx    # Radio group controls
      └─ ...                # Other small primitives (all client components)
./lib/                      # Domain and infrastructure logic
  ├─ utils.ts               # `cn` className combiner
  ├─ cache.ts               # `unstable_cache` helper
  ├─ auth/
  │   ├─ session.ts         # JWT-based session helpers, bcrypt hashing
  │   └─ middleware.ts      # Action wrappers for validation/auth/team loading
  ├─ db/
  │   ├─ drizzle.ts         # Drizzle client bound to POSTGRES_URL
  │   ├─ schema.ts          # Drizzle schema, relations, TS types, ActivityType enum
  │   ├─ queries.ts         # Query helpers (getUser, getTeamForUser, logs, etc.)
  │   ├─ seed.ts            # Seeds user/team and Stripe products
  │   ├─ setup.ts           # Interactive setup: Docker PG, Stripe secrets, .env writer
  │   └─ migrations/        # Drizzle SQL migrations + metadata
  │       ├─ 0000_soft_the_anarchist.sql
  │       └─ meta/{0000_snapshot.json,_journal.json}
  └─ payments/
      ├─ stripe.ts          # Stripe client/config, checkout & portal session builders, webhook handler, cached price/product fetchers
      └─ actions.ts         # Billing server actions with team guard + redirects
./scripts/                  # Ops / automation (immutable)
  ├─ db-init.js             # Bootstraps local Postgres via Docker
  ├─ dev-supervisor.js      # Dev orchestration script
  └─ git-poll.js            # Repo polling utility
./.DS_Store                 # OS metadata (ignore)
```

## 13) How to Modify This Codebase Safely
- **Add new features**: Create new routes/pages under `app/(dashboard)/<feature>/` with server actions colocated; reuse `components/ui` primitives; use `lib/db/queries.ts` or add new query helpers near existing ones. Keep marketing updates in `app/(dashboard)/page.tsx`.
- **Do NOT change**: Auth cookie semantics (`lib/auth/session.ts`, `middleware.ts`), Stripe webhook/checkout contracts, migration files, scripts in `scripts/`, or dashboard routing structure without explicit approval.
- **Tracing a request**: `form action` → server action (`app/(login)/actions.ts` or `lib/payments/actions.ts`) → DB/Stripe helpers in `lib/` → Drizzle schema `lib/db/schema.ts` and `db` client. API fetches: component `useSWR` → `/api/...` route handler → `lib/db/queries.ts`.
- **Finding related files**: Identify segment folder in `app/(dashboard)` or `app/(login)` for UI, paired actions in same folder or `lib/payments/actions.ts`, data queries in `lib/db/queries.ts`, schema in `lib/db/schema.ts`, and middleware in `middleware.ts`.
- **Pitfalls to avoid**: Bypassing `validatedAction*` (loses validation/auth), mutating migrations manually, altering cookie options, hitting Stripe live keys in dev, forgetting to refresh session after auth changes, or placing SaaS features outside `(dashboard)`.

=======
# FILES.md

## 1. High-Level Overview
- **Purpose:** This is an AI-assisted SaaS starter built on Next.js App Router, PostgreSQL, and Stripe so engineers and codebots can ship a secure SaaS dashboard, auth flow, and billing surface without redoing the boilerplate.
- **Architecture:** The repo splits responsibilities into purpose-built slices: `app/` defines the App Router pages, `lib/` holds domain and infrastructure helpers, `components/` houses the UI system, and `scripts/` keeps ops scripts. Features are organized by route group (landing, dashboard, pricing, login) and reuse shared services via imports instead of a single monolithic file.
- **Key technologies:** Next.js 16 App Router + React Server Components, SWR, Drizzle ORM + PostgreSQL (postgres.ts), Stripe `stripe` SDK + server actions, JOSE for JWT session cookies, Zod for request validation, Tailwind CSS 4 + `@tailwindcss/postcss`, Radix UI primitives, `react-use-action-state` pattern, and automated scripts (Stripe CLI, Docker, Drizzle Kit).

## 2. Application Entry Points
### `main.ts`
- Not present in this Next.js template. The App Router removes the explicit `main.ts` bootstrap; instead, `app/layout.tsx` and exported route handlers replace Nest-style entry points.

### `app.module.ts`
- Also absent. The module boundaries are implied by directories (`app/(login)`, `lib/db`, `lib/payments`, etc.) rather than a single Nest `@Module` decorator.

### Bootstrap, globals, and middleware
- `app/layout.tsx` instantiates the root `<html>`/`<body>`, applies the `Manrope` font, and wraps the tree with `SWRConfig`. The config prefetches `/api/user` and `/api/team` via `lib/db/queries` so client components can rely on cached data without redundant `fetch` calls.
- `middleware.ts` acts as the global guard: it redirects unauthenticated requests off `/dashboard*` to `/sign-in`, revalidates JWT session cookies (`lib/auth/session.ts`), drills secure cookie metadata (`SameSite: none`, `httpOnly`, `secure`), and keeps the login state alive. Its matcher excludes `_next`, `/api`, and static assets.
- Global validators and guards live in `lib/auth/middleware.ts` (e.g., `validatedAction`, `withTeam`), mirroring Nest filters/pipes by validating FormData via Zod and throwing redirects when auth fails.

## 3. Module Index
- **`app/(login)` (feature, `app/(login)`):** Handles sign-in/sign-up UI plus server actions. Public providers: `actions.ts` exports `signIn`, `signUp`, `signOut`, `updateAccount`, `updatePassword`, `deleteAccount`, `inviteTeamMember`, `removeTeamMember` (with shared Zod schemas). Internal helpers: `logActivity`, schema objects, `validatedAction`. Imports: `lib/db` (Drizzle), `lib/auth` (session helpers), `lib/payments/stripe`, `lib/db/queries`. Exports UI entrypoints `sign-in`, `sign-up`, and the shared `Login` component.
- **`app/(dashboard)` (feature, `app/(dashboard)`):** Auth-protected product surface. Key paths: `/dashboard` (landing + terminal demo), `/dashboard/general` (Team Settings page), `/dashboard/pricing`. Public providers: `dashboard/page.tsx`, `dashboard/layout.tsx`, `pricing/page.tsx`, `pricing/submit-button.tsx`, `terminal.tsx`. Imports: shared UI components, `useSWR`/`Suspense`, `lib/payments/actions`, `lib/db/schema`, `app/(login)/actions`. It exports stateful UI components and relies on `app/layout.tsx` and `middleware.ts` for protection.
- **`app/api` (feature/infrastructure, `app/api`):** Two route handlers (`/api/user`, `/api/team`). They expose GET endpoints backed by `lib/db/queries` and the session cookie guard. No internal providers besides the route exports. They are feature-based because they feed the dashboard UI.
- **`lib/db` (infrastructure, `lib/db`):** Responsible for database configuration, schema, queries, migrations, and DevOps scripts. Public providers: `drizzle.ts` (exports `client`, `db`), `schema.ts` (typed tables/enums), `queries.ts` (session-aware fetch helpers), `setup.ts`, `seed.ts`. Imports: `drizzle-orm`, `postgres`, `dotenv`, `next/headers`, Zod/JOSE libs via other layers. Exports typed tables and helper functions consumed throughout.
- **`lib/auth` (infrastructure, `lib/auth`):** Session management glue. Public providers: `session.ts` (`hashPassword`, `comparePasswords`, `signToken`, `verifyToken`, `getSession`, `setSession`) and `middleware.ts` (`validatedAction`, `validatedActionWithUser`, `withTeam`). Dependencies: JOSE, bcryptjs, `cookies`. This module is singleton-scoped.
- **`lib/payments` (infrastructure, `lib/payments`):** Captures Stripe logic. Public providers: `stripe.ts` (Stripe client plus helper functions for checkout, portal, webhook handling, cached price/product fetchers) and `actions.ts` (server actions hooking `withTeam`). Imports: `lib/db/queries`, `lib/auth/middleware`, `next/navigation`, `next/cache`, `lib/db/schema`. The module is singleton.
- **`lib/cache.ts` (shared utility):** Provides a simple wrapper around `next/cache` for reusing caches keyed by strings.
- **`lib/utils.ts` (shared UI helper):** Exports `cn` for merging Tailwind/Radix classes (used by shipment UI components).
- **`components/ui` (shared, `components/ui`):** Design-system primitives (Button, Card, Avatar, Input, Label, RadioGroup, DropdownMenu) based on Radix + CVA. Exports all primitives for `app/` usage.
- **`scripts` (infrastructure ops):** `db-init.js`, `dev-supervisor.js`, `git-poll.js` are runtime scripts invoked by GitHub Actions or `pnpm db:setup`. They import Node standard libs and shell out to Stripe CLI/Docker; treat them as immutable infrastructure pieces.

## 4. Controllers
- **`/api/user` (`app/api/user/route.ts`)**
  - Prefix: `/api/user`
  - Endpoint: `GET` (no params).
  - Purpose: Hydrates the current user for dashboards and components; cascades a null when no valid JWT cookie exists.
  - DTOs: None—response is `User | null` shaped by `lib/db/schema`, with `passwordHash` omitted via query selection.
  - Guards/interceptors: No Nest guards, but `getUser()` verifies the `session` cookie via `JWT` and session timestamp; `middleware.ts` keeps `/dashboard` unreachable without the cookie.
  - Related modules: `lib/db/queries`, `lib/auth/session`, `app/layout.tsx` (prefetch) and `components/ui` (avatar usage).
- **`/api/team` (`app/api/team/route.ts`)**
  - Prefix: `/api/team`
  - Endpoint: `GET`
  - Purpose: Returns `TeamDataWithMembers` to render team info, subscription status, and membership lists.
  - DTOs: Response enumerates team fields plus nested members; shape inferred from `schema.ts` and `getTeamForUser`.
  - Guards: Same session guard in `getTeamForUser`; protects via `middleware.ts` before this route is hit.
  - Related modules: `app/(dashboard)/*` uses SWR to fetch `/api/team` and `lib/payments/actions` depends on the returned `team` object.

## 5. Services & Providers
- **`lib/db/drizzle.ts`** – Instantiates Postgres client via `postgres(process.env.POSTGRES_URL)` and wraps it in Drizzle. Responsible for migrating typed schema exports and reusing a single client. Side effects: opens a connection per server instance. Scope: singleton.
- **`lib/db/queries.ts`** – Session-aware queries (`getUser`, `getTeamForUser`, `getActivityLogs`, `updateTeamSubscription`, `getTeamByStripeCustomerId`, etc.). Injects dependencies: `db`, `schema`, `getUser`/`verifyToken`. Side effects: reads/writes to Postgres, respects `deletedAt` soft deletes, reuses shared `clients`. Singleton scope.
- **`lib/auth/session.ts`** – Handles password hashing/comparison (bcrypt), JWT signing/verification (jose), session cookie read/write. Dependencies: `cookies`, `process.env.AUTH_SECRET`. Side effects: emits HTTP-only cookies. Singleton.
- **`lib/auth/middleware.ts`** – Provides `validatedAction`, `validatedActionWithUser`, `withTeam`. Each function wraps server actions, applies Zod validation, fetches session state, and redirects or throws on failure. Dependencies: `lib/db/queries` and `lib/auth/session`. Scope: stateless wrappers.
- **`lib/payments/stripe.ts`** – Stripe client singleton plus checkout/customer portal APIs, cached price/product fetchers, webhook handler stub. Dependencies: `process.env.STRIPE_SECRET_KEY`, `lib/db/queries`, `lib/db/schema`. Side effects: talks to Stripe API, may redirect inside `createCheckoutSession`. Scope: singleton.
- **`lib/payments/actions.ts`** – Server actions (`checkoutAction`, `customerPortalAction`) decorated with `withTeam` guard. Side effects: redirects to Stripe or portal, depends on `lib/payments/stripe`. Stateless.
- **`app/(login)/actions.ts`** – All auth CRUD actions plus team invites/removals. Responsibilities: user lifecycle, invitation workflow, activity logging, Stripe redirects. Dependencies: `lib/db` (tables, queries), `lib/auth/session`, `lib/payments/stripe`, `validatedAction` helpers. Side effects: creates/updates/soft-deletes database records, sets cookies, touches Stripe, logs events. Scope: effectively singleton per server action invocation.
- **`withTeam`, `validatedAction`, `validatedActionWithUser`** – Guard helpers injected into server actions to ensure session, team membership, and Zod schema conformance.

## 6. Data Layer
- **ORM:** Drizzle ORM (`drizzle-orm`, `drizzle-orm/pg-core`) with Postgres driver (`postgres`). Schema defined in `lib/db/schema.ts` mirrors relational tables (users, teams, team_members, activity_logs, invitations) plus Drizzle relations and inferred TypeScript types (e.g., `TeamDataWithMembers`).
- **Configuration:** `lib/db/drizzle.ts` bootstraps the client from `POSTGRES_URL`, requires `dotenv` for CLI scripts, and exposes `db` for queries.
- **Queries:** `lib/db/queries.ts` orchestrates authentication-aware reads and writes, wraps the `db` instance, uses `cookies` header for session tokens, and tightens filters against `deletedAt`.
- **Migrations:** `drizzle.config.ts` points Drizzle Kit to `lib/db/schema.ts` and outputs SQL to `lib/db/migrations`. The lone migration `0000_soft_the_anarchist.sql` seeds the initial schema. Run `pnpm db:migrate`, `db:generate`, `db:setup`, or `db:seed` scripts to manage state.
- **Scripts:** `lib/db/setup.ts` ensures Stripe CLI + Docker, writes `.env` with `POSTGRES_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `BASE_URL`, `AUTH_SECRET`. `lib/db/seed.ts` (not shown but referenced) populates the database.

## 7. DTOs, Schemas & Validation
- **DTO locations:** All shape validation happens in `app/(login)/actions.ts` via scoped Zod schemas (`signInSchema`, `signUpSchema`, `updatePasswordSchema`, `updateAccountSchema`, `removeTeamMemberSchema`, `inviteTeamMemberSchema`, etc.).
- **Validation strategy:** Zod runs inside `validatedAction`/`validatedActionWithUser`, which call `schema.safeParse(Object.fromEntries(formData))`. Invalid requests return `{ error }` objects consumed by the `Login` component via `useActionState`.
- **Mapping:** Valid data is mapped to Drizzle Entities (`NewUser`, `NewTeam`, `NewTeamMember`, etc.) before insertion or updates. Responses omit sensitive fields (`passwordHash`) by design and rely on Drizzle selections defined in `lib/db/queries.ts`.

## 8. Cross-Cutting Concerns
- **Authentication & Authorization:** Session JWT stored in `session` cookie, signed in `lib/auth/session.ts`, refreshed by `middleware.ts`. All server actions use `withTeam`/`validatedActionWithUser`. `/dashboard` routes are protected via middleware.
- **Guards/interceptors:** `middleware.ts` acts as a guard, `validatedAction` works like a validation pipe, and `withTeam` enforces team membership before Stripe/DB work.
- **Logging/tracing:** Activity events (sign in/out, password resets, invitations) log to `activity_logs` via `logActivity` inside `app/(login)/actions.ts`.
- **Error handling:** Server actions return `{ error }` metadata consumed by client forms; `createCheckoutSession` and `createCustomerPortalSession` redirect or throw when Stripe returns unexpected data.
- **Caching/monitoring:** `app/layout.tsx` seeds SWR cache, while `lib/payments/stripe.ts` uses `unstable_cache` for `getStripePrices`/`getStripeProducts`. `lib/cache.ts` wraps `unstable_cache` for other helpers.

## 9. Configuration & Environment
- **Configuration files:** `next.config.ts` enables `cacheComponents`. `drizzle.config.ts` links schema to migrations. `postcss.config.mjs` wires Tailwind via `@tailwindcss/postcss`. `components.json` keeps shadcn UI metadata. `railway.json` indicates Docker builder.
- **Environment variables:** `.env` (generated by `lib/db/setup.ts`) must define `POSTGRES_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `BASE_URL`, `AUTH_SECRET`. Scripts and Stripe helpers rely on the same secrets.
- **Secrets strategy:** Secrets live in `.env` (excluded from git) or CI via Railway/Actions inputs. The GitHub workflow `init-db.yml` injects `DATABASE_URL` and `PROJECT_ID` at runtime instead of baking secrets in the repo.

## 10. Async & Background Processing
- **Stripe flows:** `createCheckoutSession`/`createCustomerPortalSession` are server actions that perform async calls to Stripe, then redirect the user. `handleSubscriptionChange` (in `lib/payments/stripe.ts`) is a reusable handler for webhook payloads, even if the route is not wired yet.
- **Forms & server actions:** `useActionState` (`react-dom`) keeps forms reactive while actions call `signIn`, `signUp`, `removeTeamMember`, `inviteTeamMember`, etc. Each action runs async DB/Stripe calls and returns success/error objects.
- **Cache & data fetching:** `useSWR` + Suspense fetch `/api/team` and `/api/user`. The layout prefetches via `lib/db/queries`. `lib/payments/stripe.ts` caches Stripe catalog data for one hour with `unstable_cache`.
- **Scripts:** `scripts/db-init.js` (GitHub Action) and `scripts/dev-supervisor.js` orchestrate long-running tasks; they shell out to Stripe CLI, Docker, or git commands and should stay in `scripts/` (immutable zone per README).

## 11. Testing Structure
- **Current state:** No test files are checked in yet. Introduce tests under `tests/` or `__tests__/` (unit for `lib/db/queries.ts`, integration for server actions via `vitest` + `@testing-library/react`, e2e via Playwright) when needed.
- **Utilities/mocks:** Reuse `lib/db/drizzle.ts` and `lib/auth/session.ts` by mocking `db` and cookie helpers. Keep seeds in `lib/db/seed.ts` for fixtures.
- **Safe modification tips:** Wrap new suites with `pnpm test`/`vitest` and target only the module you touched. Keep snapshot/fixture data close to the feature (e.g., `tests/login.spec.ts`).

## 12. File & Directory Index
```
/
├── .DS_Store – macOS metadata (should remain gitignored).
├── .gitattributes – enforces LF normalization for text files.
├── .github/
│   └── workflows/
│       └── init-db.yml – CI entry that runs `scripts/db-init.js` with `DATABASE_URL` and `PROJECT_ID` inputs.
├── components/ – shared UI primitives generated by shadcn.
│   └── ui/
│       ├── avatar.tsx – Radix avatar wrapper with fallback initials.
│       ├── button.tsx – CVA-based button variants used across the UI.
│       ├── card.tsx – Card layout (header/content/footer) for dashboard panels.
│       ├── dropdown-menu.tsx – Dropdown primitives (menu, items, separators).
│       ├── input.tsx – Tailwind-styled input with focus/validation states.
│       ├── label.tsx – Accessible label helper for forms.
│       └── radio-group.tsx – Radix radio group with custom indicator.
├── components.json – shadcn configuration (style, aliases, icon library).
├── Dockerfile – container build for Vercel/Docker deployments.
├── LICENSE – opensource license (Panda template system).
├── README.md – operational manifesto describing rules, constraints, and contracts.
├── app/
│   ├── favicon.ico – app icon.
│   ├── globals.css – Tailwind CSS 4 theme tokens, color palette, and base styles for the entire site.
│   ├── layout.tsx – Root layout; applies fonts, sets `SWRConfig`, and envelopes all pages (global entry point).
│   ├── not-found.tsx – Next fallback shown for unknown routes.
│   ├── (dashboard)/
│   │   ├── layout.tsx – Dashboard shell with responsive sidebar, links, and mobile toggles.
│   │   ├── page.tsx – Marketing-style landing hero + technology highlights.
│   │   ├── terminal.tsx – Animated terminal widget that scrolls install steps for the hero.
│   │   ├── dashboard/
│   │   │   ├── layout.tsx – Settings-specific layout for team management.
│   │   │   ├── page.tsx – Settings page with subscription status, member list, and invite form (critical for capturing business rules).
│   │   └── pricing/
│   │       ├── page.tsx – Pricing cards powered by cached Stripe prices/products (critical for billing UX).
│   │       └── submit-button.tsx – Client button showing loading state tied to `useFormStatus`.
│   ├── (login)/
│   │   ├── actions.ts – Server actions that handle sign-in/up/out, account updates, invites, and logging (critical security surface).
│   │   ├── login.tsx – Client form that wires `useActionState` and controls hidden `redirect`/`priceId`/`inviteId` inputs.
│   │   ├── sign-in/page.tsx – Suspense wrapper around `<Login mode="signin" />`.
│   │   └── sign-up/page.tsx – Suspense wrapper around `<Login mode="signup" />`.
│   └── api/
│       ├── team/route.ts – Returns `TeamDataWithMembers` for the current user (used by dashboard).
│       └── user/route.ts – Returns the authenticated user record (used for UI guards).
├── lib/
│   ├── auth/
│   │   ├── middleware.ts – Zod-based action guards (`validatedAction`, `withTeam`, etc.).
│   │   └── session.ts – JWT cookie + bcrypt helpers that sign/verify tokens and store the `session` cookie (critical for auth).
│   ├── cache.ts – Lightweight wrapper around `next/cache`.
│   ├── db/
│   │   ├── drizzle.ts – Postgres client + Drizzle instance (critical data access foundation).
│   │   ├── migrations/0000_soft_the_anarchist.sql – Initial schema migration generated by Drizzle Kit.
│   │   ├── queries.ts – Session-aware query helpers (`getUser`, `getTeamForUser`, `updateTeamSubscription`, etc.).
│   │   ├── schema.ts – Table definitions, relations, and export types (critical for understanding entities).
│   │   ├── seed.ts – Seeds the database (not shown in small diff but invoked by `db:seed`).
│   │   └── setup.ts – Interactive script that ensures Stripe CLI + Docker are ready, then writes `.env` and instructs users.
│   ├── payments/
│   │   ├── actions.ts – Server actions that wrap checkout/portal helpers.
│   │   └── stripe.ts – Stripe SDK client plus helpers for checkout, billing portal, subscription updates, and cached catalog data (critical billing integration).
│   └── utils.ts – Utility `cn` helper used by the Radix primitives.
├── middleware.ts – Global Next middleware that redirects unauthorized `/dashboard` traffic and refreshes JWT cookies (critical guard).
├── next.config.ts – Enables component caching for Rsc-based routes.
├── postcss.config.mjs – Configures `@tailwindcss/postcss` plugin.
├── package.json – Dependency manifest + scripts (`dev`, `build`, `db:*`, etc.) referencing Next, Drizzle Kit, Stripe, Zod, and Tailwind.
├── package-lock.json – npm’s lockfile (kept for compatibility even though `packageManager` is pnpm).
├── pnpm-lock.yaml – pnpm lockfile specifying exact dependency tree for reproducible installs.
├── railway.json – Railway deployment metadata (Docker builder).
├── scripts/
│   ├── db-init.js – Initializes Prisma/Postgres and optional Stripe resources (invoked by GitHub workflow).
│   ├── dev-supervisor.js – Long-running supervisor for local development automation.
│   └── git-poll.js – Polls git metadata, kept immutable.
├── drizzle.config.ts – Drizzle Kit configuration pointing to `lib/db/schema.ts`.
├── tsconfig.json – TypeScript config aligning Next path aliases and strict mode.
```

## 13. How to Modify This Codebase Safely
1. **Adding features:** Build new SaaS surfaces under `app/(dashboard)` as new folders and expose them through the existing sidebar/layout; reuse shared UI primitives and server actions. Add new server actions in `app/(login)/actions.ts` or create new route handlers under `app/api/` that call `lib/db/queries` instead of duplicating logic.
2. **Where not to touch:** Do not edit `scripts/` unless explicitly asked (they are infrastructure/immutable). Avoid changing `lib/db/migrations` directly—generate via `pnpm db:generate` then review. `app/(login)/actions.ts`, `lib/auth/session.ts`, and `middleware.ts` guard authentication; any change there requires explicit permission or thorough review.
3. **Tracing request flow:** Start at a controller (`app/api/*` or a server action). Follow imports to `app/(login)/actions.ts` or `lib/payments`, see validation in `lib/auth/middleware.ts`, travel to `lib/db/queries.ts`, then to `lib/db/drizzle.ts` for the SQL layer. Reverse the process when debugging responses.
4. **Finding related files:** Search for feature names (e.g., `invite` → `app/(login)/actions.ts`, `lib/db/schema.ts`, `app/(dashboard)/dashboard/page.tsx`). Use `useSWR('/api/team')` references to find UI consumers, then trace them back to `app/api/team/route.ts` and ultimately `lib/db/queries.ts`.
5. **Common NestJS pitfalls to avoid:** (a) No global `main.ts`—do not introduce a pseudo-bootstrap; rely on Next's App Router. (b) Avoid stateful singletons—Drizzle clients, Stripe sessions, and middleware are already singletons; keep them pure. (c) Maintain explicit validation/guards (`validatedAction`, `withTeam`) before talking to the DB. (d) Don’t add landing/dashboard code outside `(dashboard)` per the README's Dashboard Primacy Rule.
>>>>>>> 34eabd05799589941e719588ba2ab418a8ced063
