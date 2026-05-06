import type { NextApiRequest, NextApiResponse } from "next";
import { allowMethods, methodNotAllowed } from "@/server/http/jsonHandler";
import { quoteTransfer } from "@/server/transfers/transferService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(["POST"], req)) {
    methodNotAllowed(res, ["POST"]);
    return;
  }

  try {
    const raw = (req.body && typeof req.body === "object" ? req.body : {}) as { amountCents?: unknown };
    const amountCents = Number(raw.amountCents);
    const quote = await quoteTransfer(amountCents);
    res.status(200).json(quote);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "bad_request";
    if (msg === "invalid_amount") {
      res.status(400).json({
        error: { code: "invalid_amount", message: "Positive amountCents is required." },
      });
      return;
    }
    res.status(500).json({
      error: { code: "quote_failed", message: "Unable to compute transfer quote." },
    });
  }
}
