import type { NextApiRequest, NextApiResponse } from "next";
import { allowMethods, methodNotAllowed } from "@/server/http/jsonHandler";
import { transactionsSnapshotForApi } from "@/server/transfers/transferService";

function parseLimit(raw: unknown): number | undefined {
  if (raw === undefined) return undefined;
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (typeof s !== "string") return undefined;
  const n = Number(s);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.floor(n);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(["GET"], req)) {
    methodNotAllowed(res, ["GET"]);
    return;
  }
  try {
    const limit = parseLimit(req.query.limit);
    res.status(200).json({ transactions: transactionsSnapshotForApi(limit) });
  } catch {
    res.status(500).json({
      error: { code: "internal_error", message: "Unable to list transactions" },
    });
  }
}
