import type { ReactNode } from "react";
import Header from "../ui/components/Header";
import Footer from "../ui/components/Footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main className="mx-auto max-w-7xl px-6 pt-28 pb-20">{children}</main>
      <Footer />
    </div>
  );
}
