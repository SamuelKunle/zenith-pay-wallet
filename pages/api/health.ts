import type { NextApiRequest, NextApiResponse } from "next";
import { allowMethods, methodNotAllowed } from "@/server/http/jsonHandler";
import { getServerEnv } from "@/lib/env/serverEnv";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(["GET"], req)) {
    methodNotAllowed(res, ["GET"]);
    return;
  }
  const env = getServerEnv();
  res.status(200).json({
    ok: true,
    service: "zenith-pay-api",
    nodeEnv: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
