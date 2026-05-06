import { logger } from "@/lib/logger";
import type { TelemetryClient, TelemetryIdentify } from "./types";
import { TelemetryEvents } from "./events";

type Buffered = { event: string; properties?: Record<string, unknown>; ts: number };

/**
 * In-memory + logger implementation. Swap for a real `TelemetryClient` without changing call sites.
 * Buffer supports future debug UI / export.
 */
export class MockTelemetry implements TelemetryClient {
  private buffer: Buffered[] = [];
  private readonly maxBuffer = 200;

  identify(payload: TelemetryIdentify): void {
    logger.debug("telemetry.identify", { userId: payload.userId, traits: payload.traits });
    this.push("identify", { userId: payload.userId, ...payload.traits });
  }

  track(event: string, properties?: Record<string, unknown>): void {
    logger.debug(`telemetry.${event}`, properties);
    this.push(event, properties);
  }

  page(name: string, properties?: Record<string, unknown>): void {
    this.track(TelemetryEvents.SCREEN_VIEW, { screen: name, ...properties });
  }

  captureException(error: Error, context?: Record<string, unknown>): void {
    logger.error("telemetry.captureException", { message: error.message, ...context });
    this.push(TelemetryEvents.EXCEPTION, {
      message: error.message,
      name: error.name,
      ...context,
    });
  }

  /** Last events — useful for tests or a future dev overlay. */
  snapshot(): Buffered[] {
    return [...this.buffer];
  }

  clear(): void {
    this.buffer = [];
  }

  private push(event: string, properties?: Record<string, unknown>) {
    this.buffer.push({ event, properties, ts: Date.now() });
    if (this.buffer.length > this.maxBuffer) {
      this.buffer.splice(0, this.buffer.length - this.maxBuffer);
    }
  }
}
