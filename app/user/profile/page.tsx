"use client";

import { useState, useEffect } from "react";
import { updateProfile } from "@/app/lib/profile-actions";
import UserPageLayout from "@/app/ui/components/user/UserPageLayout";
import LoyaltyCard from "@/app/ui/components/user/LoyaltyCard";
import DeleteAccountButton from "@/app/ui/components/user/DeleteAccountButton";
import Image from "next/image";
import Link from "next/link";

type ProfileUser = {
    name: string;
    email: string;
    phone: string;
    nif: string;
    address: string;
    postalCode: string;
    city: string;
    favoriteRestaurant: string;
    imageUrl: string;
    points: number;
    role?: "admin" | "user";
};

export default function PerfilPage() {
    const [user, setUser] = useState<ProfileUser | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState("");

    // Buscar dados do utilizador
    useEffect(() => {
        async function loadUser() {
            try {
                const response = await fetch("/api/profile");
                const data = (await response.json()) as ProfileUser;
                setUser(data);
                setImagePreview(data.imageUrl || "");
            } catch (error) {
                console.error("Erro ao carregar perfil:", error);
            }
        }
        loadUser();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const result = await updateProfile(formData);

        setIsSubmitting(false);

        if (result.success) {
            alert("Perfil atualizado com sucesso!");
            window.location.reload();
        } else {
            alert(result.error || "Erro ao atualizar perfil");
        }
    };

    if (!user) {
        return (
            <UserPageLayout sidebar={<LoyaltyCard points={0} />}>
                <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-8 shadow-sm">
                    <p className="text-center text-zinc-600">A carregar...</p>
                </div>
            </UserPageLayout>
        );
    }

    return (
        <UserPageLayout sidebar={<LoyaltyCard points={user.points || 0} />}>
            <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-8 shadow-sm">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-2xl font-semibold text-[#1E3A8A]">
                        Informações Pessoais
                    </h2>
                    {user.role === "admin" ? (
                        <Link
                            href="/admin/dashboard"
                            className="inline-flex h-10 items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-white px-5 text-sm font-medium text-[#1E3A8A] transition-all hover:border-[#1E3A8A]/40 hover:bg-[#F4F7FB]"
                        >
                            Ir para Dashboard
                        </Link>
                    ) : null}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Fotografia de Perfil */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1E3A8A]">
                            Fotografia de Perfil
                        </label>

                        <div className="flex items-center gap-6">
                            {/* Preview da imagem */}
                            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-[#1E3A8A]/20">
                                {imagePreview ? (
                                    <Image
                                        src={imagePreview}
                                        alt="Foto de perfil"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[#1E3A8A] text-2xl font-bold text-white">
                                        {user.name?.charAt(0).toUpperCase() ||
                                            "?"}
                                    </div>
                                )}
                            </div>

                            {/* Input de upload */}
                            <div className="flex-1">
                                <input
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-zinc-600
                                        file:mr-4 file:rounded-full file:border-0
                                        file:bg-[#1E3A8A] file:px-4 file:py-2
                                        file:text-sm file:font-medium file:text-white
                                        file:transition-all hover:file:bg-[#162F73]"
                                />
                                <p className="mt-1 text-xs text-zinc-600/70">
                                    Máximo 5MB (JPG, PNG, WEBP)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Nome Completo */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1E3A8A]">
                            Nome Completo
                        </label>
                        <input
                            name="name"
                            type="text"
                            defaultValue={user.name || ""}
                            required
                            className="w-full rounded-full border border-[#1E3A8A]/20 bg-white/80 px-6 py-3 text-sm transition-all focus:border-[#1E3A8A]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                        />
                    </div>

                    {/* Email (não editável) */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1E3A8A]">
                            Email
                        </label>
                        <input
                            type="email"
                            value={user.email || ""}
                            disabled
                            className="w-full rounded-full border border-[#1E3A8A]/20 bg-zinc-100 px-6 py-3 text-sm text-zinc-500"
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
                            defaultValue={user.phone || ""}
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
                            defaultValue={user.nif || ""}
                            maxLength={9}
                            placeholder="123456789"
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
                            defaultValue={user.address || ""}
                            placeholder="Rua Example, 123, 1200-000 Lisboa"
                            className="w-full rounded-full border border-[#1E3A8A]/20 bg-white/80 px-6 py-3 text-sm transition-all focus:border-[#1E3A8A]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                        />
                    </div>

                    {/* Código Postal */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1E3A8A]">
                            Código Postal
                        </label>
                        <input
                            name="postalCode"
                            type="text"
                            defaultValue={user.postalCode || ""}
                            placeholder="1000-000"
                            maxLength={8}
                            className="w-full rounded-full border border-[#1E3A8A]/20 bg-white/80 px-6 py-3 text-sm transition-all focus:border-[#1E3A8A]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                        />
                    </div>

                    {/* Cidade */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1E3A8A]">
                            Cidade
                        </label>
                        <input
                            name="city"
                            type="text"
                            defaultValue={user.city || ""}
                            placeholder="Lisboa"
                            className="w-full rounded-full border border-[#1E3A8A]/20 bg-white/80 px-6 py-3 text-sm transition-all focus:border-[#1E3A8A]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                        />
                    </div>

                    {/* Restaurante Favorito */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1E3A8A]">
                            Restaurante Favorito
                        </label>
                        <select
                            name="favoriteRestaurant"
                            defaultValue={user.favoriteRestaurant || ""}
                            className="w-full rounded-full border border-[#1E3A8A]/20 bg-white/80 px-6 py-3 text-sm transition-all focus:border-[#1E3A8A]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                        >
                            <option value="">Selecione...</option>
                            <option value="Lisboa">O Grego - Lisboa</option>
                            <option value="Porto">O Grego - Porto</option>
                            <option value="Faro">O Grego - Faro</option>
                        </select>
                    </div>

                    {/* Botão Guardar */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex h-12 w-full items-center justify-center rounded-full bg-[#1E3A8A] text-sm font-medium text-white shadow-xl transition-all hover:-translate-y-[1px] hover:bg-[#162F73] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                        {isSubmitting ? "A guardar..." : "Guardar Alterações"}
                    </button>
                </form>

                {/* Zona perigosa */}
                <div className="mt-10 border-t border-red-100 pt-8">
                    <p className="mb-4 text-sm text-zinc-500">
                        Ao eliminar a sua conta, os seus dados pessoais serão
                        apagados permanentemente.
                    </p>
                    <DeleteAccountButton />
                </div>
            </div>
        </UserPageLayout>
    );
}
