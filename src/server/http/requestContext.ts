import type { NextApiRequest } from "next";

/** Correlate API logs with client `fetchJson` headers (prod observability pattern). */
export function readRequestCorrelation(req: NextApiRequest) {
  const requestId = pickHeader(req, "x-request-id");
  const sessionSubject = pickHeader(req, "x-zenith-session");
  const auth = pickHeader(req, "authorization");
  return {
    requestId,
    sessionSubject,
    /** Avoid logging full bearer tokens */
    authScheme: auth?.startsWith("Bearer ") ? "Bearer" : auth ? "other" : undefined,
  };
}

function pickHeader(req: NextApiRequest, name: string): string | undefined {
  const v = req.headers[name];
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v[0]) return v[0];
  return undefined;
}
