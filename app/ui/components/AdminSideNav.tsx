"use client";

import NavLinks from "@/app/admin/nav-links";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

type AdminSideNavProps = {
    className?: string;
    mobile?: boolean;
    onNavigate?: () => void;
    onClose?: () => void;
};

export default function AdminSideNav({
    className,
    mobile = false,
    onNavigate,
    onClose,
}: AdminSideNavProps) {
    return (
        <aside
            className={cn(
                "flex h-full flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95",
                mobile
                    ? "w-[min(86vw,18rem)] p-4 shadow-2xl"
                    : "sticky top-0 h-screen w-72 shrink-0 px-5 py-6",
                className,
            )}
        >
            <div className="mb-6 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <Image
                        className="h-auto w-[156px] sm:w-[180px]"
                        src="/logodark.svg"
                        alt="O Grego"
                        width={200}
                        height={60}
                        priority
                    />
                    <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                        Admin mode
                    </p>
                </div>

                {mobile ? (
                    <button
                        type="button"
                        onClick={onClose}
                        className="admin-icon-button shrink-0"
                        aria-label="Fechar navegação"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                ) : null}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
                <NavLinks onNavigate={onNavigate} />
            </div>
        </aside>
    );
}
