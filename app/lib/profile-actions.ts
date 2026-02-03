// app/lib/profile-actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { sql } from "@/app/lib/db";

const ProfileSchema = z.object({
  name: z.string().trim().min(1).max(200),
  phone: z.string().trim().max(32).optional().or(z.literal("")),
  nif: z
    .string()
    .trim()
    .regex(/^\d{9}$/, "O NIF deve ter 9 dígitos.")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().max(400).optional().or(z.literal("")),
  favorite_restaurant: z.string().trim().max(120).optional().or(z.literal("")),
});

function splitName(full: string) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export async function updateProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    nif: String(formData.get("nif") ?? ""),
    address: String(formData.get("address") ?? ""),
    favorite_restaurant: String(formData.get("favorite_restaurant") ?? ""),
  };

  const parsed = ProfileSchema.safeParse(raw);
  if (!parsed.success) {
    // Para já, manda erro para dev (mais tarde fazemos UI de erro)
    throw new Error(parsed.error.issues.map((i) => i.message).join(" | "));
  }

  const { first, last } = splitName(parsed.data.name);

  await sql`
    UPDATE users
    SET
      first_name = ${first || null},
      last_name = ${last || null},
      phone = ${parsed.data.phone || null},
      nif = ${parsed.data.nif || null},
      address = ${parsed.data.address || null},
      favorite_restaurant = ${parsed.data.favorite_restaurant || null},
      updated_at = now()
    WHERE clerk_user_id = ${userId}
  `;

  // força a página a recarregar com dados atualizados
  revalidatePath("/user/profile");
}
