"use server";

import { sql } from "@/app/lib/db";
import { stripe } from "@/app/lib/stripe";
import { sendOrderConfirmation } from "@/app/lib/send-email";
import { getAuthenticatedUserContext, type UserRole } from "@/src/lib/auth";
import { calculateCheckoutPricing } from "@/src/lib/pricing";
import { getMenuItemsByIds } from "@/src/server/catalog";
import type Stripe from "stripe";

type CheckoutItemInput = {
  id: number | string;
  quantidade: number;
};

type CheckoutData = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: "delivery" | "takeaway";
  deliveryAddress?: string;
  deliveryPostalCode?: string;
  deliveryCity?: string;
  paymentMethod: string;
  notes?: string;
  items: CheckoutItemInput[];
  promoCode?: string;
};

type CreateOrderResult =
  | {
      success: true;
      orderId: number;
      checkoutUrl?: string | null;
      breakdown: {
        subtotalCents: number;
        discountCents: number;
        deliveryFeeCents: number;
        totalCents: number;
      };
    }
  | {
      success: false;
      error: string;
    };

type CheckoutPricingBreakdown = {
  subtotalCents: number;
  discountCents: number;
  discountKind: "none" | "promo" | "admin";
  deliveryFeeCents: number;
  totalCents: number;
  appliedPromoCode: string | null;
};

type CheckoutPricingPreviewResult =
  | {
      success: true;
      role: UserRole;
      breakdown: CheckoutPricingBreakdown;
    }
  | {
      success: false;
      error: string;
    };

type PromoCodeRow = {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_value_cents: number;
  max_uses: number | null;
  times_used: number;
};

type DbColumnExistsRow = {
  exists: boolean;
};

let hasOrdersDiscountCentsColumnPromise: Promise<boolean> | null = null;

async function hasOrdersDiscountCentsColumn(): Promise<boolean> {
  if (hasOrdersDiscountCentsColumnPromise) {
    return hasOrdersDiscountCentsColumnPromise;
  }

  hasOrdersDiscountCentsColumnPromise = (async () => {
    const rows = await sql<DbColumnExistsRow[]>`
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'orders'
                  AND column_name = 'discount_cents'
            ) AS exists
        `;

    return Boolean(rows[0]?.exists);
  })().catch((error) => {
    hasOrdersDiscountCentsColumnPromise = null;
    throw error;
  });

  return hasOrdersDiscountCentsColumnPromise;
}

function getPostgresErrorCode(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : null;
}

function getPostgresErrorMetadata(error: unknown) {
  if (!error || typeof error !== "object") return null;

  const err = error as {
    code?: unknown;
    table?: unknown;
    column?: unknown;
    constraint?: unknown;
    detail?: unknown;
    hint?: unknown;
  };

  return {
    code: typeof err.code === "string" ? err.code : null,
    table: typeof err.table === "string" ? err.table : null,
    column: typeof err.column === "string" ? err.column : null,
    constraint: typeof err.constraint === "string" ? err.constraint : null,
    detail: typeof err.detail === "string" ? err.detail : null,
    hint: typeof err.hint === "string" ? err.hint : null,
  };
}

function mapCheckoutItemsToPricingItems(items: CheckoutItemInput[]) {
  return items.map((item) => ({
    id: String(item.id),
    quantity: item.quantidade,
  }));
}

// ========================================
// STRIPE: Mapear métodos de pagamento
// ========================================
function getStripePaymentMethods(
  method: string,
): Stripe.Checkout.SessionCreateParams.PaymentMethodType[] {
  switch (method) {
    case "mbway":
      return ["card", "mb_way"];
    case "multibanco":
      return ["card", "multibanco"];
    case "card":
      return ["card"];
    default:
      return ["card"];
  }
}

function isStripePayment(paymentMethod: string): boolean {
  return paymentMethod !== "cash";
}

