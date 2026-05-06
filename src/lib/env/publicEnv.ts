import { z } from "zod";
import { logger } from "@/lib/logger";

/**
 * Browser-safe configuration (NEXT_PUBLIC_*). Values are inlined at build time.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_HIDE_INTEGRATION_CALLOUT: z.string().optional(),
  NEXT_PUBLIC_FF_INSIGHTS_BETA: z.string().optional(),
  NEXT_PUBLIC_FF_SCHEDULED_BETA: z.string().optional(),
});

export type PublicEnv = {
  hideIntegrationCallout: boolean;
  featureFlags: {
    insightsBeta: boolean;
    scheduledBeta: boolean;
  };
};

function loadPublicEnv(): PublicEnv {
  const raw = {
    NEXT_PUBLIC_HIDE_INTEGRATION_CALLOUT: process.env.NEXT_PUBLIC_HIDE_INTEGRATION_CALLOUT,
    NEXT_PUBLIC_FF_INSIGHTS_BETA: process.env.NEXT_PUBLIC_FF_INSIGHTS_BETA,
    NEXT_PUBLIC_FF_SCHEDULED_BETA: process.env.NEXT_PUBLIC_FF_SCHEDULED_BETA,
  };
  const parsed = publicEnvSchema.safeParse(raw);
  if (!parsed.success) {
    logger.warn("Invalid public env; using defaults", { issues: parsed.error.flatten() });
    return {
      hideIntegrationCallout: false,
      featureFlags: { insightsBeta: false, scheduledBeta: false },
    };
  }
  const d = parsed.data;
  return {
    hideIntegrationCallout: d.NEXT_PUBLIC_HIDE_INTEGRATION_CALLOUT === "true",
    featureFlags: {
      insightsBeta: d.NEXT_PUBLIC_FF_INSIGHTS_BETA === "true",
      scheduledBeta: d.NEXT_PUBLIC_FF_SCHEDULED_BETA === "true",
    },
  };
}

export const publicEnv = loadPublicEnv();
