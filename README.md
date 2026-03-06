# 🐼 Panda – Next.js + PostgreSQL SaaS Starter
## Enterprise AI-Safe Full-Stack Template

This repository is an **enterprise-grade, full-stack SaaS starter** built with **Next.js (App Router)**, **PostgreSQL**, and **Prisma**.

It is explicitly designed for:

- **AI-assisted development**
- **Long-lived production systems**
- **Strict data & authentication safety**
- **Predictable, reviewable diffs**
- **Enterprise-scale collaboration**

This file is the **single authoritative operating manual** for:

- Human developers
- AI coding agents
- Automated fixing systems
- Code review & CI tooling

---

## 🚨 ABSOLUTE AUTHORITY NOTICE

This repository is governed by the **Panda Template Manifest**.

If anything conflicts:

1. Panda Template Manifest rules win
2. This README wins over inline comments
3. Explicit user instructions win over defaults
4. Assumptions are forbidden

If unclear → **STOP AND ASK**

---

## 🚀 TECHNOLOGY STACK

- **Frontend:** Next.js (App Router)
- **Backend:** Node.js (Route Handlers + Server Actions)
- **Database:** PostgreSQL (hosted on Railway)
- **ORM:** Prisma
- **Authentication:** NextAuth / Custom Auth
- **Language:** TypeScript (strict)
- **Deployment:** Vercel or Docker
- **Automation:** Custom Node.js scripts

---

## 🧠 SYSTEM PHILOSOPHY

### Core Principles

- Stability > Cleverness
- Data safety > UI speed
- Explicit > Implicit
- Minimal diffs > rewrites
- Contracts > convenience

### AI Design Doctrine

- AI operates as a full-stack product engineer: ship usable, production-ready features end-to-end (UI, API, data, auth).
- Prefer shippable functionality over cosmetic tweaks; every UI change should be backed by working server logic and data flows.
- Propose and implement schema/auth/config changes when a feature requires them—surface the plan, then execute with migrations and tests.
- Maintain architectural integrity: evolve intentionally, avoid churn, and document rationale for cross-cutting changes.

### Product work scope (beyond branding)
- Default expectation is to build complete features, not just update copy/visuals.
- Every requested capability should include UI, server actions/routes, persistence, and auth wiring.
- Add or update dashboard pages and sidebar navigation as needed to surface new functionality.
- If data changes are required, update Prisma schema and let CI handle migrations; keep seeds/setup aligned.
- When a request mentions a feature, prioritize implementing the feature end-to-end before any design-only refinements.

### Default delivery checklist (apply to every feature)
- Read the current code to understand existing behavior and constraints.
- Understand the layouts and design system used by the target surface.
- Update layout, content, and frontend elements as required by the feature.
- Add the new page inside `app/(dashboard)/dashboard/` and register its route.
- Add the corresponding item to the dashboard sidebar/navigation.
- Ensure the feature is end-to-end operational: UI wired to server actions/routes, data persistence works, and auth rules are respected.
- If the feature introduces new data, update `prisma/schema.prisma`; CI will generate/apply migrations automatically from the schema. Run `npx prisma migrate dev --name <feature>` locally only if you need validation, and keep any generated migration folders intact. Update related DB assets (seeds/setup) so the data path works everywhere.

---

## 📁 PROJECT STRUCTURE (SOURCE OF TRUTH)

