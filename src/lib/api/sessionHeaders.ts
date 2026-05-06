/**
 * Lets `fetchJson` attach auth / session headers without importing React hooks.
 * Registered once from `AuthProvider`.
 */

let getHeaders: () => Record<string, string> = () => ({});

export function registerApiSessionHeaders(provider: () => Record<string, string>) {
  getHeaders = provider;
}

export function getRegisteredHeaders(): Record<string, string> {
  try {
    return getHeaders();
  } catch {
    return {};
  }
}
