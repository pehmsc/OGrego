import type { ReactNode } from "react";

import Header from "../ui/components/Header";
import Footer from "../ui/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pt-28 pb-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}
