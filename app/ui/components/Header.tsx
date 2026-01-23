import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/welcome", label: "Início" },
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/galeria", label: "Galeria" },
  { href: "/menu", label: "Menu" },
  { href: "/contactos", label: "Contactos" },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#1E3A8A]/10 bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/welcome" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="O Grego"
            width={200}
            height={60}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[#1E3A8A]/80 transition-colors hover:text-[#1E3A8A]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contactos"
          className="hidden h-10 items-center justify-center rounded-full bg-[#1E3A8A] px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#162F73] hover:-translate-y-[1px] md:flex"
        >
          Reservar
        </Link>
      </div>
    </header>
  );
}
