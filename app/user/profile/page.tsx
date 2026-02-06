import { getCurrentUserDb } from "@/app/lib/current-user";
import { updateProfile } from "@/app/lib/profile-actions";
import UserPageLayout from "@/app/ui/components/user/UserPageLayout";
import LoyaltyCard from "@/app/ui/components/user/LoyaltyCard";

export default async function ProfilePage() {
    const userDb = await getCurrentUserDb();

    const name =
        [userDb.first_name, userDb.last_name].filter(Boolean).join(" ") ||
        "Utilizador";

    const user = {
        name,
        email: userDb.email ?? "",
        photo: userDb.image_url ?? "",
        phone: userDb.phone ?? "",
        nif: userDb.nif ?? "",
        address: userDb.address ?? "",
        favorite_restaurant: userDb.favorite_restaurant ?? "",
        loyalty_points: userDb.points ?? 0,
    };

    return (
        <UserPageLayout sidebar={<LoyaltyCard points={user.loyalty_points} />}>
            {/* Formulário de Perfil */}
            <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-8 shadow-sm">
                <h2 className="mb-6 text-2xl font-semibold text-[#1E3A8A]">
                    Informações Pessoais
                </h2>

                <form action={updateProfile} className="grid gap-6">
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
                            name="name"
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
                            name="phone"
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
                            name="nif"
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
                            name="address"
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
                            name="favorite_restaurant"
                            defaultValue={user.favorite_restaurant}
                            className="w-full rounded-full border border-[#1E3A8A]/20 bg-white/80 px-6 py-3 text-sm transition-all focus:border-[#1E3A8A]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                        >
                            <option value="">Selecione...</option>
                            <option value="O Grego Lisboa">
                                O Grego Lisboa
                            </option>
                            <option value="O Grego Porto">O Grego Porto</option>
                            <option value="O Grego Faro">O Grego Faro</option>
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
        </UserPageLayout>
    );
}
