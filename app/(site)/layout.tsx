import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";

import Header from "../ui/components/Header";
import HeaderUser from "@/app/ui/components/HeaderUser";
import Footer from "../ui/components/Footer";
import { getCurrentUserDb } from "@/app/lib/current-user";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();

  // Não autenticado -> Header público
  if (!userId) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--background)]">
        <Header />
        <main className="mx-auto max-w-7xl flex-1 px-6 pt-28 pb-10">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  // Autenticado -> role vem da BD
  const dbUser = await getCurrentUserDb();

  const showUserHeader = dbUser.role === "user"; // admin -> não mostra

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      {showUserHeader ? <HeaderUser /> : null}

      <main className="mx-auto max-w-7xl flex-1 px-6 pt-28 pb-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}