async function calculateServerCheckoutPricing(params: {
  items: CheckoutItemInput[];
  orderType: "delivery" | "takeaway";
  role: UserRole;
  promoCode?: string;
}) {
  const normalizedCartItems = mapCheckoutItemsToPricingItems(params.items);

  console.log("[checkout:pricing:input]", {
    role: params.role,
    orderType: params.orderType,
    cartItems: normalizedCartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    })),
    promoCode: params.promoCode ? "provided" : "none",
  });

  return calculateCheckoutPricing(
    {
      items: normalizedCartItems,
      orderType: params.orderType,
      role: params.role,
      promoCode: params.promoCode,
    },
    {
      fetchPricedItems: async (ids) => {
        const menuItems = await getMenuItemsByIds(ids);

        console.log("[checkout:pricing:catalog]", {
          requestedIds: ids,
          returnedItems: menuItems.map((item) => ({
            id: item.id,
            hasName: item.name.trim().length > 0,
            priceCents: item.price_cents,
          })),
        });

        return menuItems.map((item) => ({
          id: item.id,
          name: item.name,
          unit_price_cents: item.price_cents,
        }));
      },
      fetchPromoByCode: async (normalizedCode) => {
        const rows = await sql<PromoCodeRow[]>`
                    SELECT code, discount_type, discount_value, min_order_value_cents, max_uses, times_used
                    FROM promo_codes
                    WHERE code = ${normalizedCode}
                      AND is_active = true
                      AND (valid_from IS NULL OR valid_from <= NOW())
                      AND (valid_until IS NULL OR valid_until >= NOW())
                    LIMIT 1
                `;
        return rows[0] ?? null;
      },
    },
  );
}

function toCheckoutBreakdown(
  pricing: Awaited<ReturnType<typeof calculateServerCheckoutPricing>>,
): CheckoutPricingBreakdown {
  return {
    subtotalCents: pricing.productSubtotalCents,
    discountCents: pricing.discountCents,
    discountKind: pricing.discountKind,
    deliveryFeeCents: pricing.deliveryFeeCents,
    totalCents: pricing.totalCents,
    appliedPromoCode: pricing.appliedPromoCode,
  };
}

export async function getCheckoutPricingPreview(input: {
  items: CheckoutItemInput[];
  orderType: "delivery" | "takeaway";
  promoCode?: string;
}): Promise<CheckoutPricingPreviewResult> {
  try {
    const authContext = await getAuthenticatedUserContext();
    if (!authContext) {
      return {
        success: false,
        error: "Necessário iniciar sessão para calcular o total.",
      };
    }

    const pricing = await calculateServerCheckoutPricing({
      items: input.items,
      orderType: input.orderType,
      role: authContext.role,
      promoCode: input.promoCode,
    });

    const breakdown = toCheckoutBreakdown(pricing);

    console.log("[checkout:preview]", {
      role: authContext.role,
      subtotalCents: breakdown.subtotalCents,
      discountCents: breakdown.discountCents,
      totalCents: breakdown.totalCents,
    });

    return {
      success: true,
      role: authContext.role,
      breakdown,
    };
  } catch (error) {
    console.error("Erro ao calcular preview do checkout:", error);
    return {
      success: false,
      error: "Erro ao calcular total do checkout.",
    };
  }
}

