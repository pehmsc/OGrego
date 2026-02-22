import { requireAdmin } from "@/app/lib/admin";
import { redirect } from "next/navigation";
import { sql } from "@/app/lib/db";
import OrdensClient from "./OrdensClient";

export default async function OrdensPage() {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) redirect("/");

    const orders = await sql<any[]>`
        SELECT
            id,
            customer_name,
            customer_phone,
            order_type,
            status,
            total_cents,
            notes,
            created_at
        FROM orders
        ORDER BY created_at DESC
        LIMIT 200
    `;

    return <OrdensClient orders={orders} />;
}
