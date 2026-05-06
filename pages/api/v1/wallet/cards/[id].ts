import type { NextApiRequest, NextApiResponse } from "next";
import { allowMethods, methodNotAllowed } from "@/server/http/jsonHandler";
import { readRequestCorrelation } from "@/server/http/requestContext";
import { logger } from "@/lib/logger";
import type { WalletCardPatchBody } from "@/lib/api/types";
import { setFrozen } from "@/server/cards/cardService";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const idParam = req.query.id;
  const id = typeof idParam === "string" ? idParam : Array.isArray(idParam) ? idParam[0] : "";
  if (!id) {
    res.status(400).json({ error: { code: "missing_id", message: "Card id is required." } });
    return;
  }

  const ctx = readRequestCorrelation(req);

  if (!allowMethods(["PATCH"], req)) {
    methodNotAllowed(res, ["PATCH"]);
    return;
  }

  logger.info("api.wallet.cards.patch", {
    requestId: ctx.requestId,
    session: ctx.sessionSubject,
    cardId: id,
  });

  try {
    const raw = (req.body && typeof req.body === "object" ? req.body : {}) as Partial<WalletCardPatchBody>;
    if (typeof raw.frozen !== "boolean") {
      res.status(400).json({
        error: { code: "invalid_body", message: "Body must include frozen: boolean." },
      });
      return;
    }

    const updated = setFrozen(id, raw.frozen);
    if (!updated) {
      res.status(404).json({
        error: { code: "card_not_found", message: "No card with that id." },
      });
      return;
    }

    res.status(200).json({ card: updated });
  } catch {
    res.status(500).json({
      error: { code: "card_update_failed", message: "Could not update card." },
    });
  }
}
