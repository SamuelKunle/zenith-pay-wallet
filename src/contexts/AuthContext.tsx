import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { registerApiSessionHeaders } from "@/lib/api/sessionHeaders";
import type { SessionState } from "@/lib/auth/types";
import { authDriver } from "@/lib/auth/createAuthDriver";
import { guestSession } from "@/lib/auth/guest";
import { loadPersistedSession, persistSession } from "@/lib/auth/persistence";

/** Re-export shared types & helpers for screens that already import from context. */
export type { AuthStatus, SessionState } from "@/lib/auth/types";
export { getSessionGreetingName } from "@/lib/auth/greeting";
export { normalizeLoginIdentifier } from "@/lib/auth/normalizeIdentifier";

interface AuthContextValue {
  session: SessionState;
  isAuthenticated: boolean;
  signInWithCredentials: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>(() => loadPersistedSession() ?? guestSession());

  useEffect(() => {
    registerApiSessionHeaders(() => {
      const h: Record<string, string> = {
        "X-Zenith-Session": session.subject,
      };
      if (session.accessToken) {
        h.Authorization = `Bearer ${session.accessToken}`;
      }
      return h;
    });
    return () => registerApiSessionHeaders(() => ({}));
  }, [session.subject, session.accessToken]);

  const signInWithCredentials = useCallback(async (identifier: string, password: string) => {
    const next = await authDriver.signInWithCredentials(identifier, password);
    persistSession(next);
    setSession(next);
  }, []);

  const signOut = useCallback(async () => {
    await authDriver.signOut?.(session.accessToken);
    const next = guestSession();
    persistSession(next);
    setSession(next);
  }, [session.accessToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: session.status === "authenticated",
      signInWithCredentials,
      signOut,
    }),
    [session, signInWithCredentials, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
