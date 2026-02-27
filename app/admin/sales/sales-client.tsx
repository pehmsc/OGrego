"use client";

import { useState, useTransition } from "react";
import {
    CurrencyEuroIcon,
    ArrowTrendingUpIcon,
    ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import type { Sale, SalesStats } from "@/app/lib/admin-actions";
import {
    updateSalePaymentMethod,
    updateSaleAdmin,
} from "@/app/lib/admin-actions";
import { useRouter } from "next/navigation";

const metodoColor = (m: string) => {
    switch (m) {
        case "Cartão":
        case "card":
            return "bg-blue-100 text-blue-800";
        case "Dinheiro":
        case "cash":
            return "bg-green-100 text-green-800";
        case "Multibanco":
        case "multibanco":
            return "bg-yellow-100 text-yellow-800";
        case "MB Way":
        case "mbway":
            return "bg-pink-100 text-pink-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

type Props = {
    vendas: Sale[];
    stats: SalesStats;
};

export default function SalesClient({ vendas, stats }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [q, setQ] = useState("");
    const [selected, setSelected] = useState<Sale | null>(null);
    const [editing, setEditing] = useState<Sale | null>(null);

    const filtered = vendas.filter((v) => {
        const query = q.toLowerCase();
        return (
            v.cliente.toLowerCase().includes(query) ||
            v.numero.toLowerCase().includes(query) ||
            v.data.includes(query) ||
            v.hora.includes(query) ||
            v.metodo.toLowerCase().includes(query) ||
            String(v.total).includes(query)
        );
    });

    const handleMetodoChange = (id: number, novoMetodo: string) => {
        startTransition(async () => {
            await updateSalePaymentMethod(id, novoMetodo);
            router.refresh();
        });
    };

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editing) return;

        const form = e.currentTarget;
        const data = {
            customer_name: (
                form.elements.namedItem("cliente") as HTMLInputElement
            ).value,
            total_cents: Math.round(
                parseFloat(
                    (form.elements.namedItem("total") as HTMLInputElement)
                        .value,
                ) * 100,
            ),
            payment_method: (
                form.elements.namedItem("metodo") as HTMLSelectElement
            ).value,
            notes: (form.elements.namedItem("notas") as HTMLTextAreaElement)
                .value,
        };

        startTransition(async () => {
            await updateSaleAdmin(editing.id, data);
            setEditing(null);
            setSelected(null);
            router.refresh();
        });
    };

    return (
        <main className="p-6 space-y-6">
            <header className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow">
                    <CurrencyEuroIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Gestão de Vendas</h1>
                    <p className="text-sm text-gray-600">
                        Resumo de transações e recibos
                    </p>
                </div>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase">Total Vendas</p>
                            <p className="text-2xl font-bold">
                                €{stats.totalVendas.toFixed(2)}
                            </p>
                        </div>
                        <CurrencyEuroIcon className="h-8 w-8 opacity-80" />
                    </div>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase">Média por venda</p>
                            <p className="text-2xl font-bold">
                                €{stats.mediaVenda.toFixed(2)}
                            </p>
                        </div>
                        <ArrowTrendingUpIcon className="h-8 w-8 opacity-80" />
                    </div>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase">Total Itens</p>
                            <p className="text-2xl font-bold">
                                {stats.totalItens}
                            </p>
                        </div>
                        <ShoppingCartIcon className="h-8 w-8 opacity-80" />
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
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="w-56 pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white/90 focus:ring-2 focus:ring-purple-400"
                    />
                </div>
            </section>

            <section className="bg-white rounded-2xl shadow border overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Número</th>
                            <th className="px-4 py-3 text-left">Cliente</th>
                            <th className="px-4 py-3 text-left">Total</th>
                            <th className="px-4 py-3 text-left">Itens</th>
                            <th className="px-4 py-3 text-left">Data</th>
                            <th className="px-4 py-3 text-left">Método</th>
                            <th className="px-4 py-3 text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-8 text-center text-gray-400"
                                >
                                    Sem vendas encontradas.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((v) => (
                                <tr
                                    key={v.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">{v.numero}</td>
                                    <td className="px-4 py-3">{v.cliente}</td>
                                    <td className="px-4 py-3 font-semibold">
                                        €{v.total.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3">{v.itens}</td>
                                    <td className="px-4 py-3">{v.data}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={v.metodo}
                                            onChange={(e) =>
                                                handleMetodoChange(
                                                    v.id,
                                                    e.target.value,
                                                )
                                            }
                                            disabled={isPending}
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${metodoColor(v.metodo)}`}
                                        >
                                            <option value="Cartão">
                                                Cartão
                                            </option>
                                            <option value="card">Cartão</option>
                                            <option value="Dinheiro">
                                                Dinheiro
                                            </option>
                                            <option value="cash">
                                                Dinheiro
                                            </option>
                                            <option value="Multibanco">
                                                Multibanco
                                            </option>
                                            <option value="multibanco">
                                                Multibanco
                                            </option>
                                            <option value="MB Way">
                                                MB Way
                                            </option>
                                            <option value="mbway">
                                                MB Way
                                            </option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            className="text-purple-600"
                                            onClick={() => setSelected(v)}
                                        >
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>

            {/* Modal: Ver detalhes */}
            {selected && !editing && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow max-w-lg w-full p-6 overflow-y-auto max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold">
                                {selected.numero}
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
                                <p className="text-xs text-gray-500">Cliente</p>
                                <p className="font-medium">
                                    {selected.cliente}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Total</p>
                                <p className="font-medium">
                                    €{selected.total.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Itens</p>
                                <p className="font-medium">{selected.itens}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Método</p>
                                <p className="font-medium">{selected.metodo}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setSelected(null)}
                                className="flex-1 py-2 rounded-lg border"
                            >
                                Fechar
                            </button>
                            <button
                                className="flex-1 py-2 rounded-lg bg-purple-600 text-white"
                                onClick={() => setEditing(selected)}
                            >
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Editar */}
            {editing && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
                    onClick={() => {
                        setEditing(null);
                        setSelected(null);
                    }}
                >
                    <div
                        className="bg-white rounded-2xl shadow max-w-lg w-full p-6 overflow-y-auto max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">Editar Venda</h2>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500">
                                    Número
                                </label>
                                <input
                                    type="text"
                                    defaultValue={editing.numero}
                                    className="w-full border rounded-lg px-3 py-2"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Cliente
                                </label>
                                <input
                                    name="cliente"
                                    type="text"
                                    defaultValue={editing.cliente}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Total
                                </label>
                                <input
                                    name="total"
                                    type="number"
                                    defaultValue={editing.total}
                                    className="w-full border rounded-lg px-3 py-2"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Método
                                </label>
                                <select
                                    name="metodo"
                                    defaultValue={editing.metodo}
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="Cartão">Cartão</option>
                                    <option value="card">Cartão</option>
                                    <option value="Dinheiro">Dinheiro</option>
                                    <option value="cash">Dinheiro</option>
                                    <option value="Multibanco">
                                        Multibanco
                                    </option>
                                    <option value="multibanco">
                                        Multibanco
                                    </option>
                                    <option value="MB Way">MB Way</option>
                                    <option value="mbway">MB Way</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Notas
                                </label>
                                <textarea
                                    name="notas"
                                    defaultValue={editing.notes ?? ""}
                                    rows={2}
                                    className="w-full border rounded-lg px-3 py-2 resize-none"
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
                                    disabled={isPending}
                                    className="flex-1 py-2 rounded-lg bg-purple-600 text-white disabled:opacity-50"
                                >
                                    {isPending ? "A guardar..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
