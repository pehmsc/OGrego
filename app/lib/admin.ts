import { auth, clerkClient } from "@clerk/nextjs/server";

const ADMIN_EMAILS = new Set(
  ["pehmsc@gmail.com", "joanamcbarata@gmail.com", "damartins89@gmail.com"].map(
    (e) => e.toLowerCase(),
  ),
);

export async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
    return { ok: false as const, reason: "not_signed_in" as const };
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const emails = user.emailAddresses.map((e) => e.emailAddress.toLowerCase());
  const isAdmin = emails.some((e) => ADMIN_EMAILS.has(e));

  if (!isAdmin) {
    return { ok: false as const, reason: "not_admin" as const, userId };
  }

  return { ok: true as const, userId, user, emails };
}
