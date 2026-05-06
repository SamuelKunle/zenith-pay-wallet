import type { NextApiRequest, NextApiResponse } from "next";
import { allowMethods, methodNotAllowed } from "@/server/http/jsonHandler";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(["GET"], req)) {
    methodNotAllowed(res, ["GET"]);
    return;
  }
  res.status(200).json({ ok: true, service: "zenith-pay-api", timestamp: new Date().toISOString() });
}
