"use client";

import { useState } from "react";
import {
    CurrencyEuroIcon,
    ArrowTrendingUpIcon,
    ShoppingCartIcon,
} from "@heroicons/react/24/outline";

type Sale = {
    id: number;
    numero: string;
    cliente: string;
    total: number;
    itens: number;
    data: string;
    hora: string;
    metodo: "Cartão" | "Dinheiro" | "Multibanco" | "MB Way";
};

const vendasSeed: Sale[] = [
    {
        id: 1,
        numero: "#VND-001",
        cliente: "Ana Martins",
        total: 65.5,
        itens: 3,
        data: "2026-02-12",
        hora: "12:30",
        metodo: "Cartão",
    },
    {
        id: 2,
        numero: "#VND-002",
        cliente: "Pedro Silva",
        total: 42.0,
        itens: 2,
        data: "2026-02-12",
        hora: "14:15",
        metodo: "Dinheiro",
    },
    {
        id: 3,
        numero: "#VND-003",
        cliente: "Maria Santos",
        total: 89.99,
        itens: 4,
        data: "2026-02-12",
        hora: "19:45",
        metodo: "MB Way",
    },
];

const metodoColor = (m: Sale["metodo"]) => {
    switch (m) {
        case "Cartão":
            return "bg-blue-100 text-blue-800";
        case "Dinheiro":
            return "bg-green-100 text-green-800";
        case "Multibanco":
            return "bg-yellow-100 text-yellow-800";
        case "MB Way":
            return "bg-pink-100 text-pink-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export default function SalesPage() {
    const [q, setQ] = useState("");
    const [selected, setSelected] = useState<Sale | null>(null);
    const [editing, setEditing] = useState<Sale | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    const [vendas, setVendas] = useState<Sale[]>(vendasSeed);

    const filtered = vendas.filter((v) => {
        const query = q.toLowerCase();
        return (
            v.cliente.toLowerCase().includes(query) ||
            v.numero.toLowerCase().includes(query) ||
            v.data.toLowerCase().includes(query) ||
            v.hora.toLowerCase().includes(query) ||
            v.metodo.toLowerCase().includes(query) ||
            v.total.toString().includes(query) ||
            v.itens.toString().includes(query)
        );
    });

    const totalVendas = vendas.reduce((s, v) => s + v.total, 0);
    const totalItens = vendas.reduce((s, v) => s + v.itens, 0);
    const media =
        vendas.length > 0 ? (totalVendas / vendas.length).toFixed(2) : "0.00";

    const handleMetodoChange = (id: number, novoMetodo: Sale["metodo"]) => {
        setVendas((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, metodo: novoMetodo } : item,
            ),
        );
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
                                €{totalVendas.toFixed(2)}
                            </p>
                        </div>
                        <CurrencyEuroIcon className="h-8 w-8 opacity-80" />
                    </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase">Média por venda</p>
                            <p className="text-2xl font-bold">€{media}</p>
                        </div>
                        <ArrowTrendingUpIcon className="h-8 w-8 opacity-80" />
                    </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase">Total Itens</p>
                            <p className="text-2xl font-bold">{totalItens}</p>
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
                <button
                    className="py-2 px-4 rounded-lg bg-purple-600 text-white shadow hover:bg-purple-700 transition text-sm"
                    onClick={() => setShowCreate(true)}
                >
                    Nova Venda
                </button>
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
                        {filtered.map((v) => (
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
                                                e.target
                                                    .value as Sale["metodo"],
                                            )
                                        }
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${metodoColor(v.metodo)}`}
                                    >
                                        <option value="Cartão">Cartão</option>
                                        <option value="Dinheiro">
                                            Dinheiro
                                        </option>
                                        <option value="Multibanco">
                                            Multibanco
                                        </option>
                                        <option value="MB Way">MB Way</option>
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
                        <h2 className="text-xl font-bold mb-4">Editar Venda</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setEditing(null);
                                setSelected(null);
                                // Adicione lógica para atualizar a venda aqui
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
                                    Cliente
                                </label>
                                <input
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
                                    type="number"
                                    defaultValue={editing.total}
                                    className="w-full border rounded-lg px-3 py-2"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Itens
                                </label>
                                <input
                                    type="number"
                                    defaultValue={editing.itens}
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
                                    Método
                                </label>
                                <select
                                    defaultValue={editing.metodo}
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="Cartão">Cartão</option>
                                    <option value="Dinheiro">Dinheiro</option>
                                    <option value="Multibanco">
                                        Multibanco
                                    </option>
                                    <option value="MB Way">MB Way</option>
                                </select>
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
                                    className="flex-1 py-2 rounded-lg bg-purple-600 text-white"
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
                        <h2 className="text-xl font-bold mb-4">Nova Venda</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setShowCreate(false);
                                // Adicione lógica para criar a venda aqui
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
                                    Cliente
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Total
                                </label>
                                <input
                                    type="number"
                                    className="w-full border rounded-lg px-3 py-2"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">
                                    Itens
                                </label>
                                <input
                                    type="number"
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
                                    Método
                                </label>
                                <select className="w-full border rounded-lg px-3 py-2">
                                    <option value="Cartão">Cartão</option>
                                    <option value="Dinheiro">Dinheiro</option>
                                    <option value="Multibanco">
                                        Multibanco
                                    </option>
                                    <option value="MB Way">MB Way</option>
                                </select>
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
                                    className="flex-1 py-2 rounded-lg bg-purple-600 text-white"
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
