import { requireAdmin } from "@/app/lib/admin";
import { redirect } from "next/navigation";
import { sql } from "@/app/lib/db";
import InvoicesClient, { type Receipt, type ReceiptStatus } from "./InvoicesClient";

type OrderRow = {
    id: number;
    total_cents: number;
    status: string | null;
    created_at: string;
    delivery_city: string | null;
    order_type: string | null;
};

function mapStatus(dbStatus: string | null): ReceiptStatus {
    switch (dbStatus) {
        case "completed":
        case "delivered":
            return "pago";
        case "cancelled":
            return "cancelado";
        default:
            return "pendente";
    }
}

function toInvoiceNumber(id: number): string {
    return `#RF-${String(id).padStart(4, "0")}`;
}

function toRestaurantName(city: string | null): string {
    if (city && city.trim()) {
        const c = city.trim();
        return `Restaurante ${c.charAt(0).toUpperCase()}${c.slice(1)}`;
    }
    return "O Grego";
}

function toReceipt(row: OrderRow): Receipt {
    const dateStr = new Date(row.created_at).toISOString().slice(0, 10);
    return {
        id: String(row.id),
        date: dateStr,
        amount: row.total_cents / 100,
        status: mapStatus(row.status),
        restaurant: toRestaurantName(row.delivery_city),
        invoiceNumber: toInvoiceNumber(row.id),
    };
}

export default async function InvoicesAndReceiptsPage() {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) redirect("/");

    const rows = await sql<OrderRow[]>`
        SELECT
            id,
            total_cents,
            status,
            created_at,
            delivery_city,
            order_type
        FROM orders
        ORDER BY created_at DESC
        LIMIT 200
    `;

    const receipts = rows.map(toReceipt);

    return <InvoicesClient receipts={receipts} />;
}
