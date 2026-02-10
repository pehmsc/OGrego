export default function SalesPage() {
    const vendas = [
        {
            id: 1,
            cliente: "João Silva",
            total: "45,00 €",
            metodo: "MB Way",
            data: "2026-02-10",
        },
        {
            id: 2,
            cliente: "Maria Costa",
            total: "62,50 €",
            metodo: "Cartão",
            data: "2026-02-10",
        },
        {
            id: 3,
            cliente: "Pedro Lopes",
            total: "24,00 €",
            metodo: "Dinheiro",
            data: "2026-02-11",
        },
    ];

    return (
        <main className="p-6 space-y-6">
            <header>
                <h1 className="text-2xl font-semibold">Vendas</h1>
                <p className="text-sm text-gray-600">
                    Resumo das vendas realizadas.
                </p>
            </header>

            {/* KPIs */}
            <section className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">Total Hoje</p>
                    <p className="text-xl font-semibold">€132,50</p>
                </div>

                <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">Total Mês</p>
                    <p className="text-xl font-semibold">€2.450,00</p>
                </div>

                <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">Pedidos</p>
                    <p className="text-xl font-semibold">37</p>
                </div>
            </section>

            {/* Tabela */}
            <div className="overflow-x-auto rounded-lg border bg-white">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="px-4 py-2">Cliente</th>
                            <th className="px-4 py-2">Total</th>
                            <th className="px-4 py-2">Método</th>
                            <th className="px-4 py-2">Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendas.map((v) => (
                            <tr key={v.id} className="border-t">
                                <td className="px-4 py-2">{v.cliente}</td>
                                <td className="px-4 py-2">{v.total}</td>
                                <td className="px-4 py-2">{v.metodo}</td>
                                <td className="px-4 py-2">{v.data}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
