import postgres from "postgres";

const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!url) {
    throw new Error("Missing POSTGRES_URL / DATABASE_URL");
}

export const sql = postgres(url, { ssl: "require" });
