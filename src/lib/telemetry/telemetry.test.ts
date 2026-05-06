import { describe, expect, it, beforeEach } from "vitest";
import { MockTelemetry } from "./mockTelemetry";
import { resetTelemetryForTests, getTelemetry, setTelemetryClient } from "./index";

describe("MockTelemetry", () => {
  beforeEach(() => {
    resetTelemetryForTests();
  });

  it("buffers track events", () => {
    const m = new MockTelemetry();
    m.track("test_event", { a: 1 });
    const snap = m.snapshot();
    expect(snap.length).toBe(1);
    expect(snap[0]?.event).toBe("test_event");
  });

  it("getTelemetry returns singleton", () => {
    const a = getTelemetry();
    const b = getTelemetry();
    expect(a).toBe(b);
  });

  it("setTelemetryClient swaps implementation", () => {
    const custom = new MockTelemetry();
    setTelemetryClient(custom);
    getTelemetry().track("x");
    expect(custom.snapshot().some((e) => e.event === "x")).toBe(true);
    resetTelemetryForTests();
  });
});
