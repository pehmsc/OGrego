import Link from "next/link";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function AdminHeader({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur md:px-6 dark:border-slate-800 dark:bg-slate-950/85">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="admin-icon-button lg:hidden"
          aria-label="Abrir navegação do admin"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-50">
            Admin Dashboard
          </h1>
        </div>
      </div>

      <Link
        href="/user/profile"
        className="inline-flex h-10 shrink-0 items-center rounded-full border border-[#1E3A8A]/20 bg-white px-3 text-sm font-medium text-[#1E3A8A] transition-all hover:border-[#1E3A8A]/40 hover:bg-[#F4F7FB] sm:px-4 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        Voltar ao Perfil
      </Link>
    </header>
  );
}
