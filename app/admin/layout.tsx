import AdminSideNav from "@/app/ui/components/AdminSideNav";
import AdminHeader from "@/app/ui/components/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
