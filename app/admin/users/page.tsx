const users = [
  {
    nome: "David Martins",
    morada: "Morada da Baixa 3, Faro",
    telefone: "911 111 111",
    email: "damartins89@gmail.com",
    nif: "123456789",
    restauranteFavorito: "Faro",
    pontos: 120,
  },
  {
    nome: "Joana Barta",
    morada: "Morada do Alto 2, Porto",
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

export default function UsersPage() {
  return (
    <main className="p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Utilizadores
        </h1>
        <p className="text-xl text-gray-600">
          Lista de clientes registados na plataforma.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Clientes ativos
          </h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
            {users.length} clientes
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => (
            <div
              key={u.nif}
              className="group overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-lg">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600">
                      {u.nome}
                    </h3>
                    <p className="text-sm text-gray-500">{u.nif}</p>
                  </div>
                </div>
                <div className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
                  {u.pontos} pts
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Restaurante Favorito
                  </span>
                  <span className="inline-flex rounded-full bg-gradient-to-r from-orange-400 to-yellow-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                    {u.restauranteFavorito}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">📍</span> {u.morada}
                  </div>
                  <div>
                    <span className="font-medium">📱</span> {u.telefone}
                  </div>
                  <div className="col-span-2 pt-1">
                    <span className="font-medium">✉️</span> {u.email}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
