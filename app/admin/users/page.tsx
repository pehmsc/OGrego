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
                            <th className="px-4 py-2">Morada</th>
                            <th className="px-4 py-2">Telefone</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">NIF</th>
                            <th className="px-4 py-2">Restaurante Favorito</th>
                            <th className="px-4 py-2">Pontos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.nif} className="border-t">
                                <td className="px-4 py-2">{u.nome}</td>
                                <td className="px-4 py-2">{u.morada}</td>
                                <td className="px-4 py-2">{u.telefone}</td>
                                <td className="px-4 py-2">{u.email}</td>
                                <td className="px-4 py-2">{u.nif}</td>
                                <td className="px-4 py-2">
                                    {u.restauranteFavorito}
                                </td>
                                <td className="px-4 py-2">{u.pontos}</td>
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
        nome: "David Martins",
        morada: "Morada inventada 3, Faro",
        telefone: "911 111 111",
        email: "damartins89@gmail.com",
        nif: "123456789",
        restauranteFavorito: "Faro",
        pontos: 120,
    },
    {
        nome: "Joana Barta",
        morada: "Morada inventada 2, Porto",
        telefone: "922 222 222",
        email: "joanamcbarata@gmail.com",
        nif: "234567890",
        restauranteFavorito: "Porto",
        pontos: 200,
    },
    {
        nome: "Pedro Campos",
        morada: "Rua do Exemplo 4, 2º Esq., Lisboa",
        telefone: "912 345 987",
        email: "pehmsc@gmail.com",
        nif: "312987123",
        restauranteFavorito: "Lisboa",
        pontos: 80,
    },
];
