import { NextResponse } from "next/server";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { sql } from "@/app/lib/db";

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CLERK_WEBHOOK_SECRET em falta" },
      { status: 500 },
    );
  }

  // Clerk manda o payload + headers para validação Svix
  const payload = await req.text();
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Headers svix em falta" },
      { status: 400 },
    );
  }

  let evt: WebhookEvent;

  try {
    const wh = new Webhook(secret);
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
  }

  const eventType = evt.type;

  // Dados úteis do user
  if (eventType === "user.created" || eventType === "user.updated") {
    const u = evt.data;

    const clerkUserId = u.id;
    const email = u.email_addresses?.[0]?.email_address ?? null;
    const firstName = u.first_name ?? null;
    const lastName = u.last_name ?? null;
    const imageUrl = u.image_url ?? null;

    // UPSERT: cria ou atualiza
    await sql`
      insert into users (clerk_user_id, email, first_name, last_name, image_url, updated_at)
      values (${clerkUserId}, ${email}, ${firstName}, ${lastName}, ${imageUrl}, now())
      on conflict (clerk_user_id)
      do update set
        email = excluded.email,
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        image_url = excluded.image_url,
        updated_at = now()
    `;

    return NextResponse.json({ ok: true });
  }

  // (Opcional) se apagares user no Clerk, podes refletir na BD
  if (eventType === "user.deleted") {
    const clerkUserId = evt.data?.id;
    if (clerkUserId) {
      await sql`delete from users where clerk_user_id = ${clerkUserId}`;
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
