import { currentUser } from "@clerk/nextjs/server";
import { getAuthenticatedUserContext } from "@/src/lib/auth";

export async function requireAdmin() {
  const authContext = await getAuthenticatedUserContext();

  if (!authContext) {
    return { ok: false as const, reason: "not_signed_in" as const };
  }

  if (authContext.role !== "admin") {
    return {
      ok: false as const,
      reason: "not_admin" as const,
      userId: authContext.clerkUserId,
    };
  }

  const user = await currentUser();
  return { ok: true as const, userId: authContext.clerkUserId, user };
}
