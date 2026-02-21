"use client";

import { useState } from "react";
import { UsersIcon, UserPlusIcon } from "@heroicons/react/24/outline";

type User = {
    nome: string;
    morada: string;
    telefone: string;
    email: string;
    nif: string;
    restauranteFavorito: string;
    pontos: number;
};

const usersData: User[] = [
    {
        nome: "David Martins",
        morada: "Morada da Baixa 3, Faro",
        telefone: "911 111 111",
        email: "damartins89@gmail.com",
        nif: "123456789",
        restauranteFavorito: "Faro",
        pontos: 120,
    },
    {
        nome: "Joana Barta",
        morada: "Morada do Alto 2, Porto",
        telefone: "922 222 222",
        email: "joanamcbarata@gmail.com",
        nif: "234567890",
        restauranteFavorito: "Porto",
        pontos: 200,
    },
    {
        nome: "Pedro Campos",
        morada: "Rua do Exemplo 4, 2º Esq., Lisboa",
        telefone: "912 345 987",
        email: "pehmsc@gmail.com",
        nif: "312987123",
        restauranteFavorito: "Lisboa",
        pontos: 80,
    },
];

const emptyUser: User = {
    nome: "",
    morada: "",
    telefone: "",
    email: "",
    nif: "",
    restauranteFavorito: "Lisboa",
    pontos: 0,
};

export default function UsersPage() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [formData, setFormData] = useState<User>(emptyUser);

    const filteredUsers = usersData.filter(
        (user) =>
            user.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.nif.includes(searchQuery) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.morada.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.telefone.includes(searchQuery) ||
            user.restauranteFavorito
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
    );

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setFormData(user);
        setIsNewUser(false);
        setIsModalOpen(true);
    };

    const openNewUserModal = () => {
        setSelectedUser(null);
        setFormData(emptyUser);
        setIsNewUser(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setIsNewUser(false);
        setFormData(emptyUser);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "pontos" ? parseInt(value) || 0 : value,
        }));
    };

    const handleSave = () => {
        if (isNewUser) {
            console.log("Criar novo cliente:", formData);
            alert("Cliente criado! (Simulação - implementa API real)");
        } else if (selectedUser) {
            console.log("Guardar cliente:", formData);
            alert("Cliente atualizado! (Simulação - implementa API real)");
        }
        closeModal();
    };

    const isFormValid = formData.nome && formData.email && formData.nif;

    return (
        <>
            <main className="p-6 space-y-6">
                <header className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow">
                        <UsersIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Utilizadores</h1>
                        <p className="text-sm text-gray-600">
                            Lista de clientes registados na plataforma
                        </p>
                    </div>
                </header>

                <section className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Pesquisar por nome, NIF, email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white/90 focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                    <button
                        onClick={openNewUserModal}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <UserPlusIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                            Novo Cliente
                        </span>
                    </button>
                </section>

                <section className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 text-purple-800 px-4 py-2 text-sm font-medium">
                        {filteredUsers.length} clientes
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredUsers.map((u) => (
                            <div
                                key={u.nif}
                                onClick={() => openEditModal(u)}
                                className="group cursor-pointer border border-gray-200 rounded-2xl p-4 bg-white hover:shadow-lg hover:-translate-y-1 transition-all"
                            >
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow">
                                            <svg
                                                className="h-6 w-6 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-gray-900 truncate group-hover:text-purple-600">
                                                {u.nome}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {u.nif}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800 flex-shrink-0">
                                        {u.pontos} pts
                                    </span>
                                </div>

                                <div className="space-y-2 border-t border-gray-100 pt-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">
                                            Restaurante Favorito
                                        </span>
                                        <span className="inline-flex rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">
                                            {u.restauranteFavorito}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 truncate">
                                        <span className="mr-1">📍</span>
                                        {u.morada}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate">
                                        <span className="mr-1">📱</span>
                                        {u.telefone}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate">
                                        <span className="mr-1">✉️</span>
                                        {u.email}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">
                                {isNewUser
                                    ? "Novo Cliente"
                                    : `Editar ${selectedUser?.nome}`}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <form className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Nome <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    placeholder="Nome completo"
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Morada
                                </label>
                                <input
                                    type="text"
                                    name="morada"
                                    value={formData.morada}
                                    onChange={handleInputChange}
                                    placeholder="Endereço completo"
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Telefone
                                    </label>
                                    <input
                                        type="text"
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={handleInputChange}
                                        placeholder="911 111 111"
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        NIF{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nif"
                                        value={formData.nif}
                                        onChange={handleInputChange}
                                        placeholder="123456789"
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Email{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="email@example.com"
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Pontos
                                    </label>
                                    <input
                                        type="number"
                                        name="pontos"
                                        value={formData.pontos}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Restaurante Favorito
                                    </label>
                                    <select
                                        name="restauranteFavorito"
                                        value={formData.restauranteFavorito}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400"
                                    >
                                        <option value="Lisboa">Lisboa</option>
                                        <option value="Porto">Porto</option>
                                        <option value="Faro">Faro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={!isFormValid}
                                    className="flex-1 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isNewUser ? "Criar Cliente" : "Guardar"}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
