import type { NextApiRequest, NextApiResponse } from "next";
import { allowMethods, methodNotAllowed } from "@/server/http/jsonHandler";
import { readRequestCorrelation } from "@/server/http/requestContext";
import { createTransfer } from "@/server/transfers/transferService";
import { logger } from "@/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(["POST"], req)) {
    methodNotAllowed(res, ["POST"]);
    return;
  }

  const ctx = readRequestCorrelation(req);
  logger.info("api.transfers.create", { requestId: ctx.requestId, session: ctx.sessionSubject });

  try {
    const raw = (req.body && typeof req.body === "object" ? req.body : {}) as {
      amountCents?: unknown;
      recipientTag?: unknown;
    };
    const amountCents = Number(raw.amountCents);
    const recipientTag = typeof raw.recipientTag === "string" ? raw.recipientTag : undefined;

    const result = await createTransfer({ amountCents, recipientTag });
    res.status(201).json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    if (msg === "invalid_amount") {
      res.status(400).json({
        error: { code: "invalid_amount", message: "Positive amountCents is required." },
      });
      return;
    }
    if (msg === "insufficient_funds") {
      res.status(409).json({
        error: { code: "insufficient_funds", message: "Available balance is too low for this transfer and fee." },
      });
      return;
    }
    res.status(500).json({
      error: { code: "transfer_failed", message: "Transfer could not be completed." },
    });
  }
}
