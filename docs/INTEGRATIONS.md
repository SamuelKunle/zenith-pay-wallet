# Integration playbook

Use this checklist when wiring **Zenith Pay Wallet** (frontend) to your **backend**, **processors**, and **regulated services**. Routes point at UI surfaces already in the app; backend contracts are yours to define. Extend adapter-style boundaries under [`src/lib/adapters/`](../src/lib/adapters/).

For the consolidated **npm dependency** table and **vendor categories**, see [README § Third-party libraries](../README.md).

---

## How to read each section

| Column | Meaning |
| --- | --- |
| **UI surface** | Screens or flows users touch |
| **Likely APIs** | What your backend usually exposes or consumes |
| **Providers** | Typical commercial or infrastructure dependencies |
| **Compliance / ops** | Non-negotiable considerations before scale |

Tick items as you implement. Order can vary by jurisdiction and bank partner.

---

## 1. Funding (wallet top-up)

**UI:** `/fund-wallet`

Prototype `POST /api/v1/wallet/fund` is **on by default locally** (`npm run dev`, no `.env`). Set **`ZENITH_DISABLE_SIMULATED_FUNDING=true`** only where simulated credits must be off (see [`.env.example`](../.env.example)).

| Step | Backend / orchestration | Third-party domain |
| --- | --- | --- |
| [ ] Instrument vaulting & consent | Persist user-approved funding sources (bank link, saved card tokens) | Card tokenization / bank-link SDKs |
| [ ] ACH debit pull | Submit origination entries, handle returns/NOCs | ODFI partner, ACH API |
| [ ] RTP / instant rails (optional) | Eligibility checks, duplicate detection | RTP-capable treasury |
| [ ] Card top-up | Charge card → credit ledger | PSP / acquiring |
| [ ] Payroll / ACH credit (optional) | Payroll file ingest or employer routing | Payroll vendors, ACH credits |
| [ ] Settlement reconciliation | Match processor deposits to ledger posts | Accounting / reconciliation jobs |
| [ ] Limits & sanctions | Velocity, OFAC/sanctions on counterparties | Watchlist APIs |

---

## 2. Transfers & payouts

**UI:** `/transfer`, `/transfer/bank`, receipts in `/history`

| Step | Backend / orchestration | Third-party domain |
| --- | --- | --- |
| [ ] Recipient resolution | Resolve account/token/routing to verified beneficiary | Core banking / directory |
| [ ] Pricing engine | Fees, FX if applicable (`PaymentsPort`-style quotes) | Internal + scheme fees |
| [ ] Payment execution | ACH, wire, RTP, internal book transfer | Rails + your ledger |
| [ ] Idempotency & audit | Idempotency keys, immutable event log | Your persistence layer |
| [ ] Async status | Webhooks → push to client (poll or SSE later) | Messaging infra |
| [ ] Dispute hooks | Link out to case when user reports issue | Dispute / chargeback stack |

**Code seam:** implement real fee/quote logic in an adapter that replaces [`mockPaymentsAdapter`](../src/lib/adapters/payments.ts).

**Prototype API (this repo):** [`README.md § Backend API`](../README.md) documents `GET /api/v1/transactions`, `POST /api/v1/wallet/fund` *(simulated ACH/card/payroll credit for QA)*, `POST /api/v1/payments/quote`, and `POST /api/v1/transfers` wiring to [`src/server/transfers/transferService.ts`](../src/server/transfers/transferService.ts), [`src/server/wallet/fundService.ts`](../src/server/wallet/fundService.ts), and the in-memory ledger. [`sql/zenith_pay_schema.sql`](../sql/zenith_pay_schema.sql) maps the same concepts to Postgres. Replace these routes with persisted ledgers, idempotency keys, and real rails before any production traffic.

---

## 3. Card issuance & card spend

**UI:** `/cards`

| Step | Backend / orchestration | Third-party domain |
| --- | --- | --- |
| [ ] Program & BIN | Program ID, card product, region rules | Issuer processor + network |
| [ ] Card lifecycle | Issue, activate, freeze, replace | Issuing API |
| [ ] Authorization streaming | Auth advice, spend controls | Network + processor |
| [ ] PCI boundaries | No PAN in logs; tokenization only | HSM / vault partners |
| [ ] Disputes intake | Map auth to dispute case | Acquirer / issuer APIs |

---

## 4. Scan, pay & merchant

**UI:** `/scan`, `/merchant`, `/merchant/qr`

| Step | Backend / orchestration | Third-party domain |
| --- | --- | --- |
| [ ] QR payload signing | Tamper-proof QR, expiry, amount binding | Crypto keys (HSM/KMS) |
| [ ] Acceptance | Route to correct merchant wallet / MID | Acquirer or switch |
| [ ] Settlement reporting | Merchant payouts, fees | Same as acquiring |
| [ ] Refunds & partial capture | Match UX to processor capabilities | PSP |

---

## 5. KYC & identity

