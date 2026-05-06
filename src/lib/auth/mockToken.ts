/** Demo-only token encoding — replace with tokens issued by your IdP. */
export function encodeMockToken(payload: Record<string, unknown>): string {
  try {
    const json = JSON.stringify({ ...payload, iat: Date.now() });
    if (typeof btoa !== "undefined") return `zenith_mock.${btoa(json)}`;
    return `zenith_mock.${json}`;
  } catch {
    return "zenith_mock.invalid";
  }
}
