import { stripe } from "@/app/lib/stripe";
import { sql } from "@/app/lib/db";
import { sendOrderConfirmation } from "@/app/lib/send-email";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

type OrderRow = {
  id: number;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  order_type: string;
  delivery_address: string | null;
  delivery_postal_code: string | null;
  delivery_city: string | null;
  subtotal_cents: number;
  delivery_fee_cents: number | null;
  total_cents: number;
  payment_method: string | null;
  notes: string | null;
};

type OrderItemRow = {
  item_name: string;
  item_price_cents: number;
  quantity: number;
  subtotal_cents: number;
};

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("[stripe:webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = Number(session.metadata?.orderId);

    if (!orderId) {
      console.error("[stripe:webhook] Missing orderId in metadata");
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    console.log("[stripe:webhook] Payment completed for order:", orderId);

    try {
      // 1. Atualizar status da order para 'pending' (confirmada)
      await sql`
                UPDATE orders
                SET status = 'pending', updated_at = NOW()
                WHERE id = ${orderId} AND status = 'awaiting_payment'
            `;

      // 2. Buscar dados da order para pontos e email
      const orderRows = await sql<OrderRow[]>`
                SELECT id, user_id, customer_name, customer_email, customer_phone,
                       order_type, delivery_address, delivery_postal_code, delivery_city,
                       subtotal_cents, delivery_fee_cents, total_cents, payment_method, notes
                FROM orders
                WHERE id = ${orderId}
            `;

      const order = orderRows[0];
      if (!order) {
        console.error("[stripe:webhook] Order not found:", orderId);
        return NextResponse.json({ received: true });
      }

      // 3. Adicionar pontos ao user
      if (order.user_id) {
        const pointsToAdd = Math.floor(order.total_cents / 100);
        await sql`
                    UPDATE users
                    SET
                        points = points + ${pointsToAdd},
                        total_spent_cents = total_spent_cents + ${order.total_cents},
                        updated_at = NOW()
                    WHERE id = ${order.user_id}::uuid
                `;
      }

      // 4. Buscar items da order para o email
      const itemRows = await sql<OrderItemRow[]>`
                SELECT item_name, item_price_cents, quantity, subtotal_cents
                FROM order_items
                WHERE order_id = ${orderId}
            `;

      // 5. Enviar email de confirmação
      const deliveryAddress =
        order.order_type === "delivery" && order.delivery_address
          ? `${order.delivery_address}, ${order.delivery_postal_code} ${order.delivery_city}`
          : undefined;

      const emailResult = await sendOrderConfirmation({
        to: order.customer_email,
        customerName: order.customer_name,
        orderId,
        orderType: order.order_type as "delivery" | "takeaway",
        deliveryAddress,
        items: itemRows.map((item) => ({
          name: item.item_name,
          quantity: item.quantity,
          price: item.item_price_cents / 100,
          subtotal: item.subtotal_cents / 100,
        })),
        subtotal: order.subtotal_cents / 100,
        deliveryFee: (order.delivery_fee_cents ?? 0) / 100,
        total: order.total_cents / 100,
        paymentMethod: order.payment_method ?? "card",
        notes: order.notes ?? undefined,
      });

      if (!emailResult.success) {
        console.warn("[stripe:webhook:email]", {
          orderId,
          reason: emailResult.error,
        });
      } else {
        console.log("[stripe:webhook:email] Sent for order:", orderId);
      }
    } catch (error) {
      console.error("[stripe:webhook] Error processing order:", error);
      // Retornar 200 na mesma para o Stripe não retentar infinitamente
      // O erro fica nos logs para debug
    }
  }

  return NextResponse.json({ received: true });
}
