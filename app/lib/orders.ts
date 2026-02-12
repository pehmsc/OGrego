import { sql } from "@/app/lib/db";

export interface Order {
    id: number;
    date: string;
    total: number;
    points: number;
    status: string;
    items: string;
}

export interface OrderStats {
    totalOrders: number;
    totalSpent: number;
    lastOrder: string | null;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
    try {
        const result = await sql<Order[]>`
            SELECT 
                o.id,
                TO_CHAR(o.created_at, 'DD Mon YYYY') as date,
                o.total_cents,
                o.status,
                STRING_AGG(oi.item_name, ', ') as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = ${userId}
            GROUP BY o.id, o.created_at, o.total_cents, o.status
            ORDER BY o.created_at DESC
            LIMIT 50
        `;

        return result.map((row: any) => ({
            id: row.id,
            date: row.date,
            total: row.total_cents / 100, // ✅ cents → euros
            points: Math.floor(row.total_cents / 100), // ✅ 1 ponto por euro
            status: row.status,
            items: row.items || "Sem itens",
        }));
    } catch (error) {
        console.error("Erro ao buscar encomendas:", error);
        return [];
    }
}

export async function getUserOrderStats(userId: string): Promise<OrderStats> {
    try {
        const result = await sql<any[]>`
            SELECT 
                COUNT(*)::int as total_orders,
                COALESCE(SUM(total_cents), 0)::int as total_spent_cents,
                TO_CHAR(MAX(created_at), 'DD "de" Mon, YYYY') as last_order
            FROM orders
            WHERE user_id = ${userId}
        `;

        const row = result[0]; // ✅ sem .rows

        return {
            totalOrders: row.total_orders,
            totalSpent: row.total_spent_cents / 100, // ✅ cents → euros
            lastOrder: row.last_order,
        };
    } catch (error) {
        console.error("Erro ao buscar stats de encomendas:", error);
        return {
            totalOrders: 0,
            totalSpent: 0,
            lastOrder: null,
        };
    }
}
