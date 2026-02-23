import "server-only";

import { sql } from "@/app/lib/db";

export type CatalogMenuItem = {
    id: string;
    name: string;
    price_cents: number;
};

type DbMenuItemRow = {
    id: string | number;
    name: string;
    price_cents: number;
};

export async function getMenuItemsByIds(ids: string[]): Promise<CatalogMenuItem[]> {
    if (!ids.length) return [];

    const normalizedIds = Array.from(
        new Set(ids.map((id) => String(id).trim()).filter(Boolean)),
    );

    if (!normalizedIds.length) return [];

    const numericIds = normalizedIds.map((id) => {
        const parsed = Number(id);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw new Error(`ID de item inválido: ${id}`);
        }
        return parsed;
    });

    const rows = await sql<DbMenuItemRow[]>`
        SELECT id, name, price_cents
        FROM menu_items
        WHERE id IN ${sql(numericIds)}
    `;

    return rows.map((row) => ({
        id: String(row.id),
        name: String(row.name),
        price_cents: Math.round(Number(row.price_cents)),
    }));
}
