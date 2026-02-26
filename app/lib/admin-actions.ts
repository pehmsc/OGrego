"use server";

import { requireAdmin } from "@/app/lib/admin";
import { sql } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

// ═══════════════════════════════════════════════════════════════
// Existing admin actions (users + orders)
// ═══════════════════════════════════════════════════════════════

export async function updateUserAdmin(
    userId: string,
    data: {
        first_name: string;
        last_name: string;
        phone: string;
        nif: string;
        address: string;
        favorite_restaurant: string;
        points: number;
    },
) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) throw new Error("Not authorized");

    await sql`
        UPDATE users SET
            first_name          = ${data.first_name || null},
            last_name           = ${data.last_name || null},
            phone               = ${data.phone || null},
            nif                 = ${data.nif || null},
            address             = ${data.address || null},
            favorite_restaurant = ${data.favorite_restaurant || null},
            points              = ${data.points},
            updated_at          = now()
        WHERE id = ${userId}
    `;

    revalidatePath("/admin/users");
}

export async function updateOrderAdmin(
    orderId: number,
    data: { status: string; notes: string },
) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) throw new Error("Not authorized");

    await sql`
        UPDATE orders SET
            status     = ${data.status},
            notes      = ${data.notes || null},
            updated_at = now()
        WHERE id = ${orderId}
    `;

    revalidatePath("/admin/orders");
}

// ═══════════════════════════════════════════════════════════════
// Dashboard types
// ═══════════════════════════════════════════════════════════════

export type VendaPonto = { label: string; total_cents: number };
export type CategoriaTop = { categoria: string; percentagem: number };

export type PedidoRecente = {
    id: number;
    customer_name: string;
    total_cents: number;
    status: string;
    created_at: string;
    order_type: string;
};

export type Atividade = {
    tipo: "novo_utilizador" | "reserva" | "novo_pedido" | "pedido_entregue";
    titulo: string;
    detalhe: string;
    created_at: string;
};

// ═══════════════════════════════════════════════════════════════
// Dashboard helpers
// ═══════════════════════════════════════════════════════════════

function getDesdeDate(periodo: string): Date {
    const now = new Date();

    switch (periodo) {
        case "hoje":
            return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        case "semana": {
            const d = new Date(now);
            d.setDate(d.getDate() - 7);
            return d;
        }
        case "15dias": {
            const d = new Date(now);
            d.setDate(d.getDate() - 15);
            return d;
        }
        case "mes": {
            const d = new Date(now);
            d.setMonth(d.getMonth() - 1);
            return d;
        }
        case "6meses": {
            const d = new Date(now);
            d.setMonth(d.getMonth() - 6);
            return d;
        }
        case "12meses": {
            const d = new Date(now);
            d.setMonth(d.getMonth() - 12);
            return d;
        }
        default: {
            const d = new Date(now);
            d.setDate(d.getDate() - 7);
            return d;
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// Dashboard actions
// ═══════════════════════════════════════════════════════════════

// ─── 1. Vendas total por período (para o card) ─────────────────

export async function getVendasTotal(periodo: string): Promise<number> {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) return 0;

    try {
        const desde = getDesdeDate(periodo);

        const rows = await sql<{ total: string | null }[]>`
            SELECT COALESCE(SUM(total_cents), 0)::text AS total
            FROM orders
            WHERE created_at >= ${desde.toISOString()}
              AND status != 'cancelled'
        `;
        return Number(rows[0]?.total ?? 0);
    } catch (error) {
        console.error("getVendasTotal:", error);
        return 0;
    }
}

// ─── 2. Total de utilizadores ───────────────────────────────────

export async function getTotalUtilizadores(): Promise<number> {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) return 0;

    try {
        const rows = await sql<{ count: string }[]>`
            SELECT COUNT(*)::text AS count FROM users
        `;
        return Number(rows[0]?.count ?? 0);
    } catch (error) {
        console.error("getTotalUtilizadores:", error);
        return 0;
    }
}

// ─── 3. Pedidos pendentes (pending + ready) ─────────────────────

export async function getPedidosPendentes(): Promise<number> {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) return 0;

    try {
        const rows = await sql<{ count: string }[]>`
            SELECT COUNT(*)::text AS count
            FROM orders
            WHERE status IN ('pending', 'ready')
        `;
        return Number(rows[0]?.count ?? 0);
    } catch (error) {
        console.error("getPedidosPendentes:", error);
        return 0;
    }
}

// ─── 4. Vendas por período (para gráfico) ──────────────────────

export async function getVendasPorPeriodo(
    periodo: string,
): Promise<VendaPonto[]> {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) return [];

    try {
        const desde = getDesdeDate(periodo);

        if (periodo === "hoje") {
            const rows = await sql<{ label: string; total_cents: string }[]>`
                SELECT
                    TO_CHAR(DATE_TRUNC('hour', created_at), 'HH24:MI') AS label,
                    COALESCE(SUM(total_cents), 0)::text AS total_cents
                FROM orders
                WHERE created_at >= ${desde.toISOString()}
                  AND status != 'cancelled'
                GROUP BY DATE_TRUNC('hour', created_at)
                ORDER BY DATE_TRUNC('hour', created_at)
            `;
            return rows.map((r) => ({
                label: r.label,
                total_cents: Number(r.total_cents),
            }));
        }

        const rows = await sql<{ label: string; total_cents: string }[]>`
            SELECT
                TO_CHAR(DATE_TRUNC('day', created_at), 'DD/MM') AS label,
                COALESCE(SUM(total_cents), 0)::text AS total_cents
            FROM orders
            WHERE created_at >= ${desde.toISOString()}
              AND status != 'cancelled'
            GROUP BY DATE_TRUNC('day', created_at)
            ORDER BY DATE_TRUNC('day', created_at)
        `;

        return rows.map((r) => ({
            label: r.label,
            total_cents: Number(r.total_cents),
        }));
    } catch (error) {
        console.error("getVendasPorPeriodo:", error);
        return [];
    }
}

