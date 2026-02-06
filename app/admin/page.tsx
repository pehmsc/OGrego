import StatCard from "@/app/ui/components/StatCard";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Visão Geral</h2>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard title="Vendas" value="€2.450,00" />
        <StatCard title="Utilizadores Ativos" value="128" />
        <StatCard title="Pedidos Pendentes" value="7" />
      </section>
    </div>
  );
}
