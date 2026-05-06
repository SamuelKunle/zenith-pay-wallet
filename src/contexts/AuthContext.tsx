import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { STORAGE_KEYS } from "@/lib/constants/app";
import { registerApiSessionHeaders } from "@/lib/api/sessionHeaders";

export type AuthStatus = "guest" | "authenticated";

export interface SessionState {
  status: AuthStatus;
  /** Stable subject for logs / APIs — `guest:<uuid>` or `user:<email>` */
  subject: string;
  email?: string;
  displayName?: string;
  /** Opaque bearer — replace with JWT from your IdP */
  accessToken: string;
}

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function readAnonId(): string {
  try {
    const key = STORAGE_KEYS.anonymousId;
    let id = localStorage.getItem(key);
    if (!id) {
      id = randomId();
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `anon_${randomId()}`;
  }
}

function encodeMockToken(payload: Record<string, unknown>): string {
  try {
    const json = JSON.stringify({ ...payload, iat: Date.now() });
    if (typeof btoa !== "undefined") return `zenith_mock.${btoa(json)}`;
    return `zenith_mock.${json}`;
  } catch {
    return "zenith_mock.invalid";
  }
}

function guestSession(): SessionState {
  const anon = readAnonId();
  return {
    status: "guest",
    subject: `guest:${anon}`,
    accessToken: encodeMockToken({ sub: `guest:${anon}`, typ: "guest" }),
  };
}

function loadPersistedSession(): SessionState | null {
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

function persistSession(session: SessionState) {
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

interface AuthContextValue {
  session: SessionState;
  isAuthenticated: boolean;
  signInWithCredentials: (email: string, password: string) => void;
  signOut: () => void;
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

  const signInWithCredentials = useCallback((email: string, _password: string) => {
    const normalized = email.trim().toLowerCase();
    const localPart = normalized.split("@")[0] || "user";
    const next: SessionState = {
      status: "authenticated",
      subject: `user:${normalized}`,
      email: normalized,
      displayName: localPart.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      accessToken: encodeMockToken({
        sub: `user:${normalized}`,
        typ: "user",
        email: normalized,
      }),
    };
    persistSession(next);
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    persistSession(guestSession());
    setSession(guestSession());
  }, []);

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
