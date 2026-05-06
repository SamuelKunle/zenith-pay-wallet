import { publicEnv } from "@/lib/env/publicEnv";

/**
 * Shows the lightweight “integration readiness” strip on dashboard and tooling pages.
 * Set NEXT_PUBLIC_HIDE_INTEGRATION_CALLOUT=true to hide it (for example fully white-labeled deployments).
 */
export function showIntegrationCallout(): boolean {
  return !publicEnv.hideIntegrationCallout;
}
