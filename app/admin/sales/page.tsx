import { getSales, getSalesStats } from "@/app/lib/admin-actions";
import SalesClient from "./sales-client";

export default async function SalesPage() {
    const [vendas, stats] = await Promise.all([getSales(), getSalesStats()]);

    return <SalesClient vendas={vendas} stats={stats} />;
}
