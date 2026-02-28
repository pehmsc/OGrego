interface OrderSummaryCardProps {
    totalOrders: number;
    totalSpent: number;
    lastOrder?: string;
}

export default function OrderSummaryCard({
    totalOrders,
    totalSpent,
    lastOrder,
}: OrderSummaryCardProps) {
    return (
        <div className="site-card p-6 sm:p-8">
            <h3 className="mb-6 text-2xl font-semibold text-[#1E3A8A]">
                Resumo de Encomendas
            </h3>

            <div className="space-y-6">
                {/* Total de Encomendas */}
                <div>
                    <p className="text-sm font-medium text-zinc-600/70">
                        Total de Encomendas
                    </p>
                    <p className="text-3xl font-bold text-[#1E3A8A]">
                        {totalOrders}
                    </p>
                </div>

                {/* Total Gasto */}
                <div>
                    <p className="text-sm font-medium text-zinc-600/70">
                        Total Gasto
                    </p>
                    <p className="text-3xl font-bold text-[#1E3A8A]">
                        {totalSpent.toFixed(2)} EUR
                    </p>
                </div>

                {/* Última Encomenda */}
                {lastOrder && (
                    <div>
                        <p className="text-sm font-medium text-zinc-600/70">
                            Última Encomenda
                        </p>
                        <p className="text-lg text-[#1E3A8A]">{lastOrder}</p>
                    </div>
                )}

                {/* Pontos Ganhos */}
                <div className="rounded-2xl bg-yellow-50 p-4 dark:bg-amber-500/10">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl text-yellow-600">★</span>
                        <div>
                            <p className="text-sm font-medium text-yellow-800">
                                Pontos Ganhos
                            </p>
                            <p className="text-xl font-bold text-yellow-600">
                                {Math.floor(totalSpent)} pts
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
