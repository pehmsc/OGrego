import Footer from "../ui/components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <div className="flex justify-center pt-10">
        <Link href="/" className="inline-flex items-center">
          <Image
            className="sm:w-[200px]"
            src="/logodark.svg"
            alt="O Grego"
            width={160}
            height={48}
            priority
          />
        </Link>
      </div>
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pt-28 pb-10">
        {children}
      </main>
      <Footer className="mt-auto" />
    </div>
  );
}
