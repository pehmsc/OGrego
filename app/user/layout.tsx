// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
import Header from "@/app/ui/components/HeaderUser";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // const session = await getServerSession();

    // Comentado por enquanto - adicionar quando tivermos NextAuth
    // if (!session) {
    //   redirect("/auth/entrar");
    // }

    return (
        <>
            {/* Header fixo no topo */}
            <Header />

            <div className="min-h-screen bg-[#F4F7FB]">
                {/* Navegação secundária - mt-20 para ficar abaixo do header fixo */}
                <div className="mt-20 border-b border-[#1E3A8A]/10 bg-white/80">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex gap-6 text-sm">
                            <a
                                href="/user/perfil"
                                className="font-medium text-[#1E3A8A] transition-colors hover:text-[#162F73]"
                            >
                                📋 Perfil
                            </a>

                            <a
                                href="/user/encomendas"
                                className="text-zinc-600/70 transition-colors hover:text-[#1E3A8A]"
                            >
                                🛍️ Encomendas
                            </a>

                            <a
                                href="/user/carrinho"
                                className="text-zinc-600/70 transition-colors hover:text-[#1E3A8A]"
                            >
                                🛒 Carrinho
                            </a>
                        </nav>
                    </div>
                </div>

                {/* Conteúdo da página */}
                <div className="container mx-auto px-4 py-8">{children}</div>
            </div>
        </>
    );
}
