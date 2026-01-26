import { sql } from "./db";

export async function getGalleryImages() {
  const rows = await sql<{ image: string }[]>`
    SELECT image
    FROM gallery
    ORDER BY id ASC
  `;

  return rows.map((r) => `/galeria/${String(r.image).trim()}`);
}
