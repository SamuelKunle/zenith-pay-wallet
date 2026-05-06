# Zenith Pay Wallet

Zenith Pay Wallet is a premium digital wallet demo built with Next.js, React, and TypeScript. It showcases production-style fintech user journeys, including transfers, scan-to-pay, merchant flows, card controls, savings, rewards, and security-focused UX.

## Project Overview

This repository is designed as a high-fidelity frontend demo for digital wallet use cases. It is ideal for:

- Product demos and stakeholder walkthroughs
- UI/UX validation for fintech workflows
- Frontend architecture reference for wallet apps
- Future integration with real payments, KYC, and notification providers

## Key Features

- Wallet dashboard with balances and activity
- Transfer and payment journeys
- Scan-to-pay and merchant QR experience
- Cards management and controls
- Savings, rewards, and insights modules
- Security and profile settings
- Responsive mobile and desktop layouts
- Light and dark theme support

## Tech Stack

- Next.js
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui and Radix UI
- Framer Motion
- Vitest + Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (or newer)

### Local Development

```bash
cd "/Users/samuelimac/Desktop/iMac/PublicGithubRepo/zenith-pay"
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint checks
- `npm run test` - Run the Vitest test suite
- `npm run test:watch` - Run tests in watch mode

## Production Run

```bash
npm run build
npm run start
```

## Deployment Notes

- This project is currently demo-first and frontend-focused.
- Core financial and compliance features (real money movement, live KYC, fraud decisioning, push/SMS delivery) should be integrated via backend services and provider APIs for production use.
- Next.js build output is optimized for standard modern deployment targets.

## License

This project is provided for demo and educational purposes unless otherwise specified by the repository owner.
