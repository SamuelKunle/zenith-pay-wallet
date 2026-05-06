import type { AuthDriver } from "./AuthDriver";
import type { SessionState } from "./types";
import { AuthSignInError } from "./errors";

/**
 * Maps your IdP login JSON to our `SessionState`.
 * Adjust field names to match production (`sub`, `access_token`, OAuth2, OIDC, etc.).
 */
export function mapLoginResponseToSession(body: unknown): SessionState {
  if (body === null || typeof body !== "object") {
    throw new AuthSignInError("Invalid auth response", "UNKNOWN");
  }
  const o = body as Record<string, unknown>;
  const accessToken = String(o.access_token ?? o.accessToken ?? "");
  if (!accessToken) {
    throw new AuthSignInError("Auth response missing access token", "UNKNOWN");
  }
  const subject = String(o.subject ?? o.sub ?? "");
  if (!subject) {
    throw new AuthSignInError("Auth response missing subject", "UNKNOWN");
  }
  return {
    status: "authenticated",
    subject,
    email: typeof o.email === "string" ? o.email : undefined,
    displayName:
      typeof o.display_name === "string"
        ? o.display_name
        : typeof o.displayName === "string"
          ? o.displayName
          : undefined,
    accessToken,
  };
}

/**
 * Real HTTP sign-in — points at `baseUrl` (e.g. `https://api.example.com`).
 * Expected: `POST {baseUrl}/v1/auth/login` with JSON `{ identifier, password }`.
 * Response: JSON including `access_token` (or `accessToken`) and `subject` (or `sub`).
 */
export function createApiAuthDriver(baseUrl: string): AuthDriver {
  const root = baseUrl.replace(/\/$/, "");

  return {
    async signInWithCredentials(identifier: string, password: string): Promise<SessionState> {
      const url = `${root}/v1/auth/login`;
      let res: Response;
      try {
        res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ identifier, password }),
        });
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        throw new AuthSignInError(err.message || "Network error", "NETWORK", e);
      }

      const text = await res.text();
      let data: unknown = null;
      try {
        data = text ? (JSON.parse(text) as unknown) : null;
      } catch {
        throw new AuthSignInError("Auth server returned invalid JSON", "UNKNOWN");
      }

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new AuthSignInError(
            typeof data === "object" && data !== null && "message" in data
              ? String((data as { message?: string }).message)
              : "Invalid credentials",
            "INVALID_CREDENTIALS",
          );
        }
        throw new AuthSignInError(
          typeof data === "object" && data !== null && "error" in data
            ? String((data as { error?: string }).error)
            : `Sign-in failed (${res.status})`,
          "NETWORK",
        );
      }

      return mapLoginResponseToSession(data);
    },

    async signOut(accessToken: string): Promise<void> {
      try {
        await fetch(`${root}/v1/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } catch {
        /* best-effort revoke */
      }
    },
  };
}
