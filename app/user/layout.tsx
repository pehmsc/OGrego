// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
import HeaderUser from "@/app/ui/components/HeaderUser";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await getServerSession();

  // Comentado por enquanto - adicionar quando tivermos NextAuth
  // if (!session) {
  //   redirect("/(auth)/entrar");
  // }

  return (
    <>
      {/* Header fixo no topo */}
      <HeaderUser />

      <div className="min-h-screen bg-[#F4F7FB]">
        {/* Navegação secundária - mt-20 para ficar abaixo do header fixo */}
        <div className="mt-20 border-b border-[#1E3A8A]/10 bg-white/80"></div>

        {/* Conteúdo da página */}
        <div className="container mx-auto px-4 py-8">{children}</div>
      </div>
    </>
  );
}
