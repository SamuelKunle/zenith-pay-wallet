# Zenith Pay Wallet

Zenith Pay Wallet is a Next.js, React, and TypeScript client for a digital wallet product. Screens and flows are built so you can connect real payments, identity, notifications, session services, and reporting on the backend without redesigning UX.

## Project overview

Suited for:

- Product builds where the backend and providers are phased in gradually
- Design and engineering alignment on wallet, merchant, and security journeys
- A clear frontend surface that maps cleanly to bounded integration contracts

## Feature surface

- Wallet dashboard with balances and activity
- Transfers and payment journeys
- Scan-to-pay and merchant QR experience
- Card controls
- Savings, rewards, and insights
- Security, sessions, disputes, schedules, funding paths, payment requests
- Responsive layouts and light/dark themes

### Operational & integration modules

Available from **Services → Wallet tools** (or directly by route):

| Flow | Route |
| --- | --- |
| Funding (ACH / card / payroll entry points) | `/fund-wallet` |
| Scheduled & recurring payments | `/scheduled-payments` |
| Request-money links | `/request-money` |
| Dispute center | `/disputes` |
| Device & session management | `/sessions` |
| Alert preferences | `/notification-preferences` |

**Integration readiness strip:** `IntegrationReadinessBanner` on the dashboard and the modules above summarizes how the UI aligns with adapters. Hide it in production-branding deployments with:

```bash
NEXT_PUBLIC_HIDE_INTEGRATION_CALLOUT=true
```

**Payments seam:** see `src/lib/adapters/payments.ts` (`PaymentsPort` + `mockPaymentsAdapter`). Swap the adapter implementation for your processor or treasury service.

## Tech stack

- Next.js (app host & build)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui (generated components under `src/components/ui`, configured in [`components.json`](components.json)) on top of Radix UI primitives
- Framer Motion
- Vitest + Testing Library (+ jsdom)

## Third-party open-source libraries (npm)

Everything below is declared in [`package.json`](package.json). Install with `npm install`; versions are pinned in `package-lock.json`. Each package has its own license (see individual `LICENSE` files in `node_modules` after install).

