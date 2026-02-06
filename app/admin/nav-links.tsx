"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

const links = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Utilizadores",
    href: "/admin/utilizadores",
    icon: UserGroupIcon,
  },
  {
    name: "Pedidos Pendentes",
    href: "/admin/pedidos",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Recibos",
    href: "/admin/recibos",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Gestão de Pedidos",
    href: "/admin/pedidos",
    icon: UserGroupIcon,
  },
  {
    name: "Gestão de Reservas",
    href: "/admin/reservas",
    icon: DocumentDuplicateIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
