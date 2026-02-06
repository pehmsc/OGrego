"use client";

import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";

const links = [
  { href: "/welcome", label: "Início" },
  { href: "/promos", label: "Promoções" },
  { href: "/menu", label: "Menu" },
  { href: "/contactos", label: "Contactos" },
];

export default function HeaderUser() {
  const cartItemCount = 3; // TODO: vir da BD/estado global

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#1E3A8A]/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/welcome" className="flex items-center gap-3">
          <Image
            src="/logodark.svg"
            alt="O Grego"
            width={200}
            height={60}
            priority
          />
        </Link>

        {/* Nav Links */}
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

        {/* Botões da direita */}
        <div className="flex items-center gap-3">
          <SignedIn>
            <>
              {/* Carrinho */}
              <Link
                href="/user/carrinho"
                className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-white/80 transition-all hover:border-[#1E3A8A]/40 hover:bg-[#F4F7FB] hover:-translate-y-[1px] hover:shadow-sm"
              >
                <Image
                  src="/logoshopping-cart.svg"
                  alt="Carrinho"
                  width={22}
                  height={22}
                />

                {cartItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Perfil */}
              <Link
                href="/user/profile"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-white/80 transition-all hover:border-[#1E3A8A]/40 hover:bg-[#F4F7FB] hover:-translate-y-[1px] hover:shadow-sm"
              >
                <Image
                  src="/logouser.svg"
                  alt="Perfil"
                  width={22}
                  height={22}
                />
              </Link>

              {/* Sair */}
              <SignOutButton redirectUrl="/">
                <Link
                  href="/"
                  className="flex h-12 items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-white px-4 text-sm font-medium text-[#1E3A8A] transition-all hover:bg-[#F4F7FB] hover:border-[#1E3A8A]/40 hover:-translate-y-[1px] hover:shadow-sm"
                >
                  Sair
                </Link>
              </SignOutButton>
            </>
          </SignedIn>

          <SignedOut>
            <Link
              href="/entrar"
              className="flex h-12 items-center justify-center rounded-full bg-[#1E3A8A] px-6 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#162F73] hover:-translate-y-[1px]"
            >
              Entrar
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
