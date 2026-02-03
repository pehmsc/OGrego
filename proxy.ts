import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    // corre para tudo o que não seja _next e ficheiros estáticos
    "/((?!_next|.*\\..*).*)",
    // (opcional mas recomendado) também corre para api routes
    "/(api|trpc)(.*)",
  ],
};

const isProtectedRoute = createRouteMatcher(["/user(.*)", "/admin(.*)"]);

const handler = clerkMiddleware(async (auth, req) => {
  // Só protege o que queremos (user/admin)
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export function proxy(req: NextRequest, event: any) {
  return handler(req, event);
}
