"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    ShoppingBagIcon,
    ArrowTrendingUpIcon,
    ClockIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { updateOrderAdmin } from "@/app/lib/admin-actions";

type DbOrder = {
    id: number;
    customer_name: string | null;
    customer_phone: string | null;
    order_type: string;
    status: string;
    total_cents: number;
    notes: string | null;
    created_at: string;
};

type Order = {
    id: number;
    numero: string;
    cliente: string;
    tipo: "Delivery" | "Take-away";
    estado: "Em preparação" | "Pronto" | "Entregue" | "Cancelado";
    total: number;
    data: string;
    hora: string;
    telefone: string;
    notas: string;
};

function dbToOrder(o: DbOrder): Order {
    const date = new Date(o.created_at);
    return {
        id: o.id,
        numero: `#${o.id}`,
        cliente: o.customer_name || "—",
        tipo:
            o.order_type === "delivery"
                ? "Delivery"
                : o.order_type === "takeaway"
                  ? "Take-away"
                  : "Take-away",
        estado:
            o.status === "pending"
                ? "Em preparação"
                : o.status === "ready"
                  ? "Pronto"
                  : o.status === "delivered"
                    ? "Entregue"
                    : "Cancelado",
        total: o.total_cents / 100,
        data: date.toLocaleDateString("pt-PT"),
        hora: date.toLocaleTimeString("pt-PT", {
            hour: "2-digit",
            minute: "2-digit",
        }),
        telefone: o.customer_phone || "—",
        notas: o.notes || "",
    };
}

function uiStatusToDb(estado: string): string {
    switch (estado) {
        case "Em preparação":
            return "pending";
        case "Pronto":
            return "ready";
        case "Entregue":
            return "delivered";
        case "Cancelado":
            return "cancelled";
        default:
            return "pending";
    }
}