| Category | Packages / notes |
| --- | --- |
| **Framework** | [`next`](https://nextjs.org/), [`react`](https://react.dev/), [`react-dom`](https://react.dev/) |
| **Client routing (in-app)** | [`react-router-dom`](https://reactrouter.com/) — shells the main experience inside Next’s `pages/` catch-all route |
| **Styling & design tokens** | [`tailwindcss`](https://tailwindcss.com/), [`postcss`](https://postcss.org/), [`autoprefixer`](https://github.com/postcss/autoprefixer), [`tailwind-merge`](https://github.com/dcastil/tailwind-merge), [`tailwindcss-animate`](https://github.com/jamiebuilds/tailwindcss-animate), [`clsx`](https://github.com/lukeed/clsx), [`class-variance-authority`](https://github.com/joe-bell/cva), [`@tailwindcss/typography`](https://tailwindcss.com/docs/typography-plugin) *(dev plugin)* |
| **Accessible primitives (UI)** | `@radix-ui/react-*` (accordion, alert-dialog, dialog, dropdown-menu, tooltip, toast, tabs, slider, scroll-area, select, etc.—see [`package.json`](package.json)) |
| **Icons** | [`lucide-react`](https://lucide.dev/) |
| **Fonts** | [`@fontsource-variable/plus-jakarta-sans`](https://fontsource.org/) |
| **Theming** | [`next-themes`](https://github.com/pacocoursey/next-themes) |
| **Data fetching & caching** | [`@tanstack/react-query`](https://tanstack.com/query) |
| **Forms & validation** | [`react-hook-form`](https://react-hook-form.com/), [`zod`](https://zod.dev/), [`@hookform/resolvers`](https://github.com/react-hook-form/resolvers) |
| **Charts** | [`recharts`](https://recharts.org/) |
| **Animation** | [`framer-motion`](https://www.framer.com/motion/) |
| **Complementary UI widgets** | [`cmdk`](https://cmdk.paco.me/), [`embla-carousel-react`](https://www.embla-carousel.com/), [`input-otp`](https://input-otp.rodz.dev/), [`react-day-picker`](https://react-day-picker.js.org/), [`react-resizable-panels`](https://github.com/bvaughn/react-resizable-panels), [`sonner`](https://sonner.emilkowal.ski/), [`vaul`](https://github.com/emilkowalski/vaul) (drawer) |
| **Browser compat metadata** *(runtime deps used by toolchain)* | [`browserslist`](https://github.com/browserslist/browserslist), [`caniuse-lite`](https://github.com/browserslist/caniuse-lite) |
| **Testing & linting** *(dev)* | [`vitest`](https://vitest.dev/), [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro/), [`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom), [`jsdom`](https://github.com/jsdom/jsdom), [`eslint`](https://eslint.org/), [`typescript-eslint`](https://typescript-eslint.io/), related ESLint plugins—see [`package.json`](package.json) |

Vitest resolves a **test runner toolchain** at install time that may pull in tooling such as Vite-compatible packages indirectly; consult `npm ls` if you harden SBOM/licensing.

---

## External services & vendors (production integrations)

This repository is **frontend-only**. Moving real money, identity, messaging, or dispute handling requires **your backend** talking to regulated or commercial providers. Below maps **areas of the UX** to the **categories of third parties** adopters normally wire in—the list is illustrative, not exhaustive.

| App capability | Typical third-party / integration domain | Notes |
| --- | --- | --- |
| Bank balances & ledger | **Banking-as-a-Service (BaaS)**, sponsor bank APIs, ledger services | ACH balance, RTP/FedNow availability, holds, reconciliation |
| Inbound wallet funding (`/fund-wallet`) | **ACH origination**, **card acquiring / tokenization**, **payroll ingest** partners | ACH (e.g. Plaid-linked debits vs. ACH API), PSP for cards, payroll file/RTP connectors |
| Transfers & payouts | **Rails provider** + **custody/settlement bank** | Real-time ACH, RTP, wires, Swift—depends on region |
| Card products (`/cards`) | **Issuer processor**, network membership (Visa/Mastercard), **BIN sponsors** | Program management and compliance-heavy |
| Card & wallet top-ups | **Payment gateway / PSP** | Tokenized card APIs, PCI scope reduction |
| KYC / identity (`/kyc`, onboarding) | **Identity verification**, **sanctions/watchlist**, **AML** tooling | OCR, liveness, risk scores—must match your jurisdictional regime |
| Fraud & velocity | **Fraud orchestration**, **device intelligence**, **step-up MFA** vendors | Tie to transfers, login, and card events |
| Push notifications | **APNs**, **Firebase Cloud Messaging (FCM)**, unified push gateways | Matches device OS; frontend only registers tokens |
| SMS alerts | **SMS aggregators** (e.g. Twilio-class providers) | Consent and opt-in records required |
| Email receipts / statements | **Transactional email** (ESP) or **cloud mail** APIs | Bounce handling, templates, compliance footers |
| QR & merchant acceptance (`/merchant`, `/scan`) | **Acquirer / QR scheme** or **internal payment switch** | Often same PSP as online card |
| Disputes & chargebacks (`/disputes`) | **Card network / acquirer dispute APIs**, **case management** | Evidence submission, representment SLAs |
| Reports & exports (`/history` export action) | **Object storage**, **signed URLs**, **job queue** | PDF/CSV generation usually server-side |
| Sessions & device trust (`/sessions`, security) | **Auth provider** (OIDC/OAuth2), **session store** (e.g. Redis), **device graph** | Revocation = server invalidates refresh tokens |
| Hosting & edge | **Vercel**, **AWS**, **GCP**, **Cloudflare**, etc. | Next.js runs on Node; configure env and secrets per host |
| Observability | **APM**, **logging**, **error tracking** | Not in repo; add at deploy time |

**Adapter pattern in this repo:** start from `src/lib/adapters/payments.ts` (`PaymentsPort`) and add sibling ports (e.g. `notifications.ts`, `identity.ts`) as you implement providers—keep UI stable while swapping implementations.

## Getting started

### Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (or newer)

### Local development

```bash
cd "/Users/samuelimac/Desktop/iMac/PublicGithubRepo/zenith-pay"
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run start` — Production server
- `npm run lint` — ESLint
- `npm run test` — Vitest suite
- `npm run test:watch` — Vitest watch mode

### Production run

```bash
npm run build
npm run start
```

## Deployment notes

- See **External services & vendors** above for the third-party landscape; this client expects your APIs to front those providers.
- Extend `src/lib/adapters/` with additional ports (notifications, identity, disputes, ledger) next to `payments.ts` as backends go live.

## License

Provided for use according to repository owner preferences.
