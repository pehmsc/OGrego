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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#1E3A8A]/10 bg-[var(--background)]/80 backdrop-blur dark:border-white/10">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/welcome" className="flex items-center gap-3">
          <Image
            className="text-[var(--foreground)]"
            src="/logodark.svg"
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
              className="text-sm font-medium text-[#1E3A8A]/80 transition-colors hover:text-[#1E3A8A] text-[var(--foreground)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/entrar"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#1E3A8A] px-5 text-white border border-[#1E3A8A]/20 shadow-sm transition-all duration-200 ease-out hover:bg-white hover:text-[#1E3A8A] hover:border-[#1E3A8A]/40 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]/30 focus-visible:ring-offset-2 sm:w-[190px]
                  dark:bg-[#F4F7FB] dark:text-[#1e3a8a] dark:border-white/20 dark:hover:border-white/35 dark:focus-visible:ring-white/30"
        >
          Entrar / Criar conta
        </Link>
      </div>
    </header>
  );
}
