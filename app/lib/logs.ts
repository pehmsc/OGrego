import { sql } from "./db";

export async function getImageUrlByName(name: string): Promise<string | null> {
    const rows = await sql<{ url: string }[]>`
        SELECT url FROM logs WHERE nome = ${name} LIMIT 1
    `;
    return rows.length > 0 ? String(rows[0].url).trim() : null;
}
