import { requireAdmin } from "@/app/lib/admin";
import { redirect } from "next/navigation";
import { sql } from "@/app/lib/db";
import ReservationsClient from "./ReservationsClient";

export default async function ReservationsPage() {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) redirect("/");

    const reservations = await sql<any[]>`
        SELECT
            id,
            nome,
            email,
            telefone,
            data::text,
            TO_CHAR(hora, 'HH24:MI') as hora,
            pessoas,
            notas,
            estado,
            created_at::text
        FROM reservas
        ORDER BY data DESC
        LIMIT 200
    `;

    return <ReservationsClient reservations={reservations} />;
}
