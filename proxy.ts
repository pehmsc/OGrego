import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};

const handler = clerkMiddleware();

export function proxy(req: NextRequest, event: any) {
  return handler(req, event);
}