// ─── 5. Top Categorias (% de itens vendidos por categoria) ──────

export async function getTopCategorias(): Promise<CategoriaTop[]> {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) return [];

    try {
        const rows = await sql<{ categoria: string; percentagem: string }[]>`
            SELECT
                mi.category AS categoria,
                ROUND(
                    SUM(oi.quantity)::numeric * 100.0
                    / NULLIF((SELECT SUM(quantity) FROM order_items), 0),
                    0
                )::text AS percentagem
            FROM order_items oi
            JOIN menu_items mi ON mi.id = oi.menu_item_id
            GROUP BY mi.category
            ORDER BY SUM(oi.quantity) DESC
        `;

        return rows.map((r) => ({
            categoria: r.categoria,
            percentagem: Number(r.percentagem ?? 0),
        }));
    } catch (error) {
        console.error("getTopCategorias:", error);
        return [];
    }
}

// ─── 6. Últimos 5 pedidos ───────────────────────────────────────

export async function getPedidosRecentes(): Promise<PedidoRecente[]> {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) return [];

    try {
        const rows = await sql<PedidoRecente[]>`
            SELECT
                id,
                customer_name,
                total_cents,
                status,
                created_at::text,
                order_type
            FROM orders
            ORDER BY created_at DESC
            LIMIT 5
        `;
        return rows;
    } catch (error) {
        console.error("getPedidosRecentes:", error);
        return [];
    }
}

// ─── 7. Atualizar estado do pedido (via dashboard) ──────────────

export async function atualizarEstadoPedido(
    id: number,
    novoEstado: string,
): Promise<boolean> {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) return false;

    try {
        await sql`
            UPDATE orders
            SET status = ${novoEstado}, updated_at = NOW()
            WHERE id = ${id}
        `;
        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/orders");
        return true;
    } catch (error) {
        console.error("atualizarEstadoPedido:", error);
        return false;
    }
}

// ─── 8. Atividade recente (5 mais recentes de 4 fontes) ─────────

export async function getAtividadeRecente(): Promise<Atividade[]> {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) return [];

    try {
        const rows = await sql<
            {
                tipo: string;
                titulo: string;
                detalhe: string;
                created_at: string;
            }[]
        >`
            (
                SELECT
                    'novo_utilizador' AS tipo,
                    'Novo utilizador registado' AS titulo,
                    COALESCE(email, '—') AS detalhe,
                    created_at::text
                FROM users
                ORDER BY created_at DESC
                LIMIT 5
            )
            UNION ALL
            (
                SELECT
                    'reserva' AS tipo,
                    'Reserva confirmada' AS titulo,
                    nome || ' — Mesa para ' || pessoas || ' às ' || TO_CHAR(hora, 'HH24:MI') AS detalhe,
                    created_at::text
                FROM reservas
                ORDER BY created_at DESC
                LIMIT 5
            )
            UNION ALL
            (
                SELECT
                    'novo_pedido' AS tipo,
                    'Novo pedido' AS titulo,
                    '#' || id || ' — ' || customer_name || ' — €' || TO_CHAR(total_cents / 100.0, 'FM999G990D00') AS detalhe,
                    created_at::text
                FROM orders
                ORDER BY created_at DESC
                LIMIT 5
            )
            UNION ALL
            (
                SELECT
                    'pedido_entregue' AS tipo,
                    'Pedido entregue' AS titulo,
                    '#' || id || ' — ' || customer_name AS detalhe,
                    updated_at::text AS created_at
                FROM orders
                WHERE status = 'delivered'
                ORDER BY updated_at DESC
                LIMIT 5
            )
            ORDER BY created_at DESC
            LIMIT 5
        `;

        return rows as Atividade[];
    } catch (error) {
        console.error("getAtividadeRecente:", error);
        return [];
    }
}

export async function updateReservationAdmin(
    reservationId: number,
    data: {
        nome: string;
        email: string;
        telefone: string;
        data: string;
        hora: string;
        pessoas: number;
        notas: string;
        estado?: string;
    },
) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) throw new Error("Not authorized");

    await sql`
        UPDATE reservas SET
            nome     = ${data.nome},
            email    = ${data.email},
            telefone = ${data.telefone || null},
            data     = ${data.data},
            hora     = ${data.hora},
            pessoas  = ${data.pessoas},
            notas    = ${data.notas || null},
            "estado"   = ${data.estado || "Confirmada"}
        WHERE id = ${reservationId}
    `;

    revalidatePath("/admin/reservations");
}

export async function createReservationAdmin(data: {
    nome: string;
    email: string;
    telefone: string;
    data: string;
    hora: string;
    pessoas: number;
    notas: string;
}) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) throw new Error("Not authorized");

    const result = await sql<{ id: number }[]>`
    INSERT INTO reservas (nome, email, telefone, "data", hora, pessoas, notas, "estado", created_at)
    VALUES (${data.nome}, ${data.email}, ${data.telefone || null}, ${data.data}, ${data.hora}, ${data.pessoas}, ${data.notas || null}, 'Pendente', now())
    RETURNING id
`;

    revalidatePath("/admin/reservations");

    return result[0];
}
