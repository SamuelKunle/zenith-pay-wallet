import type { SessionState } from "./types";

/**
 * Pluggable auth backend: local mock now; swap to API by setting env (see `createAuthDriver`).
 * Implement this interface against your IdP (OAuth password grant, custom login API, etc.).
 */
export interface AuthDriver {
  /** Password or passkey flow — returns the session snapshot to persist client-side. */
  signInWithCredentials(identifier: string, password: string): Promise<SessionState>;

  /**
   * Optional server revoke — receives the current access token after user signs out.
   * Omit for stateless JWT-only flows.
   */
  signOut?(accessToken: string): Promise<void>;
}
