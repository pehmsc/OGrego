"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  UserGroupIcon,
  DocumentDuplicateIcon,
  CurrencyEuroIcon,
  PresentationChartBarIcon,
  UsersIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

const links = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: PresentationChartBarIcon,
  },
  {
    name: "Utilizadores",
    href: "/admin/users",
    icon: UsersIcon,
  },
  {
    name: "Recibos",
    href: "/admin/receipts",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Gestão de Pedidos",
    href: "/admin/orders",
    icon: PencilSquareIcon,
  },
  {
    name: "Gestão de Reservas",
    href: "/admin/reservations",
    icon: UserGroupIcon,
  },
  {
    name: "Gestão de Vendas",
    href: "/admin/sales",
    icon: CurrencyEuroIcon,
  },
];

export default function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive =
          pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={onNavigate}
            className={clsx(
              "flex min-h-12 items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-100 hover:text-blue-600 dark:text-slate-200",
              {
                "bg-sky-100 text-blue-600": isActive,
              },
            )}
          >
            <LinkIcon className="h-5 w-5 shrink-0" />
            <span className="truncate">{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
