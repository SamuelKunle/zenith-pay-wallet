import type { SessionState } from "./types";

function capitalizeWord(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/** Title-case a rough email local-part or slug for display (demo — replace with profile API). */
function formatLocalDisplayName(local: string): string {
  return local
    .split(/[._\s-]+/)
    .filter(Boolean)
    .map(capitalizeWord)
    .join(" ");
}

/** Demo-only: normalizes phone or email into a stable session identity (no real IdP). */
export function normalizeLoginIdentifier(raw: string): Pick<
  SessionState,
  "subject" | "email" | "displayName"
> {
  const t = raw.trim();
  if (!t) {
    throw new Error("Identifier required");
  }

  if (t.includes("@")) {
    const normalized = t.toLowerCase();
    const local = normalized.split("@")[0] || "user";
    return {
      subject: `user:${normalized}`,
      email: normalized,
      displayName: formatLocalDisplayName(local),
    };
  }

  const digits = t.replace(/\D/g, "");
  if (digits.length >= 10) {
    let cc = digits;
    if (cc.startsWith("0") && cc.length >= 11) {
      cc = `234${cc.slice(1)}`;
    } else if (!cc.startsWith("234") && cc.length === 10) {
      cc = `234${cc}`;
    }
    const pseudoEmail = `phone.${cc}@zenith.demo`;
    const rest = cc.startsWith("234") && cc.length >= 12 ? cc.slice(3) : cc;
    const display =
      rest.length >= 10
        ? `+234 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`
        : `+${cc}`;
    return {
      subject: `user:${pseudoEmail}`,
      email: pseudoEmail,
      displayName: display,
    };
  }

  const slug =
    t
      .toLowerCase()
      .replace(/\s+/g, ".")
      .replace(/[^a-z0-9._-]/g, "") || "user";
  const pseudoEmail = `${slug}@zenith.demo`;
  return {
    subject: `user:${pseudoEmail}`,
    email: pseudoEmail,
    displayName: formatLocalDisplayName(slug.replace(/\./g, " ")),
  };
}
