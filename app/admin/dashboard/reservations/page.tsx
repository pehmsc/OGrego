export default function ReservationsPage() {
    const reservas = [
        {
            id: 1,
            nome: "João Silva",
            pessoas: 2,
            data: "2026-02-10",
            hora: "20:00",
            telefone: "+351 912 345 678",
            notas: "Mesa perto da janela.",
        },
        {
            id: 2,
            nome: "Maria Costa",
            pessoas: 4,
            data: "2026-02-11",
            hora: "21:00",
            telefone: "+351 934 567 890",
            notas: "Aniversário.",
        },
        {
            id: 3,
            nome: "Daniel Rodrigues",
            pessoas: 3,
            data: "2026-02-12",
            hora: "19:30",
            telefone: "+351 967 890 123",
            notas: "",
        },
    ];

    return (
        <main className="p-6 space-y-4">
            <header className="space-y-1">
                <h1 className="text-2xl font-semibold">Reservas</h1>
                <p className="text-sm text-gray-600">
                    Lista de reservas futuras no restaurante.
                </p>
            </header>

            <div className="overflow-x-auto rounded-lg border bg-white">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="px-4 py-2">Nome</th>
                            <th className="px-4 py-2">Pessoas</th>
                            <th className="px-4 py-2">Data</th>
                            <th className="px-4 py-2">Hora</th>
                            <th className="px-4 py-2">Telefone</th>
                            <th className="px-4 py-2">Notas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.map((r) => (
                            <tr key={r.id} className="border-t">
                                <td className="px-4 py-2">{r.nome}</td>
                                <td className="px-4 py-2">{r.pessoas}</td>
                                <td className="px-4 py-2">{r.data}</td>
                                <td className="px-4 py-2">{r.hora}</td>
                                <td className="px-4 py-2">{r.telefone}</td>
                                <td className="px-4 py-2">
                                    {r.notas || (
                                        <span className="text-gray-400">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
