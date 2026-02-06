// app/admin/layout.tsx
import React from "react";
import { redirect } from "next/navigation";
import { currentUserApp } from "@/app/lib/current-user";

import AdminSideNav from "@/app/ui/components/AdminSideNav";
import AdminHeader from "@/app/ui/components/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUserApp();

  // role na BD é "admin" | "user"
  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSideNav />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="w-full flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
