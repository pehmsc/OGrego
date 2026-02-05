"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export function HomeHeroAuthCta() {
  return (
    <>
      <SignedOut>
        <Link
          href="/entrar"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#F4F7FB] px-5 text-[#1E3A8A] border border-[#1E3A8A]/20 shadow-sm transition-all duration-200 ease-out hover:bg-white hover:border-[#1E3A8A]/40 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]/30 focus-visible:ring-offset-2 sm:w-[190px]
            dark:bg-[#F4F7FB] dark:text-[#1E3A8A] dark:border-white/20 dark:hover:border-white/35 dark:focus-visible:ring-white/30"
        >
          Entrar / Criar conta
        </Link>
      </SignedOut>

      <SignedIn>
        <Link
          href="/user/profile"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#F4F7FB] px-5 text-[#1E3A8A] border border-[#1E3A8A]/20 shadow-sm transition-all duration-200 ease-out hover:bg-white hover:border-[#1E3A8A]/40 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]/30 focus-visible:ring-offset-2 sm:w-[190px]
            dark:bg-[#F4F7FB] dark:text-[#1E3A8A] dark:border-white/20 dark:hover:border-white/35 dark:focus-visible:ring-white/30"
        >
          Ir para o perfil
        </Link>
      </SignedIn>
    </>
  );
}
