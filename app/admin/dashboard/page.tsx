import StatCard from "@/app/ui/components/StatCard";

export default function Page() {
    return (
        <div className="space-y-8">
            {/* Cabeçalho */}
            <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Geral Admin Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Visão geral do desempenho do restaurante hoje.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                        Exportar Relatório
                    </button>
                </div>
            </header>

            {/* Cards de estatísticas */}
            <section className="grid gap-4 md:grid-cols-3">
                <StatCard title="Vendas" value="€2.450,00" />
                <StatCard title="Utilizadores Ativos" value="128" />
                <StatCard title="Pedidos Pendentes" value="7" />
            </section>

            {/* Gráfico + resumo */}
            <section className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border bg-white p-4 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between pb-3">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                            Vendas da Semana
                        </h2>
                        <select className="rounded-md border px-2 py-1 text-xs text-gray-600">
                            <option>Hoje</option>
                            <option>Esta semana</option>
                            <option>Últimos 15 dias</option>
                            <option>Último mês</option>
                            <option>Últimos 6 meses</option>
                            <option>Últimos 12 meses</option>
                        </select>
                    </div>
                    {/* Placeholder para gráfico */}
                    <div className="flex h-52 items-center justify-center rounded-lg bg-slate-50 text-xs text-slate-400">
                        Área do gráfico (Line / Bar chart)
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-gray-600">
                            Top Categorias
                        </h2>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center justify-between">
                                <span>Pratos Principais</span>
                                <span className="font-semibold">48%</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>Entradas</span>
                                <span className="font-semibold">27%</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>Sobremesas</span>
                                <span className="font-semibold">25%</span>
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-gray-600">
                            Taxa de Ocupação
                        </h2>
                        <div className="mb-2 flex items-center justify-between text-xs">
                            <span>Hoje</span>
                            <span className="font-semibold text-green-600">
                                82%
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100">
                            <div className="h-2 w-4/5 rounded-full bg-green-500" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabela de pedidos + atividades */}
            <section className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border bg-white p-4 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between pb-3">
                        <h2 className="text-sm font-semibold text-gray-600">
                            Pedidos Recentes
                        </h2>
                        <button className="text-xs font-medium text-blue-600 hover:underline">
                            Ver todos
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="border-b text-xs text-gray-500">
                                <tr>
                                    <th className="py-2">Mesa</th>
                                    <th className="py-2">Cliente</th>
                                    <th className="py-2">Total</th>
                                    <th className="py-2">Estado</th>
                                    <th className="py-2 text-right">Hora</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-xs">
                                <tr>
                                    <td className="py-2">#12</td>
                                    <td className="py-2">João Silva</td>
                                    <td className="py-2 font-semibold">
                                        €48,90
                                    </td>
                                    <td className="py-2">
                                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                                            Em preparação
                                        </span>
                                    </td>
                                    <td className="py-2 text-right text-gray-500">
                                        19:42
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2">#5</td>
                                    <td className="py-2">Maria Costa</td>
                                    <td className="py-2 font-semibold">
                                        €32,10
                                    </td>
                                    <td className="py-2">
                                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                                            Concluído
                                        </span>
                                    </td>
                                    <td className="py-2 text-right text-gray-500">
                                        19:30
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2">#18</td>
                                    <td className="py-2">Alexandre P.</td>
                                    <td className="py-2 font-semibold">
                                        €21,50
                                    </td>
                                    <td className="py-2">
                                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
                                            Cancelado
                                        </span>
                                    </td>
                                    <td className="py-2 text-right text-gray-500">
                                        19:20
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-xl border bg-white p-4 shadow-sm">
                    <h2 className="mb-3 text-sm font-semibold text-gray-600">
                        Atividade Recente
                    </h2>
                    <ul className="space-y-3 text-xs">
                        <li className="flex justify-between">
                            <div>
                                <p className="font-medium">
                                    Novo utilizador registado
                                </p>
                                <p className="text-gray-500">
                                    carolina@exemplo.com
                                </p>
                            </div>
                            <span className="text-gray-400">há 5 min</span>
                        </li>
                        <li className="flex justify-between">
                            <div>
                                <p className="font-medium">
                                    Reserva confirmada
                                </p>
                                <p className="text-gray-500">
                                    Mesa para 4 às 20:00
                                </p>
                            </div>
                            <span className="text-gray-400">há 12 min</span>
                        </li>
                        <li className="flex justify-between">
                            <div>
                                <p className="font-medium">Stock atualizado</p>
                                <p className="text-gray-500">
                                    Queijo feta +12 unidades
                                </p>
                            </div>
                            <span className="text-gray-400">há 30 min</span>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
