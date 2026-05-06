/** Single source for product copy and persisted keys used across the shell. */

export const APP_NAME = "Zenith Pay";

export const STORAGE_KEYS = {
  theme: "zenith-pay-theme",
  /** Persisted mock auth session (swap for real tokens later). */
  authSession: "zenith-pay-auth-v1",
  /** Stable anonymous device id for correlation before login. */
  anonymousId: "zenith-pay-anon-id",
} as const;

/** Relative paths — use for navigation and tests; keep in sync with `App.tsx` routes. */
export const ROUTES = {
  home: "/",
  landing: "/landing",
  login: "/login",
  history: "/history",
  transfer: "/transfer",
  fundWallet: "/fund-wallet",
  settings: "/settings",
  support: "/support",
} as const;
