import "server-only";

import { sql } from "@/app/lib/db";

export type CatalogMenuItem = {
    id: string;
    name: string;
    price_cents: number;
};

type DbMenuItemRow = {
    id: string | number;
    item_name: string;
    item_price_raw: number | string;
};

const MENU_NAME_COLUMN_CANDIDATES = [
    "name",
    "nome",
    "title",
    "item_name",
] as const;

const MENU_PRICE_COLUMN_CANDIDATES = [
    "price_cents",
    "preco_cents",
    "unit_price_cents",
    "price",
    "preco",
] as const;

type ResolvedMenuColumns = {
    nameColumn: string;
    priceColumn: string;
};

let resolvedMenuColumnsPromise: Promise<ResolvedMenuColumns> | null = null;

async function resolveMenuItemsColumns(): Promise<ResolvedMenuColumns> {
    if (resolvedMenuColumnsPromise) {
        return resolvedMenuColumnsPromise;
    }

    resolvedMenuColumnsPromise = (async () => {
        const rows = await sql<{ column_name: string }[]>`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'menu_items'
        `;

        const availableColumns = new Set(
            rows.map((row) => String(row.column_name).toLowerCase()),
        );

        const nameColumn = MENU_NAME_COLUMN_CANDIDATES.find((column) =>
            availableColumns.has(column),
        );
        const priceColumn = MENU_PRICE_COLUMN_CANDIDATES.find((column) =>
            availableColumns.has(column),
        );

        if (!nameColumn || !priceColumn) {
            throw new Error(
                "Tabela menu_items sem colunas compatíveis para nome/preço.",
            );
        }

        return { nameColumn, priceColumn };
    })().catch((error) => {
        resolvedMenuColumnsPromise = null;
        throw error;
    });

    return resolvedMenuColumnsPromise;
}

function toPriceCents(value: number, sourceColumn: string) {
    if (sourceColumn.endsWith("_cents")) {
        return Math.round(value);
    }
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

    const { nameColumn, priceColumn } = await resolveMenuItemsColumns();

    const rows = await sql.unsafe<DbMenuItemRow[]>(`
        SELECT
            id,
            ${nameColumn} AS item_name,
            ${priceColumn} AS item_price_raw
        FROM menu_items
        WHERE id IN (${numericIds.join(",")})
    `);

    return rows.map((row) => {
        const parsedPrice = Number(row.item_price_raw);
        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            throw new Error(`Preço inválido no catálogo para item ${row.id}.`);
        }

        return {
            id: String(row.id),
            name: String(row.item_name),
            price_cents: toPriceCents(parsedPrice, priceColumn),
        };
    });
}
