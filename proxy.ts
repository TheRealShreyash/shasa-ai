import type { NextRequest } from "next/server";
import { handleAuthProxy } from "./features/auth/utils/auth-proxy";

export async function proxy(req: NextRequest) {
  return handleAuthProxy(req);
}

export const config = {
  matcher: ["/signin", "/dashboard", "/dashboard/:path"],
};
