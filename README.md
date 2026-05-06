# Zenith Pay Wallet

**Zenith Pay** is a premium digital wallet built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**. The experience covers **end-to-end money flows** (quotes, transfers, wallet balance, activity, simulated funding), **card controls**, **merchant** and **scan-to-pay** journeys, **savings**, **insights**, notifications and tooling routes, and **security-minded UX**—delivered as a cohesive product surface rather than a static mock.

Architecturally it’s a **full-stack prototype**: a **React Router** client using **TanStack Query** talks to **Next.js Pages API** routes under `/api/v1/...`, with thin **server modules** (`transferService`, in-memory ledger, fund simulation, IDs) designed so you can attach **Postgres** ([`sql/zenith_pay_schema.sql`](sql/zenith_pay_schema.sql)), real rails, and processors **without rewriting screens**.

On the platform side the repo includes **pluggable mock telemetry** (swap for PostHog, Segment, etc.), **session-correlated HTTP** (`X-Request-Id`, `X-Zenith-Session`, bearer-shaped `Authorization`), **feature flags**, **React error boundaries**, **Zod-validated public/server env**, **structured logging** on money endpoints, and **HTTP security headers**—giving you a credible demo today and explicit seams for production **identity**, **observability**, and **backend** swap-in.

Use it as:

- **Product + integration reference** — routes and flows aligned with adapters and API shapes
- **Local demo / QA harness** — in-memory ledger, quotes, transfers, activity feed, optional simulated funding
- **Staging toward production** — replace server implementations and attach Postgres (see [`sql/zenith_pay_schema.sql`](sql/zenith_pay_schema.sql))

---

## Architecture at a glance

| Layer | What lives here | Plug-and-play |
| --- | --- | --- |
| **UI** | `src/pages/` (React Router), shared components under `src/components/` | Screens stay stable; swap copy and visuals only |
| **HTTP API** | `pages/api/**` (`/api/v1/...`) | Keep route contracts or version (`/api/v2`) when migrating |
| **Pricing / rails contract** | `src/lib/adapters/payments.ts` — `PaymentsPort`, `mockPaymentsAdapter` | Implement **`PaymentsPort`** against your PSP or treasury; wired by `transferService` and quote endpoints |
| **Ledger & activity** | `src/server/ledger/mockLedger.ts`, `transactionMemory.ts` | Replace with repositories over **`wallet_balances`** / **`wallet_transactions`** ([`sql/zenith_pay_schema.sql`](sql/zenith_pay_schema.sql)) |
| **Orchestration** | `src/server/transfers/transferService.ts`, `src/server/wallet/fundService.ts`, `src/server/ids.ts` | Thin services: keep signatures, swap internals for DB + idempotency + webhooks |
| **Cards (prototype)** | `src/server/cards/cardMemory.ts`, `cardService.ts` — `GET/POST /api/v1/wallet/cards`, `PATCH …/cards/[id]` | In-memory issuance + freeze; swap for issuer/BIN service + PCI-safe PAN vault |
| **Persistence (reference)** | [`sql/zenith_pay_schema.sql`](sql/zenith_pay_schema.sql) | Run via your migration tool (Prisma / Drizzle / Flyway / Atlas); not executed by Next.js |

**Extend adapters:** add more ports beside payments (for example `src/lib/adapters/notifications.ts`, `identity.ts`) and call them from new or existing API handlers—[**`docs/INTEGRATIONS.md`**](docs/INTEGRATIONS.md) tracks vendor and compliance checklists flow by flow.

---

## Environment variables

**Local try-out:** you do **not** need any `.env` file. Run `npm install` and `npm run dev`; all prototype APIs (including **simulated funding** on `/fund-wallet`) work with defaults.

Copy [`.env.example`](.env.example) to `.env.local` only when you want non-default behavior.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_HIDE_INTEGRATION_CALLOUT` | Client | Hide `IntegrationReadinessBanner` on dashboard and wallet tools |
| `NEXT_PUBLIC_FF_INSIGHTS_BETA` | Client | When **`true`**, show **Beta** on Insights |
| `NEXT_PUBLIC_FF_SCHEDULED_BETA` | Client | When **`true`**, show **Beta** on scheduled payments |
| `NEXT_PUBLIC_AUTH_DRIVER` | Client | **`mock`** (default, offline demo) or **`api`** to use HTTP login via `NEXT_PUBLIC_AUTH_API_BASE` — see `src/lib/auth/apiAuthDriver.ts` |
| `NEXT_PUBLIC_AUTH_API_BASE` | Client | Origin for IdP calls when driver is **`api`** (e.g. `https://api.example.com`; expects `POST /v1/auth/login` + JSON mapped in code) |
| `ZENITH_DISABLE_SIMULATED_FUNDING` | Server | When **`true`**, `POST /api/v1/wallet/fund` returns **403**. Omit or leave unset locally so developers can still simulate credits; set **`true`** on internet-facing production |

