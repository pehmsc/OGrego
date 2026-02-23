"use client";

import { useState } from "react";
import {
    CalendarIcon,
    UserGroupIcon,
    ClockIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";

type Reservation = {
    id: number;
    numero?: string;
    cliente: string;
    data: string;
    hora: string;
    pessoas: number;
    estado: "Confirmada" | "Pendente";
    telefone?: string;
    notas?: string;
};

const reservasSeed: Reservation[] = [
    {
        id: 1,
        numero: "#RSV-001",
        cliente: "João Silva",
        data: "2026-02-15",
        hora: "19:30",
        pessoas: 4,
        estado: "Confirmada",
        telefone: "+351 913 456 789",
        notas: "Mesa junto à janela",
    },
    {
        id: 2,
        numero: "#RSV-002",
        cliente: "Maria Santos",
        data: "2026-02-16",
        hora: "20:00",
        pessoas: 2,
        estado: "Pendente",
        telefone: "+351 912 345 678",
    },
    {
        id: 3,
        numero: "#RSV-003",
        cliente: "Pedro Costa",
        data: "2026-02-17",
        hora: "19:00",
        pessoas: 6,
        estado: "Confirmada",
        telefone: "+351 914 567 890",
        notas: "Aniversário",
    },
];

const statusColor = (s: Reservation["estado"]) =>
    s === "Confirmada"
        ? "bg-emerald-100 text-emerald-800"
        : "bg-yellow-100 text-yellow-800";

export default function ReservationsPage() {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<Reservation | null>(null);
    const [editing, setEditing] = useState<Reservation | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [reservas, setReservas] = useState<Reservation[]>(reservasSeed);

    const filtered = reservas.filter((r) => {
        const q = query.toLowerCase();
        return (
            (r.numero || "").toLowerCase().includes(q) ||
            r.cliente.toLowerCase().includes(q) ||
            r.data.toLowerCase().includes(q) ||
            r.hora.toLowerCase().includes(q) ||
            (r.telefone || "").toLowerCase().includes(q) ||
            (r.notas || "").toLowerCase().includes(q) ||
            r.pessoas.toString().includes(q) ||
            r.estado.toLowerCase().includes(q)
        );
    });

    const confirmadas = reservas.filter(
        (r) => r.estado === "Confirmada",
    ).length;
    const pendentes = reservas.filter((r) => r.estado === "Pendente").length;
    const totalPessoas = reservas.reduce((s, r) => s + r.pessoas, 0);

    const handleEstadoChange = (
        id: number,
        novoEstado: Reservation["estado"],
    ) => {
        setReservas((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, estado: novoEstado } : item,
            ),
        );
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
                                <td className="px-4 py-3">{r.numero || "—"}</td>
                                <td className="px-4 py-3">{r.cliente}</td>
                                <td className="px-4 py-3">{r.pessoas}</td>
                                <td className="px-4 py-3">{r.data}</td>
                                <td className="px-4 py-3">{r.hora}</td>
                                <td className="px-4 py-3">
                                    {r.telefone || "—"}
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        value={r.estado}
                                        onChange={(e) =>
                                            handleEstadoChange(
                                                r.id,
                                                e.target
                                                    .value as Reservation["estado"],
                                            )
                                        }
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
                                        className="text-blue-600"
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

            {selected && !editing && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow max-w-lg w-full p-6"
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
                                <p className="font-medium">
                                    {selected.numero || "—"}
                                </p>
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
                                    {selected.telefone || "—"}
                                </p>
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
                                onClick={() => setEditing(selected)}
                            >
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editing && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
                    onClick={() => {
                        setEditing(null);
                        setSelected(null);
                    }}
                >
                    <div
                        className="bg-white rounded-2xl shadow max-w-lg w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">
                            Editar Reserva
                        </h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setEditing(null);
                                setSelected(null);
                                // Adicione lógica para atualizar a reserva aqui
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="text-xs text-gray-500">
                                    Número
                                </label>
                                <input
                                    type="text"
                                    defaultValue={editing.numero}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    defaultValue={editing.cliente}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Data
                                </label>
                                <input
                                    type="date"
                                    defaultValue={editing.data}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Hora
                                </label>
                                <input
                                    type="time"
                                    defaultValue={editing.hora}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Pessoas
                                </label>
                                <input
                                    type="number"
                                    defaultValue={editing.pessoas}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Telefone
                                </label>
                                <input
                                    type="text"
                                    defaultValue={editing.telefone}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Estado
                                </label>
                                <select
                                    defaultValue={editing.estado}
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="Confirmada">
                                        Confirmada
                                    </option>
                                    <option value="Pendente">Pendente</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Notas
                                </label>
                                <input
                                    type="text"
                                    defaultValue={editing.notas}
                                    className="w-full border rounded-lg px-3 py-2"
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
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 rounded-lg bg-blue-600 text-white"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCreate && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
                    onClick={() => setShowCreate(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow max-w-lg w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">Nova Reserva</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setShowCreate(false);
                                // Adicione lógica para criar a reserva aqui
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="text-xs text-gray-500">
                                    Número
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Data
                                </label>
                                <input
                                    type="date"
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Hora
                                </label>
                                <input
                                    type="time"
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Pessoas
                                </label>
                                <input
                                    type="number"
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Telefone
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Notas
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    className="flex-1 py-2 rounded-lg border"
                                    onClick={() => setShowCreate(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 rounded-lg bg-blue-600 text-white"
                                >
                                    Criar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