export async function createOrder(
  data: CheckoutData,
): Promise<CreateOrderResult> {
  try {
    const authContext = await getAuthenticatedUserContext();
    if (!authContext) {
      return {
        success: false,
        error: "Necessário iniciar sessão para finalizar a encomenda.",
      };
    }

    const pricing = await calculateServerCheckoutPricing({
      items: data.items,
      orderType: data.orderType,
      role: authContext.role,
      promoCode: data.promoCode,
    });

    const breakdown = toCheckoutBreakdown(pricing);
    const useStripe = isStripePayment(data.paymentMethod);

    // Status: 'awaiting_payment' para Stripe, 'pending' para cash
    const initialStatus = useStripe ? "awaiting_payment" : "pending";

    console.log("[checkout:createOrder]", {
      role: authContext.role,
      subtotalCents: breakdown.subtotalCents,
      discountCents: breakdown.discountCents,
      totalCents: breakdown.totalCents,
      paymentMethod: data.paymentMethod,
      useStripe,
      initialStatus,
    });

    const supportsDiscountCents = await hasOrdersDiscountCentsColumn();

    // ========================================
    // INSERIR ORDER NA DB
    // ========================================
    const orderResult = supportsDiscountCents
      ? await sql<{ id: number }[]>`
                  INSERT INTO orders (
                      user_id,
                      customer_name,
                      customer_email,
                      customer_phone,
                      order_type,
                      delivery_address,
                      delivery_postal_code,
                      delivery_city,
                      subtotal_cents,
                      discount_cents,
                      delivery_fee_cents,
                      total_cents,
                      promo_code,
                      payment_method,
                      notes,
                      status,
                      created_at,
                      updated_at
                  ) VALUES (
                      ${authContext.dbUserId},
                      ${data.customerName},
                      ${data.customerEmail},
                      ${data.customerPhone || null},
                      ${data.orderType},
                      ${data.deliveryAddress || null},
                      ${data.deliveryPostalCode || null},
                      ${data.deliveryCity || null},
                      ${pricing.productSubtotalCents},
                      ${pricing.discountCents},
                      ${pricing.deliveryFeeCents},
                      ${pricing.totalCents},
                      ${pricing.appliedPromoCode},
                      ${data.paymentMethod},
                      ${data.notes || null},
                      ${initialStatus},
                      NOW(),
                      NOW()
                  )
                  RETURNING id
              `
      : await sql<{ id: number }[]>`
                  INSERT INTO orders (
                      user_id,
                      customer_name,
                      customer_email,
                      customer_phone,
                      order_type,
                      delivery_address,
                      delivery_postal_code,
                      delivery_city,
                      subtotal_cents,
                      delivery_fee_cents,
                      total_cents,
                      promo_code,
                      payment_method,
                      notes,
                      status,
                      created_at,
                      updated_at
                  ) VALUES (
                      ${authContext.dbUserId},
                      ${data.customerName},
                      ${data.customerEmail},
                      ${data.customerPhone || null},
                      ${data.orderType},
                      ${data.deliveryAddress || null},
                      ${data.deliveryPostalCode || null},
                      ${data.deliveryCity || null},
                      ${pricing.productSubtotalCents},
                      ${pricing.deliveryFeeCents},
                      ${pricing.totalCents},
                      ${pricing.appliedPromoCode},
                      ${data.paymentMethod},
                      ${data.notes || null},
                      ${initialStatus},
                      NOW(),
                      NOW()
                  )
                  RETURNING id
              `;

    const orderId = orderResult[0].id;

    // ========================================
    // INSERIR ORDER ITEMS
    // ========================================
    for (const item of pricing.items) {
      await sql`
                INSERT INTO order_items (
                    order_id,
                    menu_item_id,
                    item_name,
                    item_price_cents,
                    quantity,
                    subtotal_cents,
                    created_at
                ) VALUES (
                    ${orderId},
                    ${item.menuItemId},
                    ${item.name},
                    ${item.unitPriceCents},
                    ${item.quantity},
                    ${item.subtotalCents},
                    NOW()
                )
            `;
    }

    // ========================================
    // INCREMENTAR USO DO PROMO CODE
    // ========================================
    if (pricing.shouldIncrementPromoUsage && pricing.appliedPromoCode) {
      await sql`
                UPDATE promo_codes
                SET times_used = times_used + 1
                WHERE code = ${pricing.appliedPromoCode}
            `;
    }

    // ========================================
    // STRIPE: Criar checkout session
    // ========================================
    if (useStripe) {
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        pricing.items.map((item) => ({
          price_data: {
            currency: "eur",
            product_data: { name: item.name },
            unit_amount: item.unitPriceCents,
          },
          quantity: item.quantity,
        }));

      // Adicionar taxa de entrega como line item
      if (pricing.deliveryFeeCents > 0) {
        lineItems.push({
          price_data: {
            currency: "eur",
            product_data: { name: "Taxa de entrega" },
            unit_amount: pricing.deliveryFeeCents,
          },
          quantity: 1,
        });
      }

      // Adicionar desconto como coupon do Stripe (se houver)
      let discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
      if (pricing.discountCents > 0) {
        const coupon = await stripe.coupons.create({
          amount_off: pricing.discountCents,
          currency: "eur",
          duration: "once",
          name:
            pricing.discountKind === "admin"
              ? "Desconto Admin"
              : "Desconto Promocional",
        });
        discounts = [{ coupon: coupon.id }];
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      const session = await stripe.checkout.sessions.create({
        payment_method_types: getStripePaymentMethods(data.paymentMethod),
        line_items: lineItems,
        discounts,
        mode: "payment",
        success_url: `${appUrl}/order-success/${orderId}`,
        cancel_url: `${appUrl}/checkout`,
        customer_email: data.customerEmail,
        metadata: {
          orderId: String(orderId),
        },
      });

      // Guardar stripe_session_id na order
      await sql`
                UPDATE orders
                SET stripe_session_id = ${session.id}, updated_at = NOW()
                WHERE id = ${orderId}
            `;

      console.log("[checkout:stripe]", {
        orderId,
        sessionId: session.id,
        paymentMethods: getStripePaymentMethods(data.paymentMethod),
      });

      return {
        success: true,
        orderId,
        checkoutUrl: session.url,
        breakdown: {
          subtotalCents: breakdown.subtotalCents,
          discountCents: breakdown.discountCents,
          deliveryFeeCents: breakdown.deliveryFeeCents,
          totalCents: breakdown.totalCents,
        },
      };
    }

    // ========================================
    // CASH: Fluxo direto (sem Stripe)
    // ========================================
    if (authContext.dbUserId) {
      const pointsToAdd = Math.floor(pricing.totalCents / 100);

      await sql`
                UPDATE users
                SET
                    points = points + ${pointsToAdd},
                    total_spent_cents = total_spent_cents + ${pricing.totalCents},
                    updated_at = NOW()
                WHERE id = ${authContext.dbUserId}
            `;
    }

    const emailResult = await sendOrderConfirmation({
      to: data.customerEmail,
      customerName: data.customerName,
      orderId,
      orderType: data.orderType,
      deliveryAddress:
        data.orderType === "delivery"
          ? `${data.deliveryAddress}, ${data.deliveryPostalCode} ${data.deliveryCity}`
          : undefined,
      items: pricing.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.unitPriceCents / 100,
        subtotal: item.subtotalCents / 100,
      })),
      subtotal: pricing.productSubtotalCents / 100,
      deliveryFee: pricing.deliveryFeeCents / 100,
      total: pricing.totalCents / 100,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
    });

    if (!emailResult.success) {
      console.warn("[checkout:createOrder:email]", {
        orderId,
        customerEmail: data.customerEmail,
        reason: emailResult.error,
      });
    }

    return {
      success: true,
      orderId,
      checkoutUrl: null,
      breakdown: {
        subtotalCents: breakdown.subtotalCents,
        discountCents: breakdown.discountCents,
        deliveryFeeCents: breakdown.deliveryFeeCents,
        totalCents: breakdown.totalCents,
      },
    };
  } catch (error) {
    const pgError = getPostgresErrorMetadata(error);
    console.error("Erro ao criar encomenda:", {
      message: error instanceof Error ? error.message : String(error),
      postgres: pgError,
    });

    const pgCode = getPostgresErrorCode(error);
    const errorMessage =
      pgCode === "42703"
        ? "Erro de base de dados ao criar encomenda (coluna SQL inválida)."
        : error instanceof Error
          ? error.message
          : "Erro ao processar encomenda";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
