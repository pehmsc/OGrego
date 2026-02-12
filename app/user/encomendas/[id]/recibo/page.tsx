import { auth } from "@clerk/nextjs/server";
import postgres from "postgres";
import { notFound, redirect } from "next/navigation";
import ReciboClient from "./recibo-client";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

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
    const order = await sql`
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
    const items = await sql`
    SELECT * FROM order_items
    WHERE order_id = ${id}
    ORDER BY id
  `;

    // Passar dados para Client Component
    return <ReciboClient orderData={orderData} items={items} />;
}
