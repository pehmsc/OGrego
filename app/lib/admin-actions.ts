"use server";

import { requireAdmin } from "@/app/lib/admin";
import { sql } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

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
    VALUES (${data.nome}, ${data.email}, ${data.telefone || null}, ${data.data}, ${data.hora}, ${data.pessoas}, ${data.notas || null}, 'Confirmada', now())
    RETURNING id
`;

    revalidatePath("/admin/reservations");

    return result[0];
}
