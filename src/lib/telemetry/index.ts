import type { TelemetryClient } from "./types";
import { MockTelemetry } from "./mockTelemetry";

export type { TelemetryClient, TelemetryIdentify } from "./types";
export { TelemetryEvents } from "./events";
export { MockTelemetry } from "./mockTelemetry";

let instance: TelemetryClient | null = null;

/** Singleton entry — inject a different implementation at bootstrap when you add a vendor. */
export function getTelemetry(): TelemetryClient {
  if (!instance) instance = new MockTelemetry();
  return instance;
}

/** Advanced: call before first `getTelemetry()` to plug in a real backend. */
export function setTelemetryClient(client: TelemetryClient) {
  instance = client;
}

/** Vitest */
export function resetTelemetryForTests() {
  instance = null;
}
