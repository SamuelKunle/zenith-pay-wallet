import { z } from "zod";
import { logger } from "@/lib/logger";

/**
 * Node-only env for API routes and server utilities. Import only from `pages/api` or `src/server`.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverEnvSchema.safeParse({ NODE_ENV: process.env.NODE_ENV });
  if (!parsed.success) {
    logger.warn("Invalid server env NODE_ENV; defaulting", { issues: parsed.error.flatten() });
    cached = { NODE_ENV: "development" };
    return cached;
  }
  cached = parsed.data;
  return cached;
}
