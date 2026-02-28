import { auth } from "@clerk/nextjs/server";
import postgres from "postgres";
import { notFound, redirect } from "next/navigation";
import ReciboClient from "./recibo-client";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

type ReceiptOrderRow = {
    id: number;
    created_at: string;
    order_type: string;
    customer_name: string;
    customer_email: string;
    total_cents: number;
    subtotal_cents: number;
    delivery_fee_cents: number;
    clerk_user_id: string | null;
};

type ReceiptItemRow = {
    id: number;
    item_name: string;
    quantity: number;
    item_price_cents: number;
    subtotal_cents: number;
};

export default async function ReciboPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
        redirect("/sign-in");
    }

    // Buscar encomenda
    const order = await sql<ReceiptOrderRow[]>`
    SELECT o.*, u.clerk_user_id
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE o.id = ${id}
    LIMIT 1
  `;

    if (!order.length || order[0].clerk_user_id !== userId) {
        notFound();
    }

    const orderData = order[0];

    // Buscar items
    const items = await sql<ReceiptItemRow[]>`
    SELECT * FROM order_items
    WHERE order_id = ${id}
    ORDER BY id
  `;

    // Passar dados para Client Component
    return <ReciboClient orderData={orderData} items={items} />;
}
