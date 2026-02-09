import "server-only";
import { auth, currentUser as clerkCurrentUser } from "@clerk/nextjs/server";
import { sql } from "@/app/lib/db";

export type DbUser = {
    id: string;
    clerk_user_id: string;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    role: "user" | "admin";
    phone: string | null;

    // NOVOS
    nif: string | null;
    address: string | null;
    favorite_restaurant: string | null;

    total_spent_cents: number;
    points: number;
    created_at: string;
    updated_at: string;
};

// Lê (ou cria) o user na BD
export async function getCurrentUserDb(): Promise<DbUser> {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Not authenticated");
    }

    const rows = await sql<DbUser[]>`
    SELECT *
    FROM users
    WHERE clerk_user_id = ${userId}
    LIMIT 1
  `;

    if (rows.length) return rows[0];

    // fallback: cria na DB se por algum motivo ainda não existir
    const cu = await clerkCurrentUser();

    const email =
        cu?.emailAddresses?.find((e) => e.id === cu.primaryEmailAddressId)
            ?.emailAddress ??
        cu?.emailAddresses?.[0]?.emailAddress ??
        null;

    const firstName = cu?.firstName ?? null;
    const lastName = cu?.lastName ?? null;
    const imageUrl = cu?.imageUrl ?? null;

    const inserted = await sql<DbUser[]>`
    INSERT INTO users (clerk_user_id, email, first_name, last_name, image_url)
    VALUES (${userId}, ${email}, ${firstName}, ${lastName}, ${imageUrl})
    RETURNING *
  `;

    return inserted[0];
}

// Função “oficial” para usar no app (inclui auth + DB)
export async function currentUserApp(): Promise<DbUser | null> {
    const { userId } = await auth();
    if (!userId) return null;

    try {
        const dbUser = await getCurrentUserDb();
        return dbUser;
    } catch {
        // Se der erro na BD, trata como não autenticado
        return null;
    }
}
