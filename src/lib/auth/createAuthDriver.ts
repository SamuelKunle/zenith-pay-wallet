import { logger } from "@/lib/logger";
import { publicEnv } from "@/lib/env/publicEnv";
import type { AuthDriver } from "./AuthDriver";
import { createMockAuthDriver } from "./mockAuthDriver";
import { createApiAuthDriver } from "./apiAuthDriver";

/**
 * Single auth backend for the SPA — driven by `NEXT_PUBLIC_AUTH_DRIVER` (build-time).
 * - `mock` (default): instant local sign-in for demos.
 * - `api`: `POST {NEXT_PUBLIC_AUTH_API_BASE}/v1/auth/login` — wire `mapLoginResponseToSession` to your IdP.
 */
export function createAuthDriver(): AuthDriver {
  if (publicEnv.auth.driver === "api") {
    const base = publicEnv.auth.apiBase;
    if (!base) {
      logger.warn(
        "NEXT_PUBLIC_AUTH_DRIVER=api but NEXT_PUBLIC_AUTH_API_BASE is empty — using mock auth driver",
      );
      return createMockAuthDriver();
    }
    return createApiAuthDriver(base);
  }
  return createMockAuthDriver();
}

/** Module singleton — auth strategy is fixed per build. */
export const authDriver = createAuthDriver();
