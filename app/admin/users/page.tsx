export default function UsersPage() {
    return (
        <main className="p-6 space-y-4">
            <header className="space-y-1">
                <h1 className="text-2xl font-semibold">Utilizadores</h1>
                <p className="text-sm text-gray-600">
                    Lista de clientes registados na plataforma.
                </p>
            </header>

            <div className="overflow-x-auto rounded-lg border bg-white">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="px-4 py-2">Nome</th>
                            <th className="px-4 py-2">Telefone</th>
                            <th className="px-4 py-2">Morada favorita</th>
                            <th className="px-4 py-2">NIF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.nif} className="border-t">
                                <td className="px-4 py-2">{u.nome}</td>
                                <td className="px-4 py-2">{u.telefone}</td>
                                <td className="px-4 py-2">{u.morada}</td>
                                <td className="px-4 py-2">{u.nif}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

const users = [
    {
        nome: "Maria Lopes",
        morada: "Rua das Oliveiras, Lisboa",
        telefone: "912 345 678",
        nif: "245678912",
    },
    {
        nome: "Pedro Silva",
        morada: "Avenida dos Aliados, Porto",
        telefone: "934 567 890",
        nif: "345678912",
    },
    {
        nome: "Sofia Costa",
        morada: "Praça da República, Coimbra",
        telefone: "967 890 123",
        nif: "456789123",
    },
];
