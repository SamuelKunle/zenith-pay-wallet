import type { AuthDriver } from "./AuthDriver";
import type { SessionState } from "./types";
import { encodeMockToken } from "./mockToken";
import { normalizeLoginIdentifier } from "./normalizeIdentifier";

/** Immediate local sign-in — uses normalized identifier + mock bearer (no network). */
export function createMockAuthDriver(): AuthDriver {
  return {
    async signInWithCredentials(identifier: string, password: string): Promise<SessionState> {
      void password;
      const { subject, email, displayName } = normalizeLoginIdentifier(identifier);
      return {
        status: "authenticated",
        subject,
        email,
        displayName,
        accessToken: encodeMockToken({
          sub: subject,
          typ: "user",
          email,
        }),
      };
    },
  };
}
