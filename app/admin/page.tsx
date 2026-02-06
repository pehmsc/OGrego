// app/admin/page.tsx
import React from "react";
import StatCard from "@/app/ui/components/StatCard";

export default function AdminDashboard() {
<<<<<<< HEAD
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Área de Admin</h1>

            <h2 className="text-xl font-semibold">Visão Geral</h2>
=======
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Visão Geral</h2>
>>>>>>> f36d06d2e5593239c192c00a669b69a5f5241286

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard title="Vendas" value="€2.450,00" />
        <StatCard title="Utilizadores Ativos" value="128" />
        <StatCard title="Pedidos Pendentes" value="7" />
      </section>
    </div>
  );
}
