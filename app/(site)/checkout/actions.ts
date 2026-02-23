"use server";

import { sql } from "@/app/lib/db";
import { sendOrderConfirmation } from "@/app/lib/send-email";
import { getAuthenticatedUserContext, type UserRole } from "@/src/lib/auth";
import { calculateCheckoutPricing } from "@/src/lib/pricing";
import { getMenuItemsByIds } from "@/src/server/catalog";

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

function mapCheckoutItemsToPricingItems(items: CheckoutItemInput[]) {
    return items.map((item) => ({
        id: String(item.id),
        quantity: item.quantidade,
    }));
}

async function calculateServerCheckoutPricing(params: {
    items: CheckoutItemInput[];
    orderType: "delivery" | "takeaway";
    role: UserRole;
    promoCode?: string;
}) {
    return calculateCheckoutPricing(
        {
            items: mapCheckoutItemsToPricingItems(params.items),
            orderType: params.orderType,
            role: params.role,
            promoCode: params.promoCode,
        },
        {
            fetchPricedItems: async (ids) => {
                const menuItems = await getMenuItemsByIds(ids);
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

export async function createOrder(data: CheckoutData): Promise<CreateOrderResult> {
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

        console.log("[checkout:createOrder]", {
            role: authContext.role,
            subtotalCents: breakdown.subtotalCents,
            discountCents: breakdown.discountCents,
            totalCents: breakdown.totalCents,
        });

        const orderResult = await sql<{ id: number }[]>`
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
                'pending',
                NOW(),
                NOW()
            )
            RETURNING id
        `;

        const orderId = orderResult[0].id;

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

        if (pricing.shouldIncrementPromoUsage && pricing.appliedPromoCode) {
            await sql`
                UPDATE promo_codes
                SET times_used = times_used + 1
                WHERE code = ${pricing.appliedPromoCode}
            `;
        }

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

        await sendOrderConfirmation({
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

        return {
            success: true,
            orderId,
            breakdown: {
                subtotalCents: breakdown.subtotalCents,
                discountCents: breakdown.discountCents,
                deliveryFeeCents: breakdown.deliveryFeeCents,
                totalCents: breakdown.totalCents,
            },
        };
    } catch (error) {
        console.error("Erro ao criar encomenda:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Erro ao processar encomenda",
        };
    }
}