```txt
/
├── app/                         # Next.js App Router (PRIMARY)
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Public / marketing entry
│   ├── (dashboard)/             # Auth-protected SaaS surface (PRIMARY)
│   │   ├── page.tsx             # Main dashboard landing (REQUIRED)
│   │   ├── layout.tsx           # Dashboard shell
│   │   ├── activity/            # SaaS feature area
│   │   └── general/             # SaaS feature area
│   ├── api/                     # Backend route handlers
│   └── actions/                 # Server actions
│
├── components/                  # Reusable UI components
│   ├── ui/                      # Design system primitives
│   └── forms/                   # Controlled forms
│
├── lib/                         # Core application logic
│   ├── db.ts                    # Prisma client
│   ├── auth.ts                  # Auth logic
│   └── validators.ts            # Zod / validation schemas
│
├── prisma/
│   ├── schema.prisma            # Database schema (CRITICAL)
│   └── migrations/              # Auto-generated (do not hand-edit)
│
├── scripts/                     # Automation & infrastructure logic
│   ├── db-init.js               # Database bootstrap (IMMUTABLE)
│   ├── dev-supervisor.js        # Dev orchestration (IMMUTABLE)
│   └── git-poll.js              # Repo polling (IMMUTABLE)
│
├── public/                      # Static assets
├── styles/                      # Global styles
│
├── env.example                  # Environment variable contract
├── Dockerfile                   # Container build definition
├── next.config.js               # Framework config
└── package.json                 # Dependency graph
```


## 🧭 LANDING PAGES & DASHBOARD RULES (CRITICAL)

### Landing Pages

- **All landing page creation and updates MUST be done in:**

```
app/(dashboard)/page.tsx
```

- This file is the **single source of truth** for Panda’s SaaS landing experience
- No additional landing pages may be created unless explicitly requested
- Marketing and SaaS entry logic must converge here

---

### Dashboard & SaaS Feature Placement

All **SaaS-related features** must live inside:

```
app/(dashboard)/
```

Rules:

- New SaaS features must be added as **folders**
  (e.g. `/activity`, `/general`)
- `app/(dashboard)/page.tsx` must be updated to surface new features
- `app/(dashboard)/layout.tsx` may be updated **only** to support layout or navigation
- No SaaS UI, logic, or workflows may exist outside `(dashboard)`

---

### Authentication Pages (STRICT)

- **Auth pages must not be changed** unless explicitly requested by the user
- Existing auth structure must be preserved; branding updates are allowed.
- Visual updates and signup flow field additions are permitted when requested, but never remove existing fields or flows.

Authentication is **stable infrastructure**, not a customization surface—any changes must keep the current flow intact and additive.

---

## 🔐 ENVIRONMENT VARIABLES (CONTRACT)

Rules:

- `env.example` is the **single source of truth**
- AI must not invent new environment variables
- All env usage must be validated
- Secrets must never be committed
- UI code must never access env variables directly

---

## 🗄️ DATABASE & PRISMA (CRITICAL ZONE)

- PostgreSQL hosted on Railway
- Prisma ORM is mandatory
- `schema.prisma` is feature-driven and may be updated to support requirements
- `prisma/migrations` are generated and must not be hand-edited
- UI and templates should align with defined schema changes (no silent/assumed schema shifts)

### Schema change workflow (feature-driven)
- Capture the feature requirement first (entities, fields, relations, validation, ownership/auth rules).
- Edit `prisma/schema.prisma` only for the requested scope; do not touch existing migration files.
- GitHub Actions will generate and apply migrations automatically from the updated schema; no local `prisma migrate dev` step is required unless you need to validate locally.
- If you do run a local migration for validation, keep the generated folder intact—never hand-edit SQL.
- If any ambiguity remains, stop and request clarification before changing the schema.

### Approved Prisma commands
- `npx prisma migrate dev --name <feature>` (optional local validation; CI will generate/apply migrations automatically)
- `npx prisma db push` (only for non-prod sandboxes; never for production)
- `npx prisma studio` (read/write via UI for debugging; no schema edits)

If a UI requirement suggests a schema change → follow the schema workflow above before shipping UI

---

## 🔌 API ROUTES & SERVER ACTIONS

Rules:

- Request/response contracts are immutable
- Authentication checks must remain enforced
- Input validation is required (Zod preferred)

AI MAY:
- Refactor logic
- Improve error handling
- Optimize internals

AI MUST NOT:
- Change route signatures
- Break response shapes
- Remove auth
- Introduce side effects

---

## 🔐 AUTHENTICATION & AUTHORIZATION

