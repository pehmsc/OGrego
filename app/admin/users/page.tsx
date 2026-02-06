const users = [
  {
    nome: "Maria Lopes",
    morada: "Rua das Oliveiras, Lisboa",
    telefone: "912 345 678",
    nif: "245678912",
  },
];

export default function Utilizadores() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Utilizadores</h2>

      {users.map((u) => (
        <div key={u.nif} className="rounded-lg bg-white p-4 shadow-sm">
          <p>
            <strong>Nome:</strong> {u.nome}
          </p>
          <p>
            <strong>Morada favorita:</strong> {u.morada}
          </p>
          <p>
            <strong>Telefone:</strong> {u.telefone}
          </p>
          <p>
            <strong>NIF:</strong> {u.nif}
          </p>
        </div>
      ))}
    </div>
  );
}
