import type { ApiErrorBody } from "./types";
import { getRegisteredHeaders } from "./sessionHeaders";
import { getTelemetry } from "@/lib/telemetry";
import { TelemetryEvents } from "@/lib/telemetry/events";

export class ApiRequestError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.body = body;
  }
}

function mergeHeaders(init?: RequestInit): Headers {
  const requestId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `req_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const merged = new Headers();
  merged.set("Content-Type", "application/json");
  merged.set("X-Request-Id", requestId);

  const registered = getRegisteredHeaders();
  Object.entries(registered).forEach(([k, v]) => merged.set(k, v));

  if (init?.headers) {
    new Headers(init.headers).forEach((value, key) => merged.set(key, value));
  }

  return merged;
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = mergeHeaders(init);
  const requestId = headers.get("X-Request-Id") ?? "";

  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers,
    });
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    getTelemetry().captureException(err, { path, phase: "network", requestId });
    getTelemetry().track(TelemetryEvents.NETWORK_ERROR, { path, requestId });
    throw err;
  }

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    const msg =
      data && typeof data === "object" && data !== null && "error" in data
        ? String((data as ApiErrorBody).error?.message || res.statusText)
        : res.statusText;
    getTelemetry().track(TelemetryEvents.API_ERROR_RESPONSE, {
      path,
      status: res.status,
      requestId,
    });
    throw new ApiRequestError(msg, res.status, data);
  }

  return data as T;
}

export function postJson<T>(
  path: string,
  body: unknown,
  init?: Omit<RequestInit, "method" | "body">,
): Promise<T> {
  return fetchJson<T>(path, {
    ...init,
    method: "POST",
    body: JSON.stringify(body),
  });
}
