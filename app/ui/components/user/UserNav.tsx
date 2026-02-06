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
        <div className="mt-20 border-b border-[#1E3A8A]/10 bg-white/80">
            <div className="container mx-auto px-4">
                <nav className="flex gap-3">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-6 py-3 text-sm font-medium transition-colors ${
                                    isActive
                                        ? "border-b-2 border-[#1E3A8A] text-[#1E3A8A]"
                                        : "text-zinc-600/70 hover:text-[#1E3A8A]"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
