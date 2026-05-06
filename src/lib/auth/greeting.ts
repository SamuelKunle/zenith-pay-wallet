import type { SessionState } from "./types";

function capitalizeWord(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/** Short name for dashboard greetings from session state. */
export function getSessionGreetingName(session: SessionState): string {
  if (session.status !== "authenticated") return "Charlie";
  const em = session.email ?? "";
  if (em.startsWith("phone.") && em.endsWith("@zenith.demo")) {
    return "Member";
  }
  if (em.includes("@") && !em.endsWith("@zenith.demo")) {
    const local = em.split("@")[0] || "user";
    const first = local.split(/[._-]/)[0] || local;
    return capitalizeWord(first);
  }
  if (session.displayName && !session.displayName.startsWith("+")) {
    return session.displayName.split(/\s+/)[0] ?? "Charlie";
  }
  return "Member";
}
