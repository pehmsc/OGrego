import Header from "@/app/ui/components/Header";
import UserHeader from "@/app/ui/components/user/UserHeader";
import UserNav from "@/app/ui/components/user/UserNav";
import { getCurrentUserDb } from "@/app/lib/current-user";

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

    // Buscar dados reais do user
    const userDb = await getCurrentUserDb();

    const name =
        [userDb.first_name, userDb.last_name].filter(Boolean).join(" ") ||
        "Utilizador";

    const user = {
        name,
        email: userDb.email ?? "",
        photo: userDb.image_url ?? "",
        loyalty_points: userDb.points ?? 0,
    };

    return (
        <>
            {/* Header fixo no topo (comum a todo o site) */}
            <Header />

            <div id="user_navegacao" className="min-h-screen bg-[#F4F7FB]">
                {/* Navegação secundária - mt-20 para ficar abaixo do header fixo */}

                {/* Conteúdo da página */}
                <div
                    id="user_header"
                    className="mx-auto max-w-7xl flex-1 px-6 pt-28 pb-10"
                >
                    {/* Header interno com avatar e pontos (comum a todas as páginas user) */}
                    <div className="mb-8">
                        <UserHeader
                            name={user.name}
                            email={user.email}
                            photo={user.photo}
                            loyaltyPoints={user.loyalty_points}
                        />
                        <UserNav />
                    </div>

                    {/* Conteúdo dinâmico de cada página */}
                    {children}
                </div>
            </div>
        </>
    );
}
