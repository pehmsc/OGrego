import { NextResponse } from "next/server";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { sql } from "@/app/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  console.log("✅ Clerk webhook hit");

  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("❌ Missing CLERK_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Missing webhook secret" },
      { status: 500 },
    );
  }

  const payload = await req.text();

  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing Svix headers");
    return NextResponse.json(
      { error: "Missing Svix headers" },
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
    console.error("❌ Invalid signature", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("📩 Event type:", evt.type);

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const u = evt.data;

    const clerkUserId = u.id;
    const email = u.email_addresses?.[0]?.email_address ?? null;
    const firstName = u.first_name ?? null;
    const lastName = u.last_name ?? null;
    const imageUrl = u.image_url ?? null;

    try {
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
      console.log("✅ DB upsert OK:", clerkUserId);
    } catch (dbErr) {
      console.error("❌ DB error:", dbErr);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
