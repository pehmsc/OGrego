// app/admin/layout.tsx
import React from "react";
import { redirect } from "next/navigation";
import { currentUserApp } from "@/app/lib/current-user";

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
        <div className="flex min-h-screen">
            <aside className="w-64 border-r border-gray-200 bg-gray-50 p-4">
                {/* sidebar */}
                <h2 className="mb-4 text-lg font-semibold">Admin</h2>
                <nav className="space-y-2 text-sm">
                    <a href="/admin" className="block hover:underline">
                        Visão geral
                    </a>
                    <a href="/admin/users" className="block hover:underline">
                        Utilizadores
                    </a>
                    <a href="/admin/orders" className="block hover:underline">
                        Pedidos
                    </a>
                    <a
                        href="/admin/reservations"
                        className="block hover:underline"
                    >
                        Reservas
                    </a>
                    <a href="/admin/recibos" className="block hover:underline">
                        Recibos
                    </a>
                </nav>
            </aside>

            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