---

## Project overview

Suited for:

- Teams phasing in **real rails** while keeping the UX contract stable
- **Bounded integration seams** — adapters, API routes, DDL that line up with the UI
- A single deployable artifact (Next.js) for demos; split to **BFF + separate API** later if you prefer

---

## Feature surface

- Wallet dashboard with balance and activity (API-backed where noted)
- Transfers with server-side quoting and ledger debit
- Scan-to-pay and merchant QR journeys (UI scaffolding)
- **Cards** — issue virtual (instant) or request physical (pending) via API; freeze/unfreeze persisted server-side (prototype memory store)
- Savings, insights (mix of illustrative and API-fed data)
- Security, sessions, disputes, schedules, funding, request-money, notifications (tooling routes + adapter framing)
- Responsive layouts and **light/dark** themes

### Operational & integration modules

Available from **Services → Wallet tools** (or directly by route):

| Flow | Route |
| --- | --- |
| Funding (ACH / card / payroll entry points + prototype simulate) | `/fund-wallet` |
| Scheduled & recurring payments | `/scheduled-payments` |
| Request-money links | `/request-money` |
| Dispute center | `/disputes` |
| Device & session management | `/sessions` |
| Alert preferences | `/notification-preferences` |

**Payments seam:** [`src/lib/adapters/payments.ts`](src/lib/adapters/payments.ts) (`PaymentsPort` + `mockPaymentsAdapter`).

---

## Tech stack

- **Next.js** — build, SSR shell, **Pages API** (`pages/api/`)
- **React 18** + **TypeScript**
- **React Router** — in-app routing inside Next’s catch-all page `pages/[[...slug]].tsx`
- **Tailwind CSS**, **shadcn/ui** (under `src/components/ui`, [`components.json`](components.json))
- **TanStack Query** — client fetching against `/api/v1/*`
- **Vitest** + Testing Library (+ jsdom), **ESLint**, **typescript-eslint**

---

## Third-party open-source libraries (npm)

Everything below is declared in [`package.json`](package.json). Install with `npm install`; versions are pinned in `package-lock.json`. Each package has its own license (see individual `LICENSE` files in `node_modules` after install).

