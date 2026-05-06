import type { ApiErrorBody } from "./types";

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

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    const msg =
      data && typeof data === "object" && data !== null && "error" in data
        ? String((data as ApiErrorBody).error?.message || res.statusText)
        : res.statusText;
    throw new ApiRequestError(msg, res.status, data);
  }

  return data as T;
}

export function postJson<T>(path: string, body: unknown, init?: Omit<RequestInit, "method" | "body">): Promise<T> {
  return fetchJson<T>(path, {
    ...init,
    method: "POST",
    body: JSON.stringify(body),
  });
}