const getStatusColor = (estado: string) => {
    switch (estado) {
        case "Em preparação":
            return "bg-yellow-100 text-yellow-800";
        case "Pronto":
            return "bg-blue-100 text-blue-800";
        case "Entregue":
            return "bg-green-100 text-green-800";
        case "Cancelado":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getTipoColor = (tipo: string) => {
    switch (tipo) {
        case "Delivery":
            return "bg-green-100 text-green-800";
        case "Take-away":
            return "bg-blue-100 text-blue-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export default function OrdersClient({
    orders: dbOrders,
}: {
    orders: DbOrder[];
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [searchQuery, setSearchQuery] = useState("");
    const [filterEstado, setFilterEstado] = useState<
        "" | "Em preparação" | "Pronto" | "Entregue" | "Cancelado"
    >("");
    const [selectedPedido, setSelectedPedido] = useState<Order | null>(null);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Order>>({});

    const [orders, setOrders] = useState<Order[]>(dbOrders.map(dbToOrder));

    // Atualiza estado local e backend ao mudar o estado na tabela
    const handleEstadoChange = (id: number, novoEstado: string) => {
        setOrders((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, estado: novoEstado as Order["estado"] }
                    : item,
            ),
        );
        startTransition(async () => {
            const order = orders.find((o) => o.id === id);
            await updateOrderAdmin(id, {
                status: uiStatusToDb(novoEstado),
                notes: order?.notas ?? "",
            });
            router.refresh();
        });
    };

    // Atualiza tipo local (mas não backend, pois não é suportado)
    const handleTipoChange = (id: number, novoTipo: string) => {
        setOrders((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, tipo: novoTipo as Order["tipo"] }
                    : item,
            ),
        );
    };

    const filteredPedidos = orders.filter((p) => {
        const query = searchQuery.toLowerCase();
        const matchSearch =
            p.cliente.toLowerCase().includes(query) ||
            p.numero.toLowerCase().includes(query) ||
            p.data.toLowerCase().includes(query) ||
            p.tipo.toLowerCase().includes(query) ||
            p.estado.toLowerCase().includes(query) ||
            p.telefone.toLowerCase().includes(query) ||
            p.notas.toLowerCase().includes(query);
        const matchEstado = filterEstado === "" || p.estado === filterEstado;
        return matchSearch && matchEstado;
    });

    const pedidosAtivos = orders.filter(
        (p) => p.estado !== "Entregue" && p.estado !== "Cancelado",
    ).length;
    const pedidosEntregues = orders.filter(
        (p) => p.estado === "Entregue",
    ).length;
    const totalPedidos = orders
        .filter((p) => p.estado !== "Cancelado")
        .reduce((sum, p) => sum + p.total, 0);

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
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSave = () => {
        if (editForm.id == null) return;
        startTransition(async () => {
            await updateOrderAdmin(editForm.id as number, {
                status: uiStatusToDb(editForm.estado as string),
                notes: (editForm.notas as string) || "",
            });
            setIsEditOpen(false);
            setSelectedPedido(null);
            router.refresh();
        });
    };

    return (
        <main className="admin-page">
            <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
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

            <section className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xs">
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
                        className="admin-input pl-10"
                    />
                </div>
            </section>

            <section className="mt-2 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap">
                {(
                    [
                        "",
                        "Em preparação",
                        "Pronto",
                        "Entregue",
                        "Cancelado",
                    ] as const
                ).map((estado) => (
                    <button
                        key={estado || "todos"}
                        onClick={() => setFilterEstado(estado)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                            filterEstado === estado
                                ? estado === ""
                                    ? "bg-orange-500 text-white"
                                    : getStatusColor(estado)
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        {estado || "Todos"}
                    </button>
                ))}
            </section>

            <section className="admin-table-scroll">
                <table className="min-w-[760px] w-full text-sm">
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
                                    <select
                                        value={pedido.tipo}
                                        onChange={(e) =>
                                            handleTipoChange(
                                                pedido.id,
                                                e.target.value,
                                            )
                                        }
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getTipoColor(pedido.tipo)}`}
                                    >
                                        <option value="Delivery">
                                            Delivery
                                        </option>
                                        <option value="Take-away">
                                            Take-away
                                        </option>
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        value={pedido.estado}
                                        onChange={(e) =>
                                            handleEstadoChange(
                                                pedido.id,
                                                e.target.value,
                                            )
                                        }
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(pedido.estado)}`}
                                    >
                                        <option value="Em preparação">
                                            Em preparação
                                        </option>
                                        <option value="Pronto">Pronto</option>
                                        <option value="Entregue">
                                            Entregue
                                        </option>
                                        <option value="Cancelado">
                                            Cancelado
                                        </option>
                                    </select>
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

            {/* MODAL VER PEDIDO */}
            {selectedPedido && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedPedido(null)}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold">
                                {selectedPedido.numero}
                            </h2>
                            <button
                                onClick={() => setSelectedPedido(null)}
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
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                            <div>
                                <p className="text-xs text-gray-500">
                                    Telefone
                                </p>
                                <p className="font-medium">
                                    {selectedPedido.telefone}
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
                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
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

            {/* MODAL EDITAR PEDIDO */}
            {isEditOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                    onClick={closeEditModal}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">Editar Pedido</h2>
                            <button
                                onClick={closeEditModal}
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

                        <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="text-xs text-gray-600 block mb-1">
                                        Número
                                    </label>
                                    <input
                                        value={editForm.numero ?? ""}
                                        disabled
                                        className="w-full border px-3 py-2 rounded bg-gray-50 text-gray-400 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 block mb-1">
                                        Tipo
                                    </label>
                                    <input
                                        value={editForm.tipo ?? ""}
                                        disabled
                                        className="w-full border px-3 py-2 rounded bg-gray-50 text-gray-400 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Cliente
                                </label>
                                <input
                                    value={editForm.cliente ?? ""}
                                    disabled
                                    className="w-full border px-3 py-2 rounded bg-gray-50 text-gray-400 text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="text-xs text-gray-600 block mb-1">
                                        Data
                                    </label>
                                    <input
                                        value={editForm.data ?? ""}
                                        disabled
                                        className="w-full border px-3 py-2 rounded bg-gray-50 text-gray-400 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 block mb-1">
                                        Hora
                                    </label>
                                    <input
                                        value={editForm.hora ?? ""}
                                        disabled
                                        className="w-full border px-3 py-2 rounded bg-gray-50 text-gray-400 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Estado{" "}
                                    <span className="text-orange-500">*</span>
                                </label>
                                <select
                                    name="estado"
                                    value={editForm.estado ?? "Em preparação"}
                                    onChange={handleEditChange}
                                    className="w-full border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-orange-400"
                                >
                                    <option value="Em preparação">
                                        Em preparação
                                    </option>
                                    <option value="Pronto">Pronto</option>
                                    <option value="Entregue">Entregue</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 block mb-1">
                                    Notas
                                </label>
                                <textarea
                                    name="notas"
                                    value={editForm.notas ?? ""}
                                    onChange={handleEditChange}
                                    rows={3}
                                    className="w-full border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-orange-400"
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                                <button
                                    onClick={handleEditSave}
                                    disabled={isPending}
                                    className="flex-1 py-2 bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPending ? "A guardar..." : "Guardar"}
                                </button>
                                <button
                                    onClick={closeEditModal}
                                    disabled={isPending}
                                    className="flex-1 py-2 border rounded-lg disabled:cursor-not-allowed"
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