| Category | Packages / notes |
| --- | --- |
| **Framework** | [`next`](https://nextjs.org/), [`react`](https://react.dev/), [`react-dom`](https://react.dev/) |
| **Client routing (in-app)** | [`react-router-dom`](https://reactrouter.com/) — shells the main experience inside Next’s `pages/` catch-all route |
| **Styling & design tokens** | [`tailwindcss`](https://tailwindcss.com/), [`postcss`](https://postcss.org/), [`autoprefixer`](https://github.com/postcss/autoprefixer), [`tailwind-merge`](https://github.com/dcastil/tailwind-merge), [`tailwindcss-animate`](https://github.com/jamiebuilds/tailwindcss-animate), [`clsx`](https://github.com/lukeed/clsx), [`class-variance-authority`](https://github.com/joe-bell/cva), [`@tailwindcss/typography`](https://tailwindcss.com/docs/typography-plugin) *(dev plugin)* |
| **Accessible primitives (UI)** | `@radix-ui/react-*` (see [`package.json`](package.json)) |
| **Icons** | [`lucide-react`](https://lucide.dev/) |
| **Fonts** | [`@fontsource-variable/plus-jakarta-sans`](https://fontsource.org/) |
| **Theming** | [`next-themes`](https://github.com/pacocoursey/next-themes) |
| **Data fetching & caching** | [`@tanstack/react-query`](https://tanstack.com/query) |
| **Forms & validation** | [`react-hook-form`](https://react-hook-form.com/), [`zod`](https://zod.dev/), [`@hookform/resolvers`](https://github.com/react-hook-form/resolvers) |
| **Charts** | [`recharts`](https://recharts.org/) |
| **Animation** | [`framer-motion`](https://www.framer.com/motion/) |
| **Complementary UI widgets** | [`cmdk`](https://cmdk.paco.me/), [`embla-carousel-react`](https://www.embla-carousel.com/), [`input-otp`](https://input-otp.rodz.dev/), [`react-day-picker`](https://react-day-picker.js.org/), [`react-resizable-panels`](https://github.com/bvaughn/react-resizable-panels), [`sonner`](https://sonner.emilkowal.ski/), [`vaul`](https://github.com/emilkowalski/vaul) (drawer) |
| **Browser compat metadata** *(toolchain)* | [`browserslist`](https://github.com/browserslist/browserslist), [`caniuse-lite`](https://github.com/browserslist/caniuse-lite) |
| **Testing & linting** *(dev)* | [`vitest`](https://vitest.dev/), [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro/), [`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom), [`jsdom`](https://github.com/jsdom/jsdom), [`eslint`](https://eslint.org/), [`typescript-eslint`](https://typescript-eslint.io/) — see [`package.json`](package.json) |

---

## Backend API (prototype)

Next.js **Pages API** under [`pages/api/`](pages/api/) implements **v1** JSON endpoints. **Fees are always recomputed on the server** for transfers; the client uses quotes for display only.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Liveness JSON |
| `GET` | `/api/v1/wallet/balance` | Wallet snapshot (balance, tag, summary) |
| `GET` | `/api/v1/transactions` | Query: `limit` — activity feed (home, `/history`, cards preview) |
| `POST` | `/api/v1/wallet/fund` | Body: `{ amountCents, channel }` (`ach` \| `debit` \| `payroll`) — **simulated** credit; disable with `ZENITH_DISABLE_SIMULATED_FUNDING=true` |
| `POST` | `/api/v1/payments/quote` | Body: `{ amountCents }` — quote via `PaymentsPort` |
| `POST` | `/api/v1/transfers` | Body: `{ amountCents, recipientTag? }` — ledger debit after server-side pricing |

**Prototype limits:** balance and transactions live **in-memory** (`mockLedger`, `transactionMemory`). They **reset on cold start** (and typical serverless instance recycle). Seeded transactions are illustrative; **completed transfers** and **simulated funding** reconcile with the running balance.

**Production path:** persist using [`sql/zenith_pay_schema.sql`](sql/zenith_pay_schema.sql), add auth and idempotency keys on mutate routes, replace `fund` with ACH/RTP/card settlement ingestion, and remove or hard-disable simulated funding.

---

## External services & vendors (production)

Moving real money, identity, messaging, or dispute handling requires regulated or commercial providers. Below maps **app capabilities** to **typical vendor domains** ([**`docs/INTEGRATIONS.md`**](docs/INTEGRATIONS.md) has finer checklists).

| App capability | Typical third-party / integration domain | Notes |
| --- | --- | --- |
| Bank balances & ledger | **BaaS**, sponsor bank APIs, ledger products | RTP/FedNow, holds, reconciliation |
| Inbound funding (`/fund-wallet`) | **ACH**, **cards**, **payroll** connectors | Replace prototype `fund` POST with PSP webhooks → ledger |
| Transfers & payouts | **Rails** + custody / settlement bank | Wires, RTP, internal book transfers |
| Card products (`/cards`) | **Issuer processor**, networks, BIN sponsors | Heavy compliance surface |
| KYC (`/kyc`) | Identity, sanctions, AML | Jurisdiction-specific |
| Push / SMS / email | **APNs**, **FCM**, SMS ESPs, transactional email | Consent and templates |
| QR & merchant (`/merchant`, `/scan`) | Acquirer / internal switch | Often same PSP as online |
| Disputes (`/disputes`) | Network / acquirer dispute APIs | Evidence and SLAs |
| Exports (`/history`) | **Object storage**, signed URLs, job queues | Statements server-side |
| Sessions (`/sessions`) | **OIDC** provider, Redis-style session store | Server-side revocation |
| Hosting | **Vercel**, **AWS**, **GCP**, etc. | Secrets via host env vars |
| Observability | **APM**, logging, error tracking | Add at deploy time |

---

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+ (or newer)

### Local development

```bash
git clone <your-fork-or-repo-url> zenith-pay
cd zenith-pay
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No `.env` setup required—ledger, transfers, history, and **Fund wallet → simulate** all work out of the box.

Optional: `cp .env.example .env.local` if you want to hide the integration banner or disable simulated funding.

---

## Repository layout (integration-oriented)

```
pages/api/                  # REST surface (/api/v1/...)
pages/[[...slug]].tsx       # Next catches all; React Router renders app routes
src/lib/adapters/           # Ports — start with payments.ts
src/server/                 # Ledger, transfers, funding, HTTP helpers
src/server/ledger/          # Replace with DB-backed repos in production
src/lib/api/               # Shared fetch helpers + DTO-aligned types
src/lib/transactions/      # Presentation helpers for txn DTOs
sql/zenith_pay_schema.sql   # Reference Postgres DDL (not auto-run)
docs/INTEGRATIONS.md        # Vendor + ops checklists per flow
```

---

## Available scripts

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run start` — Production server (`next start`)
- `npm run lint` — ESLint
- `npm run test` — Vitest

### Production run

```bash
npm run build
npm run start
```

Set **`ZENITH_DISABLE_SIMULATED_FUNDING=true`** in production if the app is reachable on the public internet so simulated credits cannot be posted.

---

## Deployment notes

- Treat **Pages API** as your BFF until you extract a standalone service; keep **JSON shapes** compatible with mobile or other clients if you split later.
- Wire **OAuth / session middleware** ahead of mutate routes (`/transfers`, `/wallet/fund`) before any shared environment.
- Use [**`docs/INTEGRATIONS.md`**](docs/INTEGRATIONS.md) for sanctions, idempotency, webhooks, and reconciliation tasks per release.

---

## License

Provided for use according to repository owner preferences.
