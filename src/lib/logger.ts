/**
 * Central logging — use instead of raw `console.*` so we can tune verbosity,
 * redact fields later, or plug in telemetry without touching every call site.
 */

type LogMeta = Record<string, unknown> | undefined;

const PREFIX = "[zenith-pay]";
const isDev = process.env.NODE_ENV === "development";

function emit(level: "log" | "info" | "warn" | "error" | "debug", message: string, meta?: LogMeta) {
  if (level === "debug" && !isDev) return;
  const fn = console[level] ?? console.log;
  if (meta && Object.keys(meta).length > 0) {
    fn(PREFIX, message, meta);
  } else {
    fn(PREFIX, message);
  }
}

export const logger = {
  debug: (message: string, meta?: LogMeta) => emit("debug", message, meta),
  info: (message: string, meta?: LogMeta) => emit("info", message, meta),
  warn: (message: string, meta?: LogMeta) => emit("warn", message, meta),
  error: (message: string, meta?: LogMeta) => emit("error", message, meta),
};
