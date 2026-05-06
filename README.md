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

- Next.js
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI
- Framer Motion
- Vitest + Testing Library

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

- Connect money movement, KYC, fraud, and messaging through backend APIs and regulated providers—the UI assumes those services exist behind stable contracts.
- Add more adapters (e.g. notifications, disputes, ledger) beside `payments.ts` following the same port pattern.

## License

Provided for use according to repository owner preferences.
