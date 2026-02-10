import { redirect } from "next/navigation";
import { getCurrentUserDb } from "@/app/lib/current-user";
import { AFTER_AUTH_REDIRECT, ADMIN_DASHBOARD } from "@/lib/route";

export default async function AfterAuthPage() {
  const user = await getCurrentUserDb();
  redirect(user.role === "admin" ? ADMIN_DASHBOARD : AFTER_AUTH_REDIRECT);
}
