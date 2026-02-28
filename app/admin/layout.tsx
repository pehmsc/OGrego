import AdminShell from "@/app/ui/components/AdminShell";
import { requireAdmin } from "@/app/lib/admin";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    redirect("/");
  }

  return (
    <AdminShell>{children}</AdminShell>
  );
}
