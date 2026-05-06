import { z } from "zod";
import { logger } from "@/lib/logger";

/**
 * Browser-safe configuration (NEXT_PUBLIC_*). Values are inlined at build time.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_HIDE_INTEGRATION_CALLOUT: z.string().optional(),
  NEXT_PUBLIC_FF_INSIGHTS_BETA: z.string().optional(),
  NEXT_PUBLIC_FF_SCHEDULED_BETA: z.string().optional(),
  /** `mock` (default) | `api` — see `src/lib/auth/createAuthDriver.ts` */
  NEXT_PUBLIC_AUTH_DRIVER: z.string().optional(),
  /** Base URL for auth API when driver is `api`, e.g. `https://api.example.com` */
  NEXT_PUBLIC_AUTH_API_BASE: z.string().optional(),
});

export type PublicEnv = {
  hideIntegrationCallout: boolean;
  featureFlags: {
    insightsBeta: boolean;
    scheduledBeta: boolean;
  };
  auth: {
    /** Local mock vs HTTP IdP (`POST …/v1/auth/login`). */
    driver: "mock" | "api";
    apiBase: string;
  };
};

function loadPublicEnv(): PublicEnv {
  const raw = {
    NEXT_PUBLIC_HIDE_INTEGRATION_CALLOUT: process.env.NEXT_PUBLIC_HIDE_INTEGRATION_CALLOUT,
    NEXT_PUBLIC_FF_INSIGHTS_BETA: process.env.NEXT_PUBLIC_FF_INSIGHTS_BETA,
    NEXT_PUBLIC_FF_SCHEDULED_BETA: process.env.NEXT_PUBLIC_FF_SCHEDULED_BETA,
    NEXT_PUBLIC_AUTH_DRIVER: process.env.NEXT_PUBLIC_AUTH_DRIVER,
    NEXT_PUBLIC_AUTH_API_BASE: process.env.NEXT_PUBLIC_AUTH_API_BASE,
  };
  const parsed = publicEnvSchema.safeParse(raw);
  if (!parsed.success) {
    logger.warn("Invalid public env; using defaults", { issues: parsed.error.flatten() });
    return {
      hideIntegrationCallout: false,
      featureFlags: { insightsBeta: false, scheduledBeta: false },
      auth: { driver: "mock", apiBase: "" },
    };
  }
  const d = parsed.data;
  const authDriverRaw = (d.NEXT_PUBLIC_AUTH_DRIVER ?? "").trim().toLowerCase();
  return {
    hideIntegrationCallout: d.NEXT_PUBLIC_HIDE_INTEGRATION_CALLOUT === "true",
    featureFlags: {
      insightsBeta: d.NEXT_PUBLIC_FF_INSIGHTS_BETA === "true",
      scheduledBeta: d.NEXT_PUBLIC_FF_SCHEDULED_BETA === "true",
    },
    auth: {
      driver: authDriverRaw === "api" ? "api" : "mock",
      apiBase: (d.NEXT_PUBLIC_AUTH_API_BASE ?? "").trim(),
    },
  };
}

export const publicEnv = loadPublicEnv();
