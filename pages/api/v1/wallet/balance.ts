import type { NextApiRequest, NextApiResponse } from "next";
import { allowMethods, methodNotAllowed } from "@/server/http/jsonHandler";
import { walletSnapshotForApi } from "@/server/transfers/transferService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethods(["GET"], req)) {
    methodNotAllowed(res, ["GET"]);
    return;
  }
  try {
    res.status(200).json(walletSnapshotForApi());
  } catch {
    res.status(500).json({
      error: { code: "internal_error", message: "Unable to read wallet snapshot" },
    });
  }
}
