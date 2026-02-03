// import { getServerSession } from "next-auth";
import Image from "next/image";

export default async function ProfilePage() {
    // const session = await getServerSession();

    // Mock data - por enquanto hardcoded
    const user = {
        name: "João Silva", // session?.user?.name || "Utilizador",
        email: "joao@example.com", // session?.user?.email || "",
        photo: "", // session?.user?.image || "",
        phone: "+351 912 345 678",
        nif: "123456789",
        address: "Rua Exemplo, 123, 1200-000 Lisboa",
        favorite_restaurant: "O Grego Lisboa",
        loyalty_points: 45,
    };

    return (
        <section className="grid gap-8">
            {/* Header do Perfil */}
            <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-8 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                    {/* Avatar */}
                    <div className="relative h-24 w-24 shrink-0">
                        {user.photo ? (
                            <Image
                                src={user.photo}
                                alt={user.name}
                                fill
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1E3A8A] text-3xl font-bold text-white">
                                {user.name[0]}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-semibold tracking-tight text-[#1E3A8A] sm:text-4xl">
                            {user.name}
                        </h1>
                        <p className="mt-1 text-lg text-zinc-600/90">
                            {user.email}
                        </p>

                        {/* Badge de Fidelização */}
                        <div className="mt-3 flex items-center gap-3">
                            <span className="flex h-8 items-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 text-sm font-medium text-white shadow-sm">
                                Ouro
                            </span>
                            <span className="text-sm font-medium text-zinc-600">
                                {user.loyalty_points} pontos
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 border-b border-[#1E3A8A]/10">
                <button className="border-b-2 border-[#1E3A8A] px-6 py-3 text-sm font-medium text-[#1E3A8A]">
                    Perfil
                </button>
                <button className="px-6 py-3 text-sm font-medium text-zinc-600/70 transition-colors hover:text-[#1E3A8A]">
                    Encomendas
                </button>
                <button className="px-6 py-3 text-sm font-medium text-zinc-600/70 transition-colors hover:text-[#1E3A8A]">
                    Feedback
                </button>
            </div>

            {/* Grid: Formulário + Card Fidelização */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Formulário de Perfil */}
                <div className="lg:col-span-2">
                    <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-8 shadow-sm">
                        <h2 className="mb-6 text-2xl font-semibold text-[#1E3A8A]">
                            Informações Pessoais
                        </h2>

                        <form className="grid gap-6">
                            {/* Fotografia */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#1E3A8A]">
                                    Fotografia de Perfil
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="block w-full text-sm text-zinc-600
                    file:mr-4 file:rounded-full file:border-0
                    file:bg-[#1E3A8A] file:px-4 file:py-2
                    file:text-sm file:font-medium file:text-white
                    file:transition-all hover:file:bg-[#162F73]"
                                />
                            </div>

                            {/* Nome */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#1E3A8A]">
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    defaultValue={user.name}
                                    className="w-full rounded-full border border-[#1E3A8A]/20 bg-white/80 px-6 py-3 text-sm transition-all focus:border-[#1E3A8A]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                                />
                            </div>

                            {/* Email (read-only) */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#1E3A8A]">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full rounded-full border border-[#1E3A8A]/10 bg-[#F4F7FB] px-6 py-3 text-sm text-zinc-600/70"
                                />
                                <p className="mt-1 text-xs text-zinc-600/70">
                                    O email não pode ser alterado
                                </p>
                            </div>

                            {/* Telefone */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#1E3A8A]">
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    defaultValue={user.phone}
                                    placeholder="+351 912 345 678"
                                    className="w-full rounded-full border border-[#1E3A8A]/20 bg-white/80 px-6 py-3 text-sm transition-all focus:border-[#1E3A8A]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                                />
                            </div>

                            {/* NIF */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#1E3A8A]">
                                    NIF
                                </label>
                                <input
                                    type="text"
                                    defaultValue={user.nif}
                                    placeholder="123456789"
                                    maxLength={9}
                                    className="w-full rounded-full border border-[#1E3A8A]/20 bg-white/80 px-6 py-3 text-sm transition-all focus:border-[#1E3A8A]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                                />
                            </div>

                            {/* Morada */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#1E3A8A]">
                                    Morada
                                </label>
                                <input
                                    type="text"
                                    defaultValue={user.address}
                                    placeholder="Rua Exemplo, 123, 1200-000 Lisboa"
                                    className="w-full rounded-full border border-[#1E3A8A]/20 bg-white/80 px-6 py-3 text-sm transition-all focus:border-[#1E3A8A]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                                />
                            </div>

                            {/* Restaurante Favorito */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#1E3A8A]">
                                    Restaurante Favorito
                                </label>
                                <select
                                    defaultValue={user.favorite_restaurant}
                                    className="w-full rounded-full border border-[#1E3A8A]/20 bg-white/80 px-6 py-3 text-sm transition-all focus:border-[#1E3A8A]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="O Grego Lisboa">
                                        O Grego Lisboa
                                    </option>
                                    <option value="O Grego Porto">
                                        O Grego Porto
                                    </option>
                                    <option value="O Grego Faro">
                                        O Grego Faro
                                    </option>
                                </select>
                            </div>

                            {/* Botão Guardar */}
                            <button
                                type="submit"
                                className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-[#1E3A8A] text-sm font-medium text-white shadow-xl transition-all hover:-translate-y-[1px] hover:bg-[#162F73]"
                            >
                                Guardar Alterações
                            </button>
                        </form>
                    </div>
                </div>

                {/* Card de Fidelização */}
                <div className="lg:col-span-1">
                    <div className="rounded-3xl border border-[#1E3A8A]/10 bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 text-white shadow-sm">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h3 className="text-2xl font-semibold">
                                    Fidelização
                                </h3>
                                <p className="mt-1 text-sm text-yellow-100">
                                    1€ gasto = 1 ponto
                                </p>
                            </div>
                            <div className="text-4xl"></div>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm font-medium text-yellow-100">
                                Saldo Atual
                            </p>
                            <p className="text-4xl font-bold">
                                {user.loyalty_points}
                            </p>
                            <p className="text-sm text-yellow-100">pontos</p>
                        </div>

                        {/* Barra de Progresso */}
                        <div>
                            <div className="mb-2 flex justify-between text-xs font-medium">
                                <span>Nível: Ouro</span>
                                <span>
                                    {50 - user.loyalty_points} pts até Platina
                                </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-yellow-300/50">
                                <div
                                    className="h-full rounded-full bg-white transition-all"
                                    style={{
                                        width: `${(user.loyalty_points / 50) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Benefícios */}
                        <div className="mt-6 space-y-2 border-t border-yellow-500/30 pt-6">
                            <p className="text-xs font-semibold uppercase tracking-wide text-yellow-100">
                                Benefícios Ouro
                            </p>
                            <ul className="space-y-1 text-sm">
                                <li className="flex items-center gap-2">
                                    <span>✓</span>
                                    <span>10% desconto</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span>✓</span>
                                    <span>Sobremesa grátis</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span>✓</span>
                                    <span>Reserva prioritária</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
