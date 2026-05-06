import type { NextApiRequest, NextApiResponse } from "next";

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export function allowMethods(methods: ApiMethod[], req: NextApiRequest): boolean {
  return methods.includes(req.method as ApiMethod);
}

export function methodNotAllowed(res: NextApiResponse, methods: ApiMethod[]) {
  res.setHeader("Allow", methods);
  res.status(405).json({ error: { code: "method_not_allowed", message: "Method Not Allowed" } });
}
