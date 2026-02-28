"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    { href: "/user/profile", label: "Perfil" },
    { href: "/user/encomendas", label: "Histórico de Encomendas" },
    { href: "/user/feedback", label: "Feedback" },
];

export default function UserNav() {
    const pathname = usePathname();

    return (
        <div className="mt-2 overflow-x-auto rounded-2xl border border-[#1E3A8A]/10 bg-white/80 px-2 shadow-sm dark:border-white/10 dark:bg-slate-950/70 sm:px-4">
            <nav className="flex min-w-max gap-1">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors sm:px-6 ${
                                isActive
                                    ? "border-b-2 border-[#1E3A8A] text-[#1E3A8A] dark:border-slate-200 dark:text-slate-50"
                                    : "text-zinc-600/70 hover:text-[#1E3A8A] dark:text-slate-300 dark:hover:text-white"
                            }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
