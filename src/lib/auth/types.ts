/** Canonical session snapshot shared by mock auth, API mapping, and React context. */
export type AuthStatus = "guest" | "authenticated";

export interface SessionState {
  status: AuthStatus;
  /** Stable subject for logs / APIs — `guest:<uuid>` or `user:<email>` */
  subject: string;
  email?: string;
  displayName?: string;
  /** Opaque bearer — JWT / opaque token from your IdP */
  accessToken: string;
}
