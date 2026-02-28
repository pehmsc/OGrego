import type { ReactNode } from "react";

import Header from "../ui/components/Header";
import Footer from "../ui/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="site-shell flex min-h-screen flex-col bg-[var(--background)]">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-24 pb-8 sm:px-6 sm:pt-28 sm:pb-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}
