"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavLinks from "@/app/admin/dashboard/nav-links";

const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/pedidos", label: "Pedidos Pendentes" },
    { href: "/admin/recibos", label: "Recibos" },
    { href: "/admin/utilizadores", label: "Utilizadores" },
];

export default function AdminSideNav() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r bg-white p-4">
            <NavLinks />
            <h2 className="mb-6 text-xl font-bold text-[#1E3A8A]">
                Admin · O Grego
            </h2>

            <nav className="space-y-2">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`block rounded-lg px-3 py-2 text-sm font-medium
              ${
                  pathname === link.href
                      ? "bg-[#1E3A8A] text-white"
                      : "text-gray-700 hover:bg-gray-100"
              }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
