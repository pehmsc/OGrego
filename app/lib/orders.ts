// TODO: Descomentar quando criar as tabelas no Neon

/*
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

export async function getUserOrders(userId: number): Promise<Order[]> {
  try {
    const result = await sql`
      SELECT 
        o.id,
        TO_CHAR(o.created_at, 'DD Mon YYYY') as date,
        o.total,
        o.points_earned as points,
        o.status,
        STRING_AGG(oi.item_name, ', ') as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ${userId}
      GROUP BY o.id, o.created_at, o.total, o.points_earned, o.status
      ORDER BY o.created_at DESC
      LIMIT 50
    `;

    return result.rows.map((row) => ({
      id: row.id,
      date: row.date,
      total: parseFloat(row.total),
      points: row.points,
      status: row.status,
      items: row.items || "Sem itens",
    }));
  } catch (error) {
    console.error("Erro ao buscar encomendas:", error);
    return [];
  }
}

export async function getUserOrderStats(userId: number): Promise<OrderStats> {
  try {
    const result = await sql`
      SELECT 
        COUNT(*)::int as total_orders,
        COALESCE(SUM(total), 0) as total_spent,
        TO_CHAR(MAX(created_at), 'DD "de" Mon, YYYY') as last_order
      FROM orders
      WHERE user_id = ${userId}
    `;

    const row = result.rows[0];

    return {
      totalOrders: row.total_orders,
      totalSpent: parseFloat(row.total_spent),
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
*/
