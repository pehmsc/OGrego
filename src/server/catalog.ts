import "server-only";

import { sql } from "@/app/lib/db";

export type CatalogMenuItem = {
    id: string;
    name: string;
    price_cents: number;
};

type DbMenuItemRow = {
    id: string | number;
    item_name: string | null;
    item_price_raw: string | null;
    is_price_already_cents: boolean;
};

function toPriceCents(value: number, isPriceAlreadyCents: boolean) {
    if (isPriceAlreadyCents) return Math.round(value);
    return Math.round(value * 100);
}

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
        SELECT
            m.id,
            COALESCE(
                to_jsonb(m) ->> 'name',
                to_jsonb(m) ->> 'nome',
                to_jsonb(m) ->> 'title',
                to_jsonb(m) ->> 'item_name'
            ) AS item_name,
            COALESCE(
                to_jsonb(m) ->> 'price_cents',
                to_jsonb(m) ->> 'preco_cents',
                to_jsonb(m) ->> 'unit_price_cents',
                to_jsonb(m) ->> 'price',
                to_jsonb(m) ->> 'preco'
            ) AS item_price_raw,
            CASE
                WHEN COALESCE(
                    to_jsonb(m) ->> 'price_cents',
                    to_jsonb(m) ->> 'preco_cents',
                    to_jsonb(m) ->> 'unit_price_cents'
                ) IS NOT NULL THEN true
                ELSE false
            END AS is_price_already_cents
        FROM menu_items m
        WHERE m.id IN ${sql(numericIds)}
    `;

    const returnedIds = new Set(rows.map((row) => String(row.id)));
    const missingItemIds = normalizedIds.filter((id) => !returnedIds.has(id));
    if (missingItemIds.length > 0) {
        throw new Error(`Item não encontrado: ${missingItemIds.join(", ")}`);
    }

    return rows.map((row) => {
        const itemName = String(row.item_name ?? "").trim();
        const safeItemName = itemName || `Item ${row.id}`;
        if (!itemName) {
            console.warn("[catalog:getMenuItemsByIds] item sem nome, a usar fallback", {
                itemId: String(row.id),
            });
        }

        const parsedPrice = Number(row.item_price_raw ?? "");
        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            throw new Error(`Preço inválido no catálogo para item ${row.id}.`);
        }

        return {
            id: String(row.id),
            name: safeItemName,
            price_cents: toPriceCents(parsedPrice, row.is_price_already_cents),
        };
    });
}
