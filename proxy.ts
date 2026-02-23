// app/proxy.ts
import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getRoleFromClerkUserMetadata, getRoleFromSessionClaims } from "@/src/lib/roles";

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isAdminRoute(req)) {
    return;
  }

  const authState = await auth();
  if (!authState.userId) {
    return authState.redirectToSignIn({ returnBackUrl: req.url });
  }

  let role = getRoleFromSessionClaims(authState.sessionClaims);

  if (!role) {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(authState.userId);
      role = getRoleFromClerkUserMetadata(clerkUser);
    } catch {
      role = null;
    }
  }

  if (role !== null && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }
});
