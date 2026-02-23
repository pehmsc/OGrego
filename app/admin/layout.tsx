import AdminSideNav from "@/app/ui/components/AdminSideNav";
import AdminHeader from "@/app/ui/components/AdminHeader";
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
    <div className="flex min-h-screen bg-gray-50">
      <AdminSideNav />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