**UI:** `/kyc`, onboarding (`/signup`, `/pin-setup`)

| Step | Backend / orchestration | Third-party domain |
| --- | --- | --- |
| [ ] Document capture | Presigned URLs, retention policy | IDV vendor |
| [ ] Liveness / face match | Reduce synthetic ID risk | IDV vendor |
| [ ] AML / PEP / sanctions | Screening on create + periodic refresh | Watchlist provider |
| [ ] Risk tiering | Limits tied to verification level | Internal policy engine |
| [ ] Audit & appeal | Support review, re-submission | Workflow / ticketing |

---

## 6. Fraud & step-up security

**UI:** `/security`, `/sessions`, transfer confirmation patterns

| Step | Backend / orchestration | Third-party domain |
| --- | --- | --- |
| [ ] Device graph | Fingerprint, jailbreak/root signals | Device intelligence (optional) |
| [ ] Behavioral rules | Velocity, impossible travel heuristics | Rules engine + data store |
| [ ] Step-up MFA | OTP, passkeys, biometric challenge | Auth provider |
| [ ] Session revocation | Invalidate refresh tokens globally | Auth + session store |

**UI surface:** `/sessions` — wire “revoke” actions to your auth service.

---

## 7. Notifications & preferences

**UI:** `/notification-preferences`, `/settings` (high-level toggles)

| Step | Backend / orchestration | Third-party domain |
| --- | --- | --- |
| [ ] Preference store | User channel opt-in / legal basis | Your user profile service |
| [ ] Transactional fan-out | Templates, variables, idempotency | ESP (email), SMS, push |
| [ ] Push registration | Device tokens, topic subscription | FCM + APNs |
| [ ] Quiet hours & throttling | Caps per channel | Internal policy |

---

## 8. Scheduled & recurring payments

**UI:** `/scheduled-payments`

| Step | Backend / orchestration | Third-party domain |
| --- | --- | --- |
| [ ] Rule persistence | Amount, cadence, timezone, blackout windows | DB + job scheduler |
| [ ] Execution worker | Idempotent runs, retry, DLQ | Queue (SQS, Rabbit, etc.) |
| [ ] Failure handling | Insufficient funds → notify + skip | Ledger + notifications |
| [ ] Regulatory calendar | Holidays for ACH (region-specific) | Banking calendar data |

---

## 9. Payment requests (pay-by-link)

**UI:** `/request-money`

| Step | Backend / orchestration | Third-party domain |
| --- | --- | --- |
| [ ] Signed URLs | Short-lived tokens, deep links | KMS + link service |
| [ ] Payer experience | Hosted page or app handoff | Frontend + PSP |
| [ ] Webhooks on settlement | Update request status | PSP |
| [ ] Refunds & partials | Align with billing model | PSP |

---

## 10. Disputes & chargebacks

**UI:** `/disputes`

| Step | Backend / orchestration | Third-party domain |
| --- | --- | --- |
| [ ] Case intake | Attach transaction ARN / trace IDs | Processor APIs |
| [ ] Evidence bundles | Upload, virus scan, retention | Object storage |
| [ ] Provisional credit policy | Regime-specific | Legal + card rules |
| [ ] SLA tracking | Network deadlines | Case tool or internal workflow |

---

## 11. Statements & activity export

**UI:** `/history` (export affordance)

| Step | Backend / orchestration | Third-party domain |
| --- | --- | --- |
| [ ] Report job | Async PDF/CSV generation | Worker + queue |
| [ ] Signed delivery | Time-bound download links | Object storage + IAM |
| [ ] PII scope | Redact per regulation | Policy layer |

---

## 12. Bills, services & catalogs

**UI:** `/services`, `/services/:serviceId`

| Step | Backend / orchestration | Third-party domain |
| --- | --- | --- |
| [ ] Aggregator contracts | Per biller SKU, pricing | Bill pay networks (region-specific) |
| [ ] Settlement & float | Prepay vs. postpay models | Treasury |
| [ ] Reconciliation | Daily file match | Ops tooling |

---

## 13. Hosting, config & secrets

| Step | Notes |
| --- | --- |
| [ ] Separate **dev / staging / prod** API bases | Client env (e.g. `NEXT_PUBLIC_*` for public config only) |
| [ ] Never embed **secrets** in frontend | Use backend for HMAC, API keys, webhook signing |
| [ ] `NEXT_PUBLIC_HIDE_INTEGRATION_CALLOUT=true` | Hides the dashboard integration strip when branded |
| [ ] Observability | APM, structured logs, payout alerts |

---

## Adapter growth path

| Port (suggested) | Responsibility |
| --- | --- |
| `payments` (exists) | Quotes, execution, status |
| `notifications` | Channel prefs + send |
| `identity` | KYC state, document upload URLs |
| `ledger` | Balance reads, holds |
| `sessions` | Revocation, device list |

Keep React components thin: call your **Next.js API routes** or **BFF** that implement these ports server-side.
