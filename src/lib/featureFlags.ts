import { publicEnv } from "@/lib/env/publicEnv";

/**
 * Feature toggles — backed by `NEXT_PUBLIC_FF_*` env vars (see `publicEnv`).
 * Use for gradual rollout; flags are typed for autocomplete.
 */
export function isFeatureEnabled(flag: keyof typeof publicEnv.featureFlags): boolean {
  return !!publicEnv.featureFlags[flag];
}
