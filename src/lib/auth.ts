import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { sql } from "@/app/lib/db";

export type UserRole = "user" | "admin";

export type AuthenticatedUserContext = {
    clerkUserId: string;
    dbUserId: string | null;
    role: UserRole;
};

type DbUserRoleRow = {
    id: string;
    role: string | null;
};

function normalizeRole(value: unknown): UserRole | null {
    if (typeof value !== "string") return null;

    const normalized = value.toLowerCase().trim();
    if (normalized === "admin") return "admin";
    if (normalized === "user") return "user";
    return null;
}

function getRoleFromMetadata(metadata: unknown): UserRole | null {
    if (!metadata || typeof metadata !== "object") return null;
    const role = (metadata as Record<string, unknown>).role;
    return normalizeRole(role);
}

export async function getAuthenticatedUserContext(): Promise<AuthenticatedUserContext | null> {
    const { userId } = await auth();
    if (!userId) return null;

    const clerkUser = await currentUser();
    const clerkRole =
        getRoleFromMetadata(clerkUser?.publicMetadata) ??
        getRoleFromMetadata(clerkUser?.privateMetadata) ??
        getRoleFromMetadata(clerkUser?.unsafeMetadata);

    const dbRows = await sql<DbUserRoleRow[]>`
        SELECT id, role
        FROM users
        WHERE clerk_user_id = ${userId}
        LIMIT 1
    `;

    let dbUser = dbRows[0];
    if (!dbUser && clerkUser) {
        const email =
            clerkUser.emailAddresses.find(
                (e) => e.id === clerkUser.primaryEmailAddressId,
            )?.emailAddress ??
            clerkUser.emailAddresses[0]?.emailAddress ??
            null;

        const insertedRows = await sql<DbUserRoleRow[]>`
            INSERT INTO users (
                clerk_user_id,
                email,
                first_name,
                last_name,
                image_url,
                role
            )
            VALUES (
                ${userId},
                ${email},
                ${clerkUser.firstName ?? null},
                ${clerkUser.lastName ?? null},
                ${clerkUser.imageUrl ?? null},
                ${clerkRole ?? "user"}
            )
            ON CONFLICT (clerk_user_id)
            DO UPDATE SET
                email = COALESCE(users.email, EXCLUDED.email),
                first_name = COALESCE(users.first_name, EXCLUDED.first_name),
                last_name = COALESCE(users.last_name, EXCLUDED.last_name),
                image_url = COALESCE(users.image_url, EXCLUDED.image_url),
                role = COALESCE(users.role, EXCLUDED.role),
                updated_at = NOW()
            RETURNING id, role
        `;

        dbUser = insertedRows[0];
    }

    return {
        clerkUserId: userId,
        dbUserId: dbUser?.id ?? null,
        role: clerkRole ?? normalizeRole(dbUser?.role) ?? "user",
    };
}

export async function getAuthenticatedUserRole(): Promise<UserRole | null> {
    const userContext = await getAuthenticatedUserContext();
    return userContext?.role ?? null;
}
