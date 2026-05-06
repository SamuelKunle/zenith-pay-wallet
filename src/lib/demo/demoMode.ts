/**
 * Frontend-only demo gate. Production builds would set NEXT_PUBLIC_DEMO_MODE=false.
 */
export function isDemoMode(): boolean {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_DEMO_MODE === "false") {
    return false;
  }
  return true;
}
