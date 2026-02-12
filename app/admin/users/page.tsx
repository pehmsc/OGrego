"use client";

import { useState } from "react";

type User = {
    nome: string;
    morada: string;
    telefone: string;
    email: string;
    nif: string;
    restauranteFavorito: string;
    pontos: number;
};

const users: User[] = [
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

export default function UsersPage() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<User>({
        nome: "",
        morada: "",
        telefone: "",
        email: "",
        nif: "",
        restauranteFavorito: "",
        pontos: 0,
    });

    // NOVO: Estados para pesquisa
    const [searchQuery, setSearchQuery] = useState("");

    // NOVO: Função para filtrar utilizadores
    const filteredUsers = users.filter(
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
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
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
        if (selectedUser) {
            // Aqui podias fazer fetch para API real
            console.log("Guardar:", formData);
            alert("Cliente atualizado! (Simulação - implementa API real)");
        }
        closeModal();
    };

    return (
        <>
            <main className="p-6 space-y-6">
                <header className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Utilizadores
                    </h1>
                    <p className="text-xl text-gray-600">
                        Lista de clientes registados na plataforma.
                    </p>
                </header>

                {/* NOVO: Barra de pesquisa */}
                <section className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="h-4 w-4 text-gray-400"
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
                        </div>
                        <input
                            type="text"
                            placeholder="Procurar por nome, NIF, email, morada..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full max-w-md pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
                            {filteredUsers.length} clientes
                        </span>
                    </div>

                    {/* MUDANÇA: usar filteredUsers em vez de users */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredUsers.map((u) => (
                            <div
                                key={u.nif}
                                className="group overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                                onClick={() => openEditModal(u)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-lg">
                                            <svg
                                                className="h-8 w-8 text-white"
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
                                        <div>
                                            <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600">
                                                {u.nome}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {u.nif}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
                                        {u.pontos} pts
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-500">
                                            Restaurante Favorito
                                        </span>
                                        <span className="inline-flex rounded-full bg-gradient-to-r from-orange-400 to-yellow-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                                            {u.restauranteFavorito}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">
                                                📍
                                            </span>{" "}
                                            {u.morada}
                                        </div>
                                        <div>
                                            <span className="font-medium">
                                                📱
                                            </span>{" "}
                                            {u.telefone}
                                        </div>
                                        <div className="col-span-2 pt-1">
                                            <span className="font-medium">
                                                ✉️
                                            </span>{" "}
                                            {u.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Modal de Edição - SEM MUDANÇAS */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
                    onClick={closeModal}
                >
                    <div
                        className="mx-auto mt-10 w-full max-w-md transform rounded-2xl bg-white p-8 shadow-2xl transition-all sm:mt-20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-gray-900">
                                Editar {selectedUser?.nome}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
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

                        <form className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Morada
                                </label>
                                <input
                                    type="text"
                                    name="morada"
                                    value={formData.morada}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Telefone
                                    </label>
                                    <input
                                        type="text"
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        NIF
                                    </label>
                                    <input
                                        type="text"
                                        name="nif"
                                        value={formData.nif}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Pontos
                                    </label>
                                    <input
                                        type="number"
                                        name="pontos"
                                        value={formData.pontos}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Restaurante Favorito
                                    </label>
                                    <select
                                        name="restauranteFavorito"
                                        value={formData.restauranteFavorito}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="Lisboa">Lisboa</option>
                                        <option value="Porto">Porto</option>
                                        <option value="Faro">Faro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                >
                                    Guardar Alterações
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 rounded-xl border border-gray-300 px-6 py-3 text-lg font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200"
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
