import { requireAdmin } from "@/app/lib/admin";
import { redirect } from "next/navigation";
import { sql } from "@/app/lib/db";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) redirect("/");

    const users = await sql<any[]>`
        SELECT
            id,
            first_name,
            last_name,
            email,
            phone,
            nif,
            address,
            favorite_restaurant,
            points
        FROM users
        ORDER BY created_at DESC
    `;

    return <UsersClient users={users} />;
}
