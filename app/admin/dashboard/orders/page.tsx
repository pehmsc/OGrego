export default function OrdersPage() {
    const encomendas = [
        {
            id: 101,
            cliente: "Ana Martins",
            tipo: "Entrega",
            estado: "Em preparação",
            total: "32,50 €",
            data: "2026-02-10",
            hora: "19:15",
        },
        {
            id: 102,
            cliente: "Pedro Lopes",
            tipo: "Take-away",
            estado: "Pronto",
            total: "24,00 €",
            data: "2026-02-10",
            hora: "20:00",
        },
        {
            id: 103,
            cliente: "Sofia Nunes",
            tipo: "Entrega",
            estado: "Enviado",
            total: "41,20 €",
            data: "2026-02-11",
            hora: "19:45",
        },
    ];

    return (
        <main className="p-6 space-y-4">
            <header className="space-y-1">
                <h1 className="text-2xl font-semibold">
                    Encomendas / Entregas
                </h1>
                <p className="text-sm text-gray-600">
                    Acompanhamento das encomendas ativas do restaurante.
                </p>
            </header>

            <div className="overflow-x-auto rounded-lg border bg-white">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="px-4 py-2">#</th>
                            <th className="px-4 py-2">Cliente</th>
                            <th className="px-4 py-2">Tipo</th>
                            <th className="px-4 py-2">Estado</th>
                            <th className="px-4 py-2">Total</th>
                            <th className="px-4 py-2">Data</th>
                            <th className="px-4 py-2">Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {encomendas.map((o) => (
                            <tr key={o.id} className="border-t">
                                <td className="px-4 py-2">{o.id}</td>
                                <td className="px-4 py-2">{o.cliente}</td>
                                <td className="px-4 py-2">{o.tipo}</td>
                                <td className="px-4 py-2">{o.estado}</td>
                                <td className="px-4 py-2">{o.total}</td>
                                <td className="px-4 py-2">{o.data}</td>
                                <td className="px-4 py-2">{o.hora}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
