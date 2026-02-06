import { sql } from "./db";

export async function getMenuImages(): Promise<string[]> {
    const rows = await sql<{ id: number; image: string }[]>`
    SELECT id, image
    FROM menuImages
    ORDER BY id ASC
  `;

    return rows.map((r) => String(r.image).trim());
}
