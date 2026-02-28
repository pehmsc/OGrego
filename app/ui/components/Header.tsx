"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/app/contexts/CartContext";
import { CartDrawer } from "./user/CartDrawer";

const links = [
  { href: "/welcome", label: "Início" },
  { href: "/promos", label: "Promoções" },
  { href: "/menu", label: "Menu" },
  { href: "/galeria", label: "Galeria" },
  { href: "/contactos", label: "Contactos" },
];

export default function Header() {
  const { totalItems } = useCart();
  const [openCart, setOpenCart] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (!openMenu) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [openMenu]);

  const closeMenu = () => setOpenMenu(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#1E3A8A]/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/welcome" className="flex items-center gap-3">
            <Image
              src="/logodark.svg"
              alt="O Grego"
              width={200}
              height={60}
              className="h-auto w-[148px] sm:w-[200px]"
              priority
            />
          </Link>

          {/* Nav Links */}
          <nav className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-[#1E3A8A]/80 transition-colors hover:text-[#1E3A8A] dark:text-slate-200 dark:hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Botões da direita */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setOpenMenu((current) => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-white/80 transition-all hover:border-[#1E3A8A]/40 hover:bg-[#F4F7FB] md:hidden dark:border-white/10 dark:bg-slate-900/80 dark:hover:bg-slate-800"
              aria-label={openMenu ? "Fechar navegação" : "Abrir navegação"}
              aria-expanded={openMenu}
            >
              {openMenu ? (
                <XMarkIcon className="h-5 w-5 text-[#1E3A8A] dark:text-slate-100" />
              ) : (
                <Bars3Icon className="h-5 w-5 text-[#1E3A8A] dark:text-slate-100" />
              )}
            </button>

            <SignedIn>
              <>
                {/* Carrinho */}
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    setOpenCart(true);
                  }}
                  className="cursor-pointer relative flex h-10 w-10 items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-white/80 transition-all hover:border-[#1E3A8A]/40 hover:bg-[#F4F7FB] hover:-translate-y-[1px] hover:shadow-sm sm:h-12 sm:w-12 dark:border-white/10 dark:bg-slate-900/80 dark:hover:bg-slate-800"
                  aria-label="Abrir carrinho"
                >
                  <Image
                    src="/logoshopping-cart.svg"
                    alt="Carrinho"
                    width={22}
                    height={22}
                    className="dark:brightness-0 dark:invert"
                  />

                  {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Perfil */}
                <Link
                  href="/user/profile"
                  onClick={closeMenu}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-white/80 transition-all hover:border-[#1E3A8A]/40 hover:bg-[#F4F7FB] hover:-translate-y-[1px] hover:shadow-sm sm:h-12 sm:w-12 dark:border-white/10 dark:bg-slate-900/80 dark:hover:bg-slate-800"
                >
                  <Image
                    src="/logouser.svg"
                    alt="Perfil"
                    width={22}
                    height={22}
                    className="dark:brightness-0 dark:invert"
                  />
                </Link>

                {/* Sair */}
                <SignOutButton redirectUrl="/">
                  <button className="hidden cursor-pointer h-10 items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-white px-3 text-sm font-medium text-[#1E3A8A] transition-all hover:border-[#1E3A8A]/40 hover:bg-[#F4F7FB] hover:-translate-y-[1px] hover:shadow-sm md:flex sm:h-12 sm:px-4 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                    Sair
                  </button>
                </SignOutButton>
              </>
            </SignedIn>

            <SignedOut>
              <Link
                href="/entrar"
                onClick={closeMenu}
                className="flex h-10 items-center justify-center rounded-full bg-[#1E3A8A] px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#162F73] hover:-translate-y-[1px] sm:h-12 sm:px-6"
              >
                Entrar
              </Link>
            </SignedOut>
          </div>
        </div>

        {openMenu ? (
          <div className="border-t border-[#1E3A8A]/10 bg-white/95 px-4 py-4 shadow-lg backdrop-blur md:hidden dark:border-white/10 dark:bg-slate-950/95">
            <nav className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-[#1E3A8A] transition-colors hover:border-[#1E3A8A]/10 hover:bg-[#F4F7FB] dark:text-slate-100 dark:hover:border-white/10 dark:hover:bg-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

          </div>
        ) : null}
      </header>

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </>
  );
}
