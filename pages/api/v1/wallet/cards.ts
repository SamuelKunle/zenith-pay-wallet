import type { NextApiRequest, NextApiResponse } from "next";
import { allowMethods, methodNotAllowed } from "@/server/http/jsonHandler";
import { readRequestCorrelation } from "@/server/http/requestContext";
import { logger } from "@/lib/logger";
import type { WalletCardCreateBody, WalletCardColor, WalletCardManualDetails } from "@/lib/api/types";
import { cardsSnapshotForApi, createWalletCard } from "@/server/cards/cardService";
import { CardValidationError } from "@/server/cards/cardValidation";

function parseColor(v: unknown): WalletCardColor {
  if (v === "navy" || v === "slate" || v === "emerald") return v;
  return "emerald";
}

function parseManualDetails(raw: unknown): WalletCardManualDetails | null {
  if (raw === null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  return {
    pan: String(o.pan ?? ""),
    expiry: String(o.expiry ?? ""),
    cvv: String(o.cvv ?? ""),
    holderName: String(o.holderName ?? ""),
    brand: o.brand === "Mastercard" ? "Mastercard" : "Visa",
    color: parseColor(o.color),
  };
}

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

      let body: WalletCardCreateBody;
      if (type === "virtual") {
        const details = parseManualDetails(raw.details);
        if (!details) {
          res.status(400).json({
            error: {
              code: "invalid_body",
              message: 'Virtual cards require a "details" object with pan, expiry, cvv, holderName, brand, and color.',
            },
          });
          return;
        }
        body = { type: "virtual", details };
      } else {
        body = {
          type: "physical",
          holderName: typeof raw.holderName === "string" ? raw.holderName : undefined,
        };
      }

      const card = createWalletCard(body);
      res.status(201).json({ card });
    } catch (e) {
      if (e instanceof CardValidationError) {
        res.status(400).json({
          error: { code: "validation_error", message: e.message },
        });
        return;
      }
      res.status(500).json({
        error: { code: "card_issue_failed", message: "Could not add card." },
      });
    }
    return;
  }

  methodNotAllowed(res, ["GET", "POST"]);
}
