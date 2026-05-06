export interface TelemetryIdentify {
  userId: string;
  traits?: Record<string, string | number | boolean | undefined>;
}

/** Replace `MockTelemetry` with an adapter that forwards to Segment, PostHog, etc. */
export interface TelemetryClient {
  identify(payload: TelemetryIdentify): void;
  track(event: string, properties?: Record<string, unknown>): void;
  page(name: string, properties?: Record<string, unknown>): void;
  captureException(error: Error, context?: Record<string, unknown>): void;
}
