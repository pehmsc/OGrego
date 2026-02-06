// import { redirect } from "next/navigation";
import HeaderUser from "@/app/ui/components/Header";

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
      {/* Conteúdo da página */}
      <div className="mx-auto max-w-7xl flex-1 px-6 pt-28 pb-10">
        {children}
      </div>
    </>
  );
}
