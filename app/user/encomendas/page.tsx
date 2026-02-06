import { getCurrentUserDb } from "@/app/lib/current-user";
import UserPageLayout from "@/app/ui/components/user/UserPageLayout";
import OrderSummaryCard from "@/app/ui/components/user/OrderSummaryCard";

// TODO: Descomentar quando criares as tabelas no Neon
// import { getUserOrders, getUserOrderStats } from "@/app/lib/orders";

export default async function EncomendasPage() {
    const userDb = await getCurrentUserDb();

    // ========== TODO: DESCOMENTAR QUANDO TIVERES TABELAS ==========
    // const orders = await getUserOrders(userDb.id);
    // const stats = await getUserOrderStats(userDb.id);
    // ===============================================================

    // ========== MOCK DATA - APAGAR DEPOIS ==========
    const stats = {
        totalOrders: 12,
        totalSpent: 145.5,
        lastOrder: "5 de Fev, 2026",
    };

    const orders = [
        {
            id: 1,
            date: "5 Fev 2026",
            total: 23.5,
            points: 23,
            status: "Entregue",
            items: "Moussaka, Tzatziki",
        },
        {
            id: 2,
            date: "28 Jan 2026",
            total: 45.0,
            points: 45,
            status: "Entregue",
            items: "Souvlaki de Frango, Baklava",
        },
        {
            id: 3,
            date: "15 Jan 2026",
            total: 32.0,
            points: 32,
            status: "Entregue",
            items: "Giouvetsi, Spanakopita",
        },
        {
            id: 4,
            date: "3 Jan 2026",
            total: 28.5,
            points: 28,
            status: "Cancelado",
            items: "Kleftiko",
        },
        {
            id: 5,
            date: "20 Dez 2025",
            total: 16.5,
            points: 16,
            status: "Entregue",
            items: "Hummus, Dolmades",
        },
    ];
    // ========== FIM MOCK DATA ==========

    return (
        <UserPageLayout
            sidebar={
                <OrderSummaryCard
                    totalOrders={stats.totalOrders}
                    totalSpent={stats.totalSpent}
                    lastOrder={stats.lastOrder}
                />
            }
        >
            <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-8 shadow-sm">
                <h2 className="mb-6 text-2xl font-semibold text-[#1E3A8A]">
                    Histórico de Encomendas
                </h2>

                {orders.length > 0 ? (
                    <>
                        {/* Tabela Desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#1E3A8A]/10">
                                        <th className="pb-3 text-left text-sm font-medium text-zinc-600/70">
                                            Nº Encomenda
                                        </th>
                                        <th className="pb-3 text-left text-sm font-medium text-zinc-600/70">
                                            Data
                                        </th>
                                        <th className="pb-3 text-left text-sm font-medium text-zinc-600/70">
                                            Itens
                                        </th>
                                        <th className="pb-3 text-left text-sm font-medium text-zinc-600/70">
                                            Total
                                        </th>
                                        <th className="pb-3 text-left text-sm font-medium text-zinc-600/70">
                                            Pontos
                                        </th>
                                        <th className="pb-3 text-left text-sm font-medium text-zinc-600/70">
                                            Estado
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-[#1E3A8A]/5 transition-colors hover:bg-[#F4F7FB]"
                                        >
                                            <td className="py-4 text-sm font-medium text-[#1E3A8A]">
                                                #{order.id}
                                            </td>
                                            <td className="py-4 text-sm text-zinc-600">
                                                {order.date}
                                            </td>
                                            <td className="py-4 text-sm text-zinc-600 max-w-xs truncate">
                                                {order.items}
                                            </td>
                                            <td className="py-4 text-sm font-medium text-[#1E3A8A]">
                                                {order.total.toFixed(2)} EUR
                                            </td>
                                            <td className="py-4 text-sm text-zinc-600">
                                                +{order.points} pts
                                            </td>
                                            <td className="py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        order.status ===
                                                            "Entregue" ||
                                                        order.status ===
                                                            "delivered"
                                                            ? "bg-green-100 text-green-700"
                                                            : order.status ===
                                                                    "Cancelado" ||
                                                                order.status ===
                                                                    "cancelled"
                                                              ? "bg-red-100 text-red-700"
                                                              : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Cards Mobile */}
                        <div className="space-y-4 md:hidden">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="rounded-2xl border border-[#1E3A8A]/10 bg-white p-4"
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-medium text-[#1E3A8A]">
                                            #{order.id}
                                        </span>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                order.status === "Entregue" ||
                                                order.status === "delivered"
                                                    ? "bg-green-100 text-green-700"
                                                    : order.status ===
                                                            "Cancelado" ||
                                                        order.status ===
                                                            "cancelled"
                                                      ? "bg-red-100 text-red-700"
                                                      : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="mb-1 text-xs text-zinc-600/70">
                                        {order.date}
                                    </p>
                                    <p className="mb-2 text-sm text-zinc-600">
                                        {order.items}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-[#1E3A8A]">
                                            {order.total.toFixed(2)} EUR
                                        </span>
                                        <span className="text-xs text-zinc-600">
                                            +{order.points} pts
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="py-12 text-center">
                        <p className="text-zinc-600/70">
                            Ainda não fez nenhuma encomenda
                        </p>
                    </div>
                )}
            </div>
        </UserPageLayout>
    );
}
