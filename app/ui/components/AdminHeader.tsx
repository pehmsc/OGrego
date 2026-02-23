import Link from "next/link";

export default function AdminHeader() {
    return (
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            <Link
                href="/welcome"
                className="inline-flex h-10 items-center rounded-full border border-[#1E3A8A]/20 bg-white px-4 text-sm font-medium text-[#1E3A8A] transition-all hover:border-[#1E3A8A]/40 hover:bg-[#F4F7FB]"
            >
                Voltar ao Site
            </Link>
        </header>
    );
}
