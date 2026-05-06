import { STORAGE_KEYS } from "@/lib/constants/app";
import { encodeMockToken } from "./mockToken";
import type { SessionState } from "./types";

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function readAnonId(): string {
  try {
    const key = STORAGE_KEYS.anonymousId;
    let id = localStorage.getItem(key);
    if (!id) {
      id = randomId();
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `anon_${randomId()}`;
  }
}

export function guestSession(): SessionState {
  const anon = readAnonId();
  return {
    status: "guest",
    subject: `guest:${anon}`,
    accessToken: encodeMockToken({ sub: `guest:${anon}`, typ: "guest" }),
  };
}
