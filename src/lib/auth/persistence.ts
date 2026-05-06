import { STORAGE_KEYS } from "@/lib/constants/app";
import type { SessionState } from "./types";

export function loadPersistedSession(): SessionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.authSession);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SessionState>;
    if (
      parsed?.status === "authenticated" &&
      typeof parsed.subject === "string" &&
      typeof parsed.accessToken === "string"
    ) {
      return {
        status: "authenticated",
        subject: parsed.subject,
        email: typeof parsed.email === "string" ? parsed.email : undefined,
        displayName: typeof parsed.displayName === "string" ? parsed.displayName : undefined,
        accessToken: parsed.accessToken,
      };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function persistSession(session: SessionState): void {
  try {
    if (session.status === "guest") {
      localStorage.removeItem(STORAGE_KEYS.authSession);
      return;
    }
    localStorage.setItem(STORAGE_KEYS.authSession, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}
