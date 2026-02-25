"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    CalendarIcon,
    UserGroupIcon,
    ClockIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
    updateReservationAdmin,
    createReservationAdmin,
} from "@/app/lib/admin-actions";

type DbReservation = {
    id: number;
    nome: string;
    email: string;
    telefone: string | null;
    data: string;
    hora: string;
    pessoas: number;
    notas: string | null;
    estado: "Confirmada" | "Pendente";
    created_at: string;
};

type Reservation = {
    id: number;
    numero: string;
    cliente: string;
    email: string;
    data: string;
    hora: string;
    pessoas: number;
    estado: "Confirmada" | "Pendente";
    telefone: string;
    notas: string;
};

function dbToReservation(r: DbReservation): Reservation {
    return {
        id: r.id,
        numero: `#RSV-${String(r.id).padStart(3, "0")}`,
        cliente: r.nome,
        email: r.email,
        data: r.data,
        hora: r.hora,
        pessoas: r.pessoas,
        estado: r.estado,
        telefone: r.telefone || "—",
        notas: r.notas || "",
    };
}

const statusColor = (s: Reservation["estado"]) =>
    s === "Confirmada"
        ? "bg-emerald-100 text-emerald-800"
        : "bg-yellow-100 text-yellow-800";

export default function ReservationsClient({
    reservations: dbReservations,
}: {
    reservations: DbReservation[];
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<Reservation | null>(null);
    const [editing, setEditing] = useState<Reservation | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [reservas, setReservas] = useState<Reservation[]>(
        dbReservations.map(dbToReservation),
    );
    const [editForm, setEditForm] = useState<Partial<Reservation>>({});
    const [createForm, setCreateForm] = useState({
        cliente: "",
        email: "",
        telefone: "",
        data: "",
        hora: "",
        pessoas: 1,
        notas: "",
    });
    const [createError, setCreateError] = useState<string | null>(null);
    const [createSuccess, setCreateSuccess] = useState(false);

    const filtered = reservas.filter((r) => {
        const q = query.toLowerCase();
        return (
            r.numero.toLowerCase().includes(q) ||
            r.cliente.toLowerCase().includes(q) ||
            r.data.toLowerCase().includes(q) ||
            r.hora.toLowerCase().includes(q) ||
            r.telefone.toLowerCase().includes(q) ||
            r.notas.toLowerCase().includes(q) ||
            r.pessoas.toString().includes(q) ||
            r.estado.toLowerCase().includes(q)
        );
    });

    const confirmadas = reservas.filter(
        (r) => r.estado === "Confirmada",
    ).length;
    const pendentes = reservas.filter((r) => r.estado === "Pendente").length;
    const totalPessoas = reservas.reduce((s, r) => s + r.pessoas, 0);

    const openEditModal = (reserva: Reservation) => {
        setEditForm(reserva);
        setEditing(reserva);
    };

    const handleEditChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: name === "pessoas" ? parseInt(value) || 1 : value,
        }));
    };

    const handleEditSave = () => {
        if (editForm.id == null) return;
        startTransition(async () => {
            await updateReservationAdmin(editForm.id as number, {
                nome: (editForm.cliente as string) || "",
                email: (editForm.email as string) || "",
                telefone: (editForm.telefone as string) || "",
                data: (editForm.data as string) || "",
                hora: (editForm.hora as string) || "",
                pessoas: (editForm.pessoas as number) || 1,
                notas: (editForm.notas as string) || "",
                estado: (editForm.estado as string) || "Pendente",
            });

            // ✅ ATUALIZAR ESTADO LOCAL IMEDIATAMENTE
            setReservas((prev) =>
                prev.map((r) =>
                    r.id === editForm.id
                        ? {
                              ...r,
                              cliente: editForm.cliente || r.cliente,
                              email: editForm.email || r.email,
                              telefone: editForm.telefone || r.telefone,
                              data: editForm.data || r.data,
                              hora: editForm.hora || r.hora,
                              pessoas: editForm.pessoas || r.pessoas,
                              notas: editForm.notas || r.notas,
                              estado: editForm.estado || r.estado,
                          }
                        : r,
                ),
            );

            setEditing(null);
            setSelected(null);
            router.refresh();
        });
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateCreateForm = (): boolean => {
        setCreateError(null);

        if (!createForm.cliente.trim()) {
            setCreateError("Nome é obrigatório");
            return false;
        }

        if (!createForm.email.trim()) {
            setCreateError("Email é obrigatório");
            return false;
        }

        if (!validateEmail(createForm.email)) {
            setCreateError("Email inválido");
            return false;
        }

        if (!createForm.data) {
            setCreateError("Data é obrigatória");
            return false;
        }

        if (!createForm.hora) {
            setCreateError("Hora é obrigatória");
            return false;
        }

        const pessoas = createForm.pessoas;
        if (!pessoas || pessoas < 1) {
            setCreateError("Número de pessoas deve ser pelo menos 1");
            return false;
        }

        return true;
    };

    const handleCreateChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = e.target;
        setCreateForm((prev) => ({
            ...prev,
            [name]: name === "pessoas" ? parseInt(value) || 1 : value,
        }));
        setCreateError(null);
    };

    const handleCreateSubmit = () => {
        if (!validateCreateForm()) return;

        startTransition(async () => {
            try {
                const result = await createReservationAdmin({
                    nome: createForm.cliente,
                    email: createForm.email,
                    telefone: createForm.telefone,
                    data: createForm.data,
                    hora: createForm.hora,
                    pessoas: createForm.pessoas,
                    notas: createForm.notas,
                });

                const newReserva: Reservation = {
                    id: result.id,
                    numero: `#RSV-${String(result.id).padStart(3, "0")}`,
                    cliente: createForm.cliente,
                    email: createForm.email,
                    data: createForm.data,
                    hora: createForm.hora,
                    pessoas: createForm.pessoas,
                    estado: "Confirmada",
                    telefone: createForm.telefone || "—",
                    notas: createForm.notas,
                };

                setReservas((prev) => [newReserva, ...prev]);
                setCreateSuccess(true);

                setTimeout(() => {
                    setShowCreate(false);
                    setCreateSuccess(false);
                    setCreateForm({
                        cliente: "",
                        email: "",
                        telefone: "",
                        data: "",
                        hora: "",
                        pessoas: 1,
                        notas: "",
                    });
                }, 2000);

                router.refresh();
            } catch (error) {
                setCreateError("Erro ao criar reserva. Tente novamente.");
            }
        });
    };

    return (
        <main className="p-6 space-y-6">
            <header className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow">
                    <CalendarIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Gestão de Reservas</h1>
                    <p className="text-sm text-gray-600">
                        Reservas futuras do restaurante
                    </p>
                </div>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase">Confirmadas</p>
                            <p className="text-2xl font-bold">{confirmadas}</p>
                        </div>
                        <CheckCircleIcon className="h-8 w-8 opacity-80" />
                    </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase">Pendentes</p>
                            <p className="text-2xl font-bold">{pendentes}</p>
                        </div>
                        <ClockIcon className="h-8 w-8 opacity-80" />
                    </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase">Total Pessoas</p>
                            <p className="text-2xl font-bold">{totalPessoas}</p>
                        </div>
                        <UserGroupIcon className="h-8 w-8 opacity-80" />
                    </div>
                </div>
            </section>

            <section className="flex items-start gap-6">
                <div className="relative">
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
                        placeholder="Pesquisar..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-56 pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white/90 focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <button
                    className="py-2 px-4 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 transition text-sm"
                    onClick={() => setShowCreate(true)}
                >
                    Nova Reserva
                </button>
            </section>

            <section className="bg-white rounded-2xl shadow border overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Número</th>
                            <th className="px-4 py-3 text-left">Nome</th>
                            <th className="px-4 py-3 text-left">Pessoas</th>
                            <th className="px-4 py-3 text-left">Data</th>
                            <th className="px-4 py-3 text-left">Hora</th>
                            <th className="px-4 py-3 text-left">Telefone</th>
                            <th className="px-4 py-3 text-left">Estado</th>
                            <th className="px-4 py-3 text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((r) => (
                            <tr
                                key={r.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="px-4 py-3">{r.numero}</td>
                                <td className="px-4 py-3">{r.cliente}</td>
                                <td className="px-4 py-3">{r.pessoas}</td>
                                <td className="px-4 py-3">{r.data}</td>
                                <td className="px-4 py-3">{r.hora}</td>
                                <td className="px-4 py-3">{r.telefone}</td>
                                <td className="px-4 py-3">
                                    <select
                                        value={r.estado}
                                        onChange={(e) => {
                                            const newEstado = e.target.value as
                                                | "Confirmada"
                                                | "Pendente";

                                            // Atualizar estado local
                                            setReservas((prev) =>
                                                prev.map((res) =>
                                                    res.id === r.id
                                                        ? {
                                                              ...res,
                                                              estado: newEstado,
                                                          }
                                                        : res,
                                                ),
                                            );

                                            // Atualizar na BD
                                            startTransition(async () => {
                                                await updateReservationAdmin(
                                                    r.id,
                                                    {
                                                        nome: r.cliente,
                                                        email: r.email,
                                                        telefone: r.telefone,
                                                        data: r.data,
                                                        hora: r.hora,
                                                        pessoas: r.pessoas,
                                                        notas: r.notas,
                                                        estado: newEstado,
                                                    },
                                                );
                                                router.refresh();
                                            });
                                        }}
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(r.estado)}`}
                                    >
                                        <option value="Confirmada">
                                            Confirmada
                                        </option>
                                        <option value="Pendente">
                                            Pendente
                                        </option>
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        className="text-blue-600 hover:underline"
                                        onClick={() => setSelected(r)}
                                    >
                                        Ver
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* MODAL VER */}
            {selected && !editing && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 overflow-y-auto"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow max-w-lg w-full p-6 my-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold">
                                {selected.cliente}
                            </h2>
                            <button
                                onClick={() => setSelected(null)}
                                className="text-gray-600"
                            >
                                Fechar
                            </button>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-gray-500">Número</p>
                                <p className="font-medium">{selected.numero}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Data</p>
                                <p className="font-medium">{selected.data}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Hora</p>
                                <p className="font-medium">{selected.hora}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Pessoas</p>
                                <p className="font-medium">
                                    {selected.pessoas}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Telefone
                                </p>
                                <p className="font-medium">
                                    {selected.telefone}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="font-medium">{selected.email}</p>
                            </div>
                        </div>

                        {selected.notas && (
                            <div className="mt-4 p-3 bg-blue-50 rounded">
                                <p className="text-sm text-gray-700">
                                    {selected.notas}
                                </p>
                            </div>
                        )}

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setSelected(null)}
                                className="flex-1 py-2 rounded-lg border"
                            >
                                Fechar
                            </button>
                            <button
                                className="flex-1 py-2 rounded-lg bg-blue-600 text-white"
                                onClick={() => openEditModal(selected)}
                            >
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL EDITAR */}
            {editing && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 overflow-y-auto"
                    onClick={() => {
                        setEditing(null);
                        setSelected(null);
                    }}
                >
                    <div
                        className="bg-white rounded-2xl shadow max-w-lg w-full p-6 my-8 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">
                            Editar Reserva
                        </h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleEditSave();
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="text-xs text-gray-500">
                                    Número
                                </label>
                                <input
                                    type="text"
                                    value={editForm.numero || ""}
                                    disabled
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    name="cliente"
                                    value={editForm.cliente || ""}
                                    onChange={handleEditChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email || ""}
                                    onChange={handleEditChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Data
                                </label>
                                <input
                                    type="date"
                                    name="data"
                                    value={editForm.data || ""}
                                    onChange={handleEditChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Hora
                                </label>
                                <input
                                    type="text"
                                    name="hora"
                                    value={editForm.hora || ""}
                                    onChange={handleEditChange}
                                    placeholder="HH:MM"
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Pessoas
                                </label>
                                <input
                                    type="number"
                                    name="pessoas"
                                    value={editForm.pessoas || ""}
                                    onChange={handleEditChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Telefone
                                </label>
                                <input
                                    type="text"
                                    name="telefone"
                                    value={editForm.telefone || ""}
                                    onChange={handleEditChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Notas
                                </label>
                                <textarea
                                    name="notas"
                                    value={editForm.notas || ""}
                                    onChange={handleEditChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                    rows={2}
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    className="flex-1 py-2 rounded-lg border"
                                    onClick={() => {
                                        setEditing(null);
                                        setSelected(null);
                                    }}
                                    disabled={isPending}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isPending}
                                >
                                    {isPending ? "A guardar..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL CRIAR */}
            {showCreate && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 overflow-y-auto"
                    onClick={() => setShowCreate(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow max-w-lg w-full p-6 my-8 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">Nova Reserva</h2>

                        {createSuccess && (
                            <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                <p className="text-sm text-emerald-700">
                                    Reserva criada com sucesso!
                                </p>
                            </div>
                        )}

                        {createError && (
                            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                                <p className="text-sm text-red-700">
                                    {createError}
                                </p>
                            </div>
                        )}

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleCreateSubmit();
                            }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-600 block mb-1">
                                        Nome{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="cliente"
                                        value={createForm.cliente}
                                        onChange={handleCreateChange}
                                        className="w-full border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-400"
                                        placeholder="Nome completo"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 block mb-1">
                                        Email{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={createForm.email}
                                        onChange={handleCreateChange}
                                        className="w-full border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-400"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Telefone
                                </label>
                                <input
                                    type="text"
                                    name="telefone"
                                    value={createForm.telefone}
                                    onChange={handleCreateChange}
                                    className="w-full border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-400"
                                    placeholder="+351 9xx xxx xxx"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs text-gray-600 block mb-1">
                                        Data{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="data"
                                        value={createForm.data}
                                        onChange={handleCreateChange}
                                        className="w-full border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 block mb-1">
                                        Hora{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="hora"
                                        value={createForm.hora}
                                        onChange={handleCreateChange}
                                        placeholder="HH:MM"
                                        className="w-full border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 block mb-1">
                                        Pessoas{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="pessoas"
                                        value={createForm.pessoas}
                                        onChange={handleCreateChange}
                                        className="w-full border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-400"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Notas
                                </label>
                                <textarea
                                    name="notas"
                                    value={createForm.notas}
                                    onChange={handleCreateChange}
                                    className="w-full border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-400"
                                    rows={2}
                                    placeholder="Ex: mesa junto à janela, sem cebola..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreate(false);
                                        setCreateError(null);
                                        setCreateForm({
                                            cliente: "",
                                            email: "",
                                            telefone: "",
                                            data: "",
                                            hora: "",
                                            pessoas: 1,
                                            notas: "",
                                        });
                                    }}
                                    disabled={isPending}
                                    className="flex-1 py-2 border rounded-lg disabled:cursor-not-allowed"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPending ? "A criar..." : "Criar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
