"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavLinks from "@/app/admin/dashboard/nav-links";
import Image from "next/image";

export default function AdminSideNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white p-4">
      <Image
        className="gap-2"
        src="/logodark.svg"
        alt="O Grego"
        width={200}
        height={60}
        priority
      />
      <NavLinks />
    </aside>
  );
}
