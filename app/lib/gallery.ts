/*import { sql } from "./db";


export async function getGalleryImages() {
    const rows = await sql<{ id: number; image: string }[]>`
    SELECT id, image
    FROM gallery
    ORDER BY id ASC
  `;

    const result = rows.map((r) => ({
        id: r.id,
        image: String(r.image).trim(),
    }));

    console.log("✅ URLs finais:", result);

    return result;
}

*/

import { sql } from "./db";

export async function getGalleryImages(): Promise<string[]> {
    const rows = await sql<{ id: number; image: string }[]>`
    SELECT id, image
    FROM gallery
    ORDER BY id ASC
  `;

    return rows.map((r) => String(r.image).trim());
}
