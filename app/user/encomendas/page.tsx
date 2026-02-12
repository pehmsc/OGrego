import { getCurrentUserDb } from "@/app/lib/current-user";
import { getUserOrders, getUserOrderStats } from "@/app/lib/orders";
import UserPageLayout from "@/app/ui/components/user/UserPageLayout";
import OrderSummaryCard from "@/app/ui/components/user/OrderSummaryCard";
import Link from "next/link";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export default async function EncomendasPage() {
    const userDb = await getCurrentUserDb();

    // ✅ Dados reais da BD
    const orders = await getUserOrders(userDb.id);
    const stats = await getUserOrderStats(userDb.id);

    return (
        <UserPageLayout
            sidebar={
                <OrderSummaryCard
                    totalOrders={stats.totalOrders}
                    totalSpent={stats.totalSpent}
                    lastOrder={stats.lastOrder ?? "Sem encomendas"}
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
                                            Total
                                        </th>
                                        <th className="pb-3 text-left text-sm font-medium text-zinc-600/70">
                                            Pontos
                                        </th>
                                        <th className="pb-3 text-left text-sm font-medium text-zinc-600/70">
                                            Estado
                                        </th>
                                        <th className="pb-3 text-left text-sm font-medium text-zinc-600/70"></th>
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
                                                            "delivered" ||
                                                        order.status ===
                                                            "Entregue"
                                                            ? "bg-green-100 text-green-700"
                                                            : order.status ===
                                                                    "cancelled" ||
                                                                order.status ===
                                                                    "Cancelado"
                                                              ? "bg-red-100 text-red-700"
                                                              : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                                >
                                                    {order.status === "pending"
                                                        ? "Pendente"
                                                        : order.status ===
                                                            "delivered"
                                                          ? "Entregue"
                                                          : order.status ===
                                                              "cancelled"
                                                            ? "Cancelado"
                                                            : order.status}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <Link
                                                    href={`/user/encomendas/${order.id}/recibo`}
                                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1E3A8A] px-4 py-2 text-xs font-medium text-white transition-all hover:-translate-y-[1px] hover:bg-[#162F73]"
                                                >
                                                    <DocumentTextIcon className="h-4 w-4" />
                                                    Ver Recibo
                                                </Link>
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
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-sm font-medium text-[#1E3A8A]">
                                            #{order.id}
                                        </span>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                order.status === "delivered" ||
                                                order.status === "Entregue"
                                                    ? "bg-green-100 text-green-700"
                                                    : order.status ===
                                                            "cancelled" ||
                                                        order.status ===
                                                            "Cancelado"
                                                      ? "bg-red-100 text-red-700"
                                                      : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {order.status === "pending"
                                                ? "Pendente"
                                                : order.status === "delivered"
                                                  ? "Entregue"
                                                  : order.status === "cancelled"
                                                    ? "Cancelado"
                                                    : order.status}
                                        </span>
                                    </div>

                                    <p className="mb-2 text-xs text-zinc-600/70">
                                        {order.date}
                                    </p>

                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-sm font-medium text-[#1E3A8A]">
                                            {order.total.toFixed(2)} EUR
                                        </span>
                                        <span className="text-xs text-zinc-600">
                                            +{order.points} pts
                                        </span>
                                    </div>

                                    <Link
                                        href={`/user/encomendas/${order.id}/recibo`}
                                        className="flex h-10 w-full items-center justify-center rounded-full bg-[#1E3A8A] text-xs font-medium text-white transition-all hover:bg-[#162F73]"
                                    >
                                        Ver Recibo
                                    </Link>
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
