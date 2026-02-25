"use client";

import { useState } from "react";
import {
    SquaresPlusIcon,
    ArrowTrendingUpIcon,
    UsersIcon,
    ShoppingBagIcon,
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
    const [timeRange, setTimeRange] = useState("semana");

    const stats = {
        vendas: "€2.450,00",
        utilizadores: "128",
        pedidos: "7",
    };

    const [recentes, setRecentes] = useState([
        {
            id: 1,
            mesa: "#12",
            cliente: "João Silva",
            total: "€48,90",
            estado: "Em preparação",
            hora: "19:42",
        },
        {
            id: 2,
            mesa: "#5",
            cliente: "Maria Costa",
            total: "€32,10",
            estado: "Pronto",
            hora: "19:30",
        },
        {
            id: 3,
            mesa: "#18",
            cliente: "Alexandre P.",
            total: "€21,50",
            estado: "Cancelado",
            hora: "19:20",
        },
    ]);

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
            case "Concluído":
                return "bg-emerald-100 text-emerald-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleEstadoChange = (id: number, novoEstado: string) => {
        setRecentes((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, estado: novoEstado } : item,
            ),
        );
        // Aqui pode chamar uma API para atualizar no backend
    };

    return (
        <main className="p-6 space-y-6">
            <header className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl shadow">
                    <SquaresPlusIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-sm text-gray-600">
                        Visão geral do desempenho do restaurante
                    </p>
                </div>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase">Vendas</p>
                            <p className="text-2xl font-bold">{stats.vendas}</p>
                        </div>
                        <ArrowTrendingUpIcon className="h-8 w-8 opacity-80" />
                    </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase">Utilizadores</p>
                            <p className="text-2xl font-bold">
                                {stats.utilizadores}
                            </p>
                        </div>
                        <UsersIcon className="h-8 w-8 opacity-80" />
                    </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase">
                                Pedidos Pendentes
                            </p>
                            <p className="text-2xl font-bold">
                                {stats.pedidos}
                            </p>
                        </div>
                        <ShoppingBagIcon className="h-8 w-8 opacity-80" />
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow border p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">
                            Vendas da Semana
                        </h2>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="hoje">Hoje</option>
                            <option value="semana">Esta semana</option>
                            <option value="15dias">Últimos 15 dias</option>
                            <option value="mes">Último mês</option>
                            <option value="6meses">Últimos 6 meses</option>
                            <option value="12meses">Últimos 12 meses</option>
                        </select>
                    </div>
                    <div className="flex h-56 items-end justify-center rounded-lg bg-gradient-to-b from-blue-50 to-slate-100 text-sm text-slate-400 gap-2 px-4 overflow-x-auto transition-all duration-500">
                        {/* Gráfico de barras profissional com gradiente, animação e valores acima */}
                        {(() => {
                            type Bar = { label: string; value: number };
                            let bars: Bar[];
                            switch (timeRange) {
                                case "hoje":
                                    bars = [{ label: "Hoje", value: 8 }];
                                    break;
                                case "semana":
                                    bars = [
                                        { label: "Seg", value: 4 },
                                        { label: "Ter", value: 7 },
                                        { label: "Qua", value: 3 },
                                        { label: "Qui", value: 6 },
                                        { label: "Sex", value: 9 },
                                        { label: "Sáb", value: 12 },
                                        { label: "Dom", value: 8 },
                                    ];
                                    break;
                                case "15dias":
                                    bars = [
                                        { label: "1", value: 5 },
                                        { label: "2", value: 6 },
                                        { label: "3", value: 7 },
                                        { label: "4", value: 8 },
                                        { label: "5", value: 6 },
                                        { label: "6", value: 9 },
                                        { label: "7", value: 10 },
                                        { label: "8", value: 7 },
                                        { label: "9", value: 8 },
                                        { label: "10", value: 11 },
                                        { label: "11", value: 9 },
                                        { label: "12", value: 12 },
                                        { label: "13", value: 8 },
                                        { label: "14", value: 10 },
                                        { label: "15", value: 13 },
                                    ];
                                    break;
                                case "mes":
                                    bars = [
                                        { label: "1", value: 7 },
                                        { label: "2", value: 8 },
                                        { label: "3", value: 6 },
                                        { label: "4", value: 10 },
                                        { label: "5", value: 12 },
                                        { label: "6", value: 9 },
                                        { label: "7", value: 11 },
                                        { label: "8", value: 8 },
                                        { label: "9", value: 7 },
                                        { label: "10", value: 13 },
                                        { label: "11", value: 9 },
                                        { label: "12", value: 12 },
                                        { label: "13", value: 8 },
                                        { label: "14", value: 10 },
                                        { label: "15", value: 13 },
                                        { label: "16", value: 7 },
                                        { label: "17", value: 8 },
                                        { label: "18", value: 6 },
                                        { label: "19", value: 10 },
                                        { label: "20", value: 12 },
                                        { label: "21", value: 9 },
                                        { label: "22", value: 11 },
                                        { label: "23", value: 8 },
                                        { label: "24", value: 7 },
                                        { label: "25", value: 13 },
                                        { label: "26", value: 9 },
                                        { label: "27", value: 12 },
                                        { label: "28", value: 8 },
                                        { label: "29", value: 10 },
                                        { label: "30", value: 13 },
                                    ];
                                    break;
                                case "6meses":
                                    bars = [
                                        { label: "Set", value: 11 },
                                        { label: "Out", value: 17 },
                                        { label: "Nov", value: 8 },
                                        { label: "Dez", value: 20 },
                                        { label: "Jan", value: 12 },
                                        { label: "Fev", value: 9 },
                                    ];
                                    break;
                                case "12meses":
                                    bars = [
                                        { label: "Jan", value: 12 },
                                        { label: "Fev", value: 9 },
                                        { label: "Mar", value: 14 },
                                        { label: "Abr", value: 10 },
                                        { label: "Mai", value: 16 },
                                        { label: "Jun", value: 13 },
                                        { label: "Jul", value: 18 },
                                        { label: "Ago", value: 15 },
                                        { label: "Set", value: 11 },
                                        { label: "Out", value: 17 },
                                        { label: "Nov", value: 8 },
                                        { label: "Dez", value: 20 },
                                    ];
                                    break;
                                default:
                                    bars = [];
                            }
                            const maxValue = Math.max(
                                ...bars.map((b) => b.value),
                                1,
                            );
                            return bars.map((bar) => (
                                <div
                                    key={bar.label}
                                    className="flex flex-col items-center group w-8"
                                >
                                    <span className="mb-2 text-xs font-bold text-blue-700 opacity-90 group-hover:scale-110 transition-transform duration-200">
                                        {bar.value}
                                    </span>
                                    <div
                                        className="w-7 rounded-t-lg shadow-md relative flex items-end justify-center cursor-pointer transition-all duration-500"
                                        style={{
                                            height: `${(bar.value / maxValue) * 160 + 20}px`,
                                            background:
                                                "linear-gradient(180deg, #3b82f6 0%, #60a5fa 60%, #a5b4fc 100%)",
                                            boxShadow:
                                                "0 4px 16px 0 rgba(59,130,246,0.10)",
                                            position: "relative",
                                        }}
                                    >
                                        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/30 rounded-b-lg" />
                                        {/* efeito de brilho */}
                                        <div className="absolute top-1 left-1 w-4/5 h-2 bg-white/40 rounded-full blur-sm opacity-60" />
                                    </div>
                                    <span className="mt-1 text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                                        {bar.label}
                                    </span>
                                </div>
                            ));
                        })()}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow border p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Top Categorias
                    </h2>
                    <ul className="space-y-3">
                        <li className="flex items-center justify-between text-sm">
                            <span>Pratos Principais</span>
                            <span className="font-semibold">48%</span>
                        </li>
                        <li className="flex items-center justify-between text-sm">
                            <span>Entradas</span>
                            <span className="font-semibold">27%</span>
                        </li>
                        <li className="flex items-center justify-between text-sm">
                            <span>Sobremesas</span>
                            <span className="font-semibold">25%</span>
                        </li>
                    </ul>

                    <div className="mt-6 pt-4 border-t">
                        <h3 className="text-sm font-semibold mb-3">
                            Taxa de Ocupação
                        </h3>
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span>Hoje</span>
                            <span className="font-semibold text-green-600">
                                82%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full w-4/5" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow border overflow-x-auto">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold">
                            Pedidos Recentes
                        </h2>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">Mesa</th>
                                <th className="px-6 py-3 text-left">Cliente</th>
                                <th className="px-6 py-3 text-left">Total</th>
                                <th className="px-6 py-3 text-left">Estado</th>
                                <th className="px-6 py-3 text-left">Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentes.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="px-6 py-3 font-medium">
                                        {item.mesa}
                                    </td>
                                    <td className="px-6 py-3">
                                        {item.cliente}
                                    </td>
                                    <td className="px-6 py-3 font-semibold">
                                        {item.total}
                                    </td>
                                    <td className="px-6 py-3">
                                        <select
                                            value={item.estado}
                                            onChange={(e) =>
                                                handleEstadoChange(
                                                    item.id,
                                                    e.target.value,
                                                )
                                            }
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.estado)}`}
                                        >
                                            <option value="Em preparação">
                                                Em preparação
                                            </option>
                                            <option value="Pronto">
                                                Pronto
                                            </option>
                                            <option value="Entregue">
                                                Entregue
                                            </option>
                                            <option value="Cancelado">
                                                Cancelado
                                            </option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-3 text-gray-600">
                                        {item.hora}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white rounded-2xl shadow border p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Atividade Recente
                    </h2>
                    <ul className="space-y-3">
                        <li className="flex justify-between text-sm pb-3 border-b">
                            <div>
                                <p className="font-medium">
                                    Novo utilizador registado
                                </p>
                                <p className="text-xs text-gray-500">
                                    carolina@exemplo.com
                                </p>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                há 5 min
                            </span>
                        </li>
                        <li className="flex justify-between text-sm pb-3 border-b">
                            <div>
                                <p className="font-medium">
                                    Reserva confirmada
                                </p>
                                <p className="text-xs text-gray-500">
                                    Mesa para 4 às 20:00
                                </p>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                há 12 min
                            </span>
                        </li>
                        <li className="flex justify-between text-sm">
                            <div>
                                <p className="font-medium">Stock atualizado</p>
                                <p className="text-xs text-gray-500">
                                    Queijo feta +12 unidades
                                </p>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                há 30 min
                            </span>
                        </li>
                    </ul>
                </div>
            </section>
        </main>
    );
}
