import type { NextApiRequest, NextApiResponse } from "next";
import { allowMethods, methodNotAllowed } from "@/server/http/jsonHandler";
import { readRequestCorrelation } from "@/server/http/requestContext";
import { logger } from "@/lib/logger";
import type { WalletCardCreateBody } from "@/lib/api/types";
import { cardsSnapshotForApi, issueCard } from "@/server/cards/cardService";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const ctx = readRequestCorrelation(req);

  if (allowMethods(["GET"], req)) {
    logger.info("api.wallet.cards.list", { requestId: ctx.requestId, session: ctx.sessionSubject });
    res.status(200).json({ cards: cardsSnapshotForApi() });
    return;
  }

  if (allowMethods(["POST"], req)) {
    logger.info("api.wallet.cards.create", { requestId: ctx.requestId, session: ctx.sessionSubject });
    try {
      const raw = (req.body && typeof req.body === "object" ? req.body : {}) as Partial<WalletCardCreateBody>;
      const type = raw.type === "virtual" || raw.type === "physical" ? raw.type : null;
      if (!type) {
        res.status(400).json({
          error: { code: "invalid_body", message: 'Body must include type: "virtual" | "physical".' },
        });
        return;
      }
      const card = issueCard(type);
      res.status(201).json({ card });
    } catch {
      res.status(500).json({
        error: { code: "card_issue_failed", message: "Could not issue card." },
      });
    }
    return;
  }

  methodNotAllowed(res, ["GET", "POST"]);
}
