"use client";

import { useState } from "react";
import {
    ShoppingBagIcon,
    ArrowTrendingUpIcon,
    ClockIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";

type Order = {
    id: number;
    numero: string;
    cliente: string;
    tipo: "Entrega" | "Take-away" | "Balcão";
    estado: "Em preparação" | "Pronto" | "Enviado" | "Entregue" | "Cancelado";
    total: number;
    data: string;
    hora: string;
    telefone: string;
    notas: string;
};

const initialPedidos: Order[] = [
    {
        id: 101,
        numero: "#PED-001",
        cliente: "Ana Martins",
        tipo: "Entrega",
        estado: "Em preparação",
        total: 32.5,
        data: "2026-02-10",
        hora: "19:15",
        telefone: "+351 913 456 789",
        notas: "Sem cebola no prato principal.",
    },
    {
        id: 102,
        numero: "#PED-002",
        cliente: "Pedro Lopes",
        tipo: "Take-away",
        estado: "Pronto",
        total: 24.0,
        data: "2026-02-10",
        hora: "20:00",
        telefone: "+351 912 345 678",
        notas: "Cliente já confirmou.",
    },
    {
        id: 103,
        numero: "#PED-003",
        cliente: "Sofia Nunes",
        tipo: "Entrega",
        estado: "Entregue",
        total: 41.2,
        data: "2026-02-11",
        hora: "19:45",
        telefone: "+351 934 567 890",
        notas: "Entregue com sucesso.",
    },
    {
        id: 104,
        numero: "#PED-004",
        cliente: "João Silva",
        tipo: "Balcão",
        estado: "Pronto",
        total: 18.75,
        data: "2026-02-11",
        hora: "18:30",
        telefone: "+351 967 890 123",
        notas: "",
    },
    {
        id: 105,
        numero: "#PED-005",
        cliente: "Maria Costa",
        tipo: "Take-away",
        estado: "Cancelado",
        total: 56.3,
        data: "2026-02-09",
        hora: "19:00",
        telefone: "+351 911 234 567",
        notas: "Cliente cancelou por motivos pessoais.",
    },
];

const getStatusColor = (estado: Order["estado"]) => {
    switch (estado) {
        case "Em preparação":
            return "bg-yellow-100 text-yellow-800";
        case "Pronto":
            return "bg-blue-100 text-blue-800";
        case "Enviado":
            return "bg-purple-100 text-purple-800";
        case "Entregue":
            return "bg-emerald-100 text-emerald-800";
        case "Cancelado":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getTipoColor = (tipo: Order["tipo"]) => {
    switch (tipo) {
        case "Entrega":
            return "bg-indigo-100 text-indigo-800";
        case "Take-away":
            return "bg-orange-100 text-orange-800";
        case "Balcão":
            return "bg-green-100 text-green-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export default function OrdensPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterTipo, setFilterTipo] = useState<
        "" | "Entrega" | "Take-away" | "Balcão"
    >("");
    const [selectedPedido, setSelectedPedido] = useState<Order | null>(null);

    // pedidos agora em state para permitir edição
    const [pedidosState, setPedidosState] = useState<Order[]>(initialPedidos);

    // create order modal + form state (numero generated on open)
    const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
    const [createOrderForm, setCreateOrderForm] = useState<Partial<Order>>({
        numero: "",
        cliente: "",
        tipo: "Entrega",
        estado: "Em preparação",
        total: 0,
        data: new Date().toISOString().slice(0, 10),
        hora: "19:00",
        telefone: "",
        notas: "",
    });

    const openCreateOrderModal = () => {
        setCreateOrderForm({
            numero: `#PED-${Date.now().toString().slice(-4)}`,
            cliente: "",
            tipo: "Entrega",
            estado: "Em preparação",
            total: 0,
            data: new Date().toISOString().slice(0, 10),
            hora: "19:00",
            telefone: "",
            notas: "",
        });
        setIsCreateOrderOpen(true);
    };
    const closeCreateOrderModal = () => setIsCreateOrderOpen(false);

    const handleCreateOrderChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = e.target;
        const key = name as keyof Order;
        const parsedValue =
            name === "total"
                ? parseFloat(value || "0")
                : (value as unknown as string);
        setCreateOrderForm((prev) => ({
            ...(prev as Partial<Order>),
            [key]: parsedValue,
        }));
    };

    const handleCreateOrderSave = () => {
        const newOrder: Order = {
            id: Math.max(0, ...pedidosState.map((p) => p.id)) + 1,
            numero:
                (createOrderForm.numero as string) ||
                `#PED-${Date.now().toString().slice(-4)}`,
            cliente: (createOrderForm.cliente as string) || "",
            tipo: (createOrderForm.tipo as Order["tipo"]) || "Entrega",
            estado:
                (createOrderForm.estado as Order["estado"]) || "Em preparação",
            total: createOrderForm.total || 0,
            data: createOrderForm.data || new Date().toISOString().slice(0, 10),
            hora: createOrderForm.hora || "19:00",
            telefone: createOrderForm.telefone || "",
            notas: createOrderForm.notas || "",
        };
        setPedidosState((prev) => [newOrder, ...prev]);
        closeCreateOrderModal();
    };

    // EDIT modal state + handlers
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Order>>({});

    const openEditModal = (pedido: Order) => {
        setEditForm(pedido);
        setIsEditOpen(true);
    };
    const closeEditModal = () => setIsEditOpen(false);

    const handleEditChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = e.target;
        const key = name as keyof Order;
        const parsedValue =
            name === "total"
                ? parseFloat(value || "0")
                : (value as unknown as string);
        setEditForm((prev) => ({
            ...(prev as Partial<Order>),
            [key]: parsedValue,
        }));
    };

    const handleEditSave = () => {
        if (editForm.id == null) return;
        setPedidosState((prev) =>
            prev.map((p) =>
                p.id === editForm.id ? { ...p, ...(editForm as Order) } : p,
            ),
        );
        setIsEditOpen(false);
        setSelectedPedido(null);
    };

    const filteredPedidos = pedidosState.filter((p) => {
        const matchSearch =
            p.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.numero.includes(searchQuery) ||
            p.data.includes(searchQuery);

        const matchTipo = filterTipo === "" || p.tipo === filterTipo;

        return matchSearch && matchTipo;
    });

    const pedidosAtivos = pedidosState.filter(
        (p) => p.estado !== "Entregue" && p.estado !== "Cancelado",
    ).length;
    const pedidosEntregues = pedidosState.filter(
        (p) => p.estado === "Entregue",
    ).length;
    const totalPedidos = pedidosState.reduce((sum, p) => sum + p.total, 0);

    return (
        <main className="p-6 space-y-6">
            <header className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl shadow">
                    <ShoppingBagIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Gestão de Pedidos</h1>
                    <p className="text-sm text-gray-600">
                        Acompanhamento de todas as encomendas e pedidos
                    </p>
                </div>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase">Pedidos Ativos</p>
                            <p className="text-2xl font-bold">
                                {pedidosAtivos}
                            </p>
                        </div>
                        <ClockIcon className="h-8 w-8 opacity-80" />
                    </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase">Entregues</p>
                            <p className="text-2xl font-bold">
                                {pedidosEntregues}
                            </p>
                        </div>
                        <CheckCircleIcon className="h-8 w-8 opacity-80" />
                    </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase">Total (€)</p>
                            <p className="text-2xl font-bold">
                                €{totalPedidos.toFixed(2)}
                            </p>
                        </div>
                        <ArrowTrendingUpIcon className="h-8 w-8 opacity-80" />
                    </div>
                </div>
            </section>

            {/* SEARCH ROW: search + create button */}
            <section className="flex items-center gap-6">
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-56 pl-10 pr-3 py-1 border border-gray-200 rounded-lg text-sm bg-white/90 focus:ring-2 focus:ring-orange-400"
                    />
                </div>

                {/* CREATE ORDER BUTTON (next to search) */}
                <button
                    onClick={openCreateOrderModal}
                    className="ml-2 inline-flex items-center gap-2 px-4 py-1 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors"
                >
                    Criar Pedido
                </button>
            </section>

            {/* FILTERS ROW: moved below search */}
            <section className="flex gap-2 flex-wrap mt-2">
                <button
                    onClick={() => setFilterTipo("")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        filterTipo === ""
                            ? "bg-orange-500 text-white"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    Todos
                </button>
                <button
                    onClick={() => setFilterTipo("Entrega")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        filterTipo === "Entrega"
                            ? "bg-indigo-500 text-white"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    Entrega
                </button>
                <button
                    onClick={() => setFilterTipo("Take-away")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        filterTipo === "Take-away"
                            ? "bg-orange-500 text-white"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    Take-away
                </button>
                <button
                    onClick={() => setFilterTipo("Balcão")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        filterTipo === "Balcão"
                            ? "bg-green-500 text-white"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    Balcão
                </button>
            </section>

            <section className="bg-white rounded-2xl shadow border overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Número</th>
                            <th className="px-4 py-3 text-left">Cliente</th>
                            <th className="px-4 py-3 text-left">Tipo</th>
                            <th className="px-4 py-3 text-left">Estado</th>
                            <th className="px-4 py-3 text-left">Total</th>
                            <th className="px-4 py-3 text-left">Data</th>
                            <th className="px-4 py-3 text-left">Hora</th>
                            <th className="px-4 py-3 text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPedidos.map((pedido) => (
                            <tr
                                key={pedido.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="px-4 py-3">{pedido.numero}</td>
                                <td className="px-4 py-3">{pedido.cliente}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getTipoColor(pedido.tipo)}`}
                                    >
                                        {pedido.tipo}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(pedido.estado)}`}
                                    >
                                        {pedido.estado}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-semibold text-orange-600">
                                    €{pedido.total.toFixed(2)}
                                </td>
                                <td className="px-4 py-3">{pedido.data}</td>
                                <td className="px-4 py-3">{pedido.hora}</td>
                                <td className="px-4 py-3">
                                    <button
                                        className="text-orange-600"
                                        onClick={() =>
                                            setSelectedPedido(pedido)
                                        }
                                    >
                                        Ver
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {selectedPedido && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
                    onClick={() => setSelectedPedido(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow max-w-lg w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold">
                                {selectedPedido.numero}
                            </h2>
                            <button
                                onClick={() => setSelectedPedido(null)}
                                className="text-gray-600"
                            >
                                Fechar
                            </button>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-gray-500">Cliente</p>
                                <p className="font-medium">
                                    {selectedPedido.cliente}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Total</p>
                                <p className="font-medium">
                                    €{selectedPedido.total.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Tipo</p>
                                <p className="font-medium">
                                    {selectedPedido.tipo}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Estado</p>
                                <p className="font-medium">
                                    {selectedPedido.estado}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Data</p>
                                <p className="font-medium">
                                    {selectedPedido.data}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Hora</p>
                                <p className="font-medium">
                                    {selectedPedido.hora}
                                </p>
                            </div>
                        </div>

                        {selectedPedido.notas && (
                            <div className="mt-4 p-3 bg-orange-50 rounded">
                                <p className="text-sm text-gray-700">
                                    {selectedPedido.notas}
                                </p>
                            </div>
                        )}

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setSelectedPedido(null)}
                                className="flex-1 py-2 rounded-lg border"
                            >
                                Fechar
                            </button>
                            <button
                                className="flex-1 py-2 rounded-lg bg-orange-600 text-white"
                                onClick={() => openEditModal(selectedPedido)}
                            >
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CREATE ORDER MODAL */}
            {isCreateOrderOpen && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
                    onClick={closeCreateOrderModal}
                >
                    <div
                        className="bg-white rounded-2xl shadow max-w-lg w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">Criar Pedido</h2>
                            <button
                                onClick={closeCreateOrderModal}
                                className="text-gray-500"
                            >
                                Fechar
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Número
                                </label>
                                <input
                                    name="numero"
                                    value={createOrderForm.numero ?? ""}
                                    onChange={handleCreateOrderChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Cliente
                                </label>
                                <input
                                    name="cliente"
                                    value={createOrderForm.cliente ?? ""}
                                    onChange={handleCreateOrderChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-600 block mb-1">
                                        Tipo
                                    </label>
                                    <select
                                        name="tipo"
                                        value={
                                            createOrderForm.tipo ?? "Entrega"
                                        }
                                        onChange={handleCreateOrderChange}
                                        className="w-full border px-3 py-2 rounded"
                                    >
                                        <option value="Entrega">Entrega</option>
                                        <option value="Take-away">
                                            Take-away
                                        </option>
                                        <option value="Balcão">Balcão</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 block mb-1">
                                        Valor (€)
                                    </label>
                                    <input
                                        name="total"
                                        type="number"
                                        step="0.01"
                                        value={createOrderForm.total ?? 0}
                                        onChange={handleCreateOrderChange}
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Data
                                </label>
                                <input
                                    name="data"
                                    type="date"
                                    value={
                                        createOrderForm.data ??
                                        new Date().toISOString().slice(0, 10)
                                    }
                                    onChange={handleCreateOrderChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Hora
                                </label>
                                <input
                                    name="hora"
                                    type="time"
                                    value={createOrderForm.hora ?? "19:00"}
                                    onChange={handleCreateOrderChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Telefone
                                </label>
                                <input
                                    name="telefone"
                                    value={createOrderForm.telefone ?? ""}
                                    onChange={handleCreateOrderChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Notas
                                </label>
                                <textarea
                                    name="notas"
                                    value={createOrderForm.notas ?? ""}
                                    onChange={handleCreateOrderChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleCreateOrderSave}
                                    className="flex-1 py-2 bg-orange-600 text-white rounded-lg"
                                >
                                    Criar
                                </button>
                                <button
                                    onClick={closeCreateOrderModal}
                                    className="flex-1 py-2 border rounded-lg"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT ORDER MODAL */}
            {isEditOpen && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
                    onClick={closeEditModal}
                >
                    <div
                        className="bg-white rounded-2xl shadow max-w-lg w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">Editar Pedido</h2>
                            <button
                                onClick={closeEditModal}
                                className="text-gray-500"
                            >
                                Fechar
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Número
                                </label>
                                <input
                                    name="numero"
                                    value={editForm.numero ?? ""}
                                    onChange={handleEditChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Cliente
                                </label>
                                <input
                                    name="cliente"
                                    value={editForm.cliente ?? ""}
                                    onChange={handleEditChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-600 block mb-1">
                                        Tipo
                                    </label>
                                    <select
                                        name="tipo"
                                        value={editForm.tipo ?? "Entrega"}
                                        onChange={handleEditChange}
                                        className="w-full border px-3 py-2 rounded"
                                    >
                                        <option value="Entrega">Entrega</option>
                                        <option value="Take-away">
                                            Take-away
                                        </option>
                                        <option value="Balcão">Balcão</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 block mb-1">
                                        Valor (€)
                                    </label>
                                    <input
                                        name="total"
                                        type="number"
                                        step="0.01"
                                        value={editForm.total ?? 0}
                                        onChange={handleEditChange}
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Data
                                </label>
                                <input
                                    name="data"
                                    type="date"
                                    value={
                                        editForm.data ??
                                        new Date().toISOString().slice(0, 10)
                                    }
                                    onChange={handleEditChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Hora
                                </label>
                                <input
                                    name="hora"
                                    type="time"
                                    value={editForm.hora ?? "19:00"}
                                    onChange={handleEditChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Telefone
                                </label>
                                <input
                                    name="telefone"
                                    value={editForm.telefone ?? ""}
                                    onChange={handleEditChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Notas
                                </label>
                                <textarea
                                    name="notas"
                                    value={editForm.notas ?? ""}
                                    onChange={handleEditChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleEditSave}
                                    className="flex-1 py-2 bg-orange-600 text-white rounded-lg"
                                >
                                    Guardar
                                </button>
                                <button
                                    onClick={closeEditModal}
                                    className="flex-1 py-2 border rounded-lg"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
