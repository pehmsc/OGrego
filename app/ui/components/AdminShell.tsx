"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/app/ui/components/AdminHeader";
import AdminSideNav from "@/app/ui/components/AdminSideNav";
import { cn } from "@/lib/utils";

export default function AdminShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isNavOpen, setIsNavOpen] = useState(false);

    useEffect(() => {
        if (!isNavOpen) {
            document.body.style.removeProperty("overflow");
            return;
        }

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.removeProperty("overflow");
        };
    }, [isNavOpen]);

    return (
        <div className="admin-shell min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
            <div className="flex min-h-screen">
                <AdminSideNav className="hidden lg:flex" />

                <div className="flex min-w-0 flex-1 flex-col">
                    <AdminHeader onMenuClick={() => setIsNavOpen(true)} />
                    <div className="flex-1">{children}</div>
                </div>
            </div>

            <div
                className={cn(
                    "fixed inset-0 z-50 lg:hidden",
                    isNavOpen ? "pointer-events-auto" : "pointer-events-none",
                )}
                aria-hidden={!isNavOpen}
            >
                <button
                    type="button"
                    onClick={() => setIsNavOpen(false)}
                    className={cn(
                        "absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity",
                        isNavOpen ? "opacity-100" : "opacity-0",
                    )}
                    aria-label="Fechar navegação do admin"
                />

                <AdminSideNav
                    mobile
                    className={cn(
                        "absolute inset-y-0 left-0 z-10 transition-transform duration-200 ease-out",
                        isNavOpen ? "translate-x-0" : "-translate-x-full",
                    )}
                    onNavigate={() => setIsNavOpen(false)}
                    onClose={() => setIsNavOpen(false)}
                />
            </div>
        </div>
    );
}