- Providers may be updated; preserve security posture and documented flows
- Session shape should remain consistent unless a feature requires a well-defined change
- Role logic must remain consistent or be explicitly revised with clear rules

Forbidden:
- Privilege escalation
- Admin bypasses
- Role inference

---

## 🤖 SCRIPTS DIRECTORY CONTRACT

Scripts are **infrastructure-only**.

**Immutability Rule**

All files inside the `scripts/` directory are **effectively immutable**.  
They must not be modified, extended, or repurposed unless **explicitly approved**.

Scripts must never:
- Contain business logic
- Change schema behavior
- Affect runtime app logic
- Be imported by UI or API code

---

## 🐳 DOCKER CONTRACT

- Base image changes require approval
- Ports must remain consistent
- No secrets baked into images
- No background workers
- No sidecar services

---

## 🧭 ADDITIONAL OPERATIONAL RULES

### Single-Owner File Rule

Each file has **one primary responsibility**.  
Changes must stay within the owning file unless explicitly requested.

---

### No Drive-By Changes

Do not refactor, rename, reformat, or “clean up” unrelated code.  
If it wasn’t requested, it must not be touched.

---

### File Creation Rule

New files or folders may only be created when existing structure cannot support the change.  
Intent must be explicit and documented.

---

### Dashboard Primacy Rule

`(dashboard)` is the product.  
Everything outside it exists to support it.

---

### User Intent Override

When user instructions conflict with existing structure:

- User intent wins
- Violations must be explicitly called out before execution

---

### Visual vs Behavioral Separation

Visual changes must not alter:

- Data flow
- Auth logic
- API behavior
- State ownership

If they do → **STOP AND ASK**

---

### Safe Default Rule

When multiple solutions are possible, choose the:

- Least invasive
- Most explicit
- Most reversible

---

### Cookie Configuration Rules



Iframe Auth Fix

Ensured every auth cookie (setSession + middleware refresh/cleanup) now sends SameSite: 'none' (still httpOnly, secure, path: '/'), so the browser treats it as first-party even when the Next.js app lives inside a Bubble iframe.
Left all redirects and guards untouched; the middleware still deletes/refreshes tokens exactly as before—only the cookie metadata changed to allow iframe contexts to send the cookie.
If you hit this again in another repo

Confirm the iframe host and Next.js app share the same root domain (or plan for a parent-proxy domain) so cookies are first-party.
Check every place you set auth cookies (session helpers, server actions, middleware, etc.) and explicitly set sameSite: 'none', secure: true, and path: '/' so they aren’t blocked inside iframes.
Don’t tamper with redirect logic—keep if (!user) redirect(...) as-is—and avoid introducing client-side cookie hacks. Only the cookie metadata needs adjusting, not the auth flow.

---

### Uncertainty Rule

If requirements are ambiguous or incomplete → **STOP** and ask for clarification.

---

## 🔐 CHANGE PERMISSION MATRIX

| Change Type       | Default | Explicit |
|------------------|---------|----------|
| Copy / Text      | ✅      | ❌       |
| UI Logic         | ✅      | ❌       |
| API Logic        | ✅      | ❌       |
| Auth             | ✅      | ❌       |
| Prisma Schema    | ✅      | ❌       |
| Migrations       | ✅      | ❌       |
| Scripts Behavior | ❌      | ❌       |
| Env Vars         | ✅      | ❌       |
| Config Files     | ✅      | ❌       |

---

## 🛑 HARD STOP CONDITIONS

STOP immediately if:

- Scripts require modification
- Multiple interpretations exist

---

## 📦 DEPLOYMENT

Designed for:

- Vercel
- Docker-based platforms
- Managed PostgreSQL providers (Railway)

---

## 📄 LICENSE

Part of the **Panda Template System**.  
Usage may be subject to internal or commercial licensing.

---

## 🐼 FINAL DIRECTIVE

This repository prioritizes:

- Predictability
- Safety
- Longevity
- AI correctness

**Stability > Cleverness**
