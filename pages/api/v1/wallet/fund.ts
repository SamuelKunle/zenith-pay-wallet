import type { NextApiRequest, NextApiResponse } from "next";
import { allowMethods, methodNotAllowed } from "@/server/http/jsonHandler";
import { simulatedFund, type SimulatedFundingChannel } from "@/server/wallet/fundService";

function parseChannel(raw: unknown): SimulatedFundingChannel | null {
  const s = typeof raw === "string" ? raw : "";
  if (s === "ach" || s === "debit" || s === "payroll") return s;
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(["POST"], req)) {
    methodNotAllowed(res, ["POST"]);
    return;
  }

  if (process.env.ZENITH_DISABLE_SIMULATED_FUNDING === "true") {
    res.status(403).json({
      error: {
        code: "simulated_funding_disabled",
        message: "Simulated funding is disabled (ZENITH_DISABLE_SIMULATED_FUNDING=true — see .env.example).",
      },
    });
    return;
  }

  try {
    const raw = (req.body && typeof req.body === "object" ? req.body : {}) as {
      amountCents?: unknown;
      channel?: unknown;
    };
    const amountCents = Number(raw.amountCents);
    const channel = parseChannel(raw.channel);

    if (!channel) {
      res.status(400).json({
        error: {
          code: "invalid_channel",
          message: "channel must be one of: ach, debit, payroll",
        },
      });
      return;
    }

    const result = simulatedFund({ amountCents, channel });
    res.status(201).json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    if (msg === "invalid_amount") {
      res.status(400).json({
        error: { code: "invalid_amount", message: "Positive amountCents is required." },
      });
      return;
    }
    if (msg === "limit_exceeded") {
      res.status(400).json({
        error: {
          code: "limit_exceeded",
          message: "Simulated funding exceeds the per-request prototype cap.",
        },
      });
      return;
    }
    res.status(500).json({
      error: { code: "fund_failed", message: "Funding could not be recorded." },
    });
  }
}
