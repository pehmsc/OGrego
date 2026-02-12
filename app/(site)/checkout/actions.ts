"use server";

import postgres from "postgres";
import { currentUser } from "@clerk/nextjs/server";
import { sendOrderConfirmation } from "@/app/lib/send-email";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não está definida");
}

const sql = postgres(process.env.DATABASE_URL, {
    ssl: "require",
});

type CartItem = {
    id: number;
    nome: string;
    preco: number;
    quantidade: number;
    imagem: string;
    descricao: string;
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
    items: CartItem[];
    promoCode?: string;
};

export async function createOrder(data: CheckoutData) {
    try {
        console.log("=== INÍCIO CHECKOUT ===");

        // ========================================
        // 1. BUSCAR USER E CONVERTER PARA UUID
        // ========================================
        const user = await currentUser();
        let userUuid = null;

        if (user) {
            console.log("User Clerk ID:", user.id);

            // Buscar UUID da BD
            const userResult = await sql`
        SELECT id 
        FROM users 
        WHERE clerk_user_id = ${user.id}
        LIMIT 1
      `;

            if (userResult.length > 0) {
                userUuid = userResult[0].id;
                console.log("User UUID da BD:", userUuid);
            } else {
                console.warn(
                    "User não encontrado na BD! Criando encomenda sem user_id.",
                );
            }
        } else {
            console.log("User não autenticado (convidado)");
        }

        // ========================================
        // 2. CALCULAR VALORES
        // ========================================
        const subtotalCents = data.items.reduce(
            (acc, item) => acc + Math.round(item.preco * 100) * item.quantidade,
            0,
        );

        let discountCents = 0;

        // Validar código promocional
        if (data.promoCode) {
            const promoResult = await sql`
        SELECT discount_type, discount_value, min_order_value_cents, max_uses, times_used
        FROM promo_codes
        WHERE code = ${data.promoCode.toUpperCase()}
          AND is_active = true
          AND (valid_from IS NULL OR valid_from <= NOW())
          AND (valid_until IS NULL OR valid_until >= NOW())
        LIMIT 1
      `;

            if (promoResult.length > 0) {
                const promo = promoResult[0];

                // Verificar valor mínimo
                if (subtotalCents >= promo.min_order_value_cents) {
                    // Verificar limite de usos
                    if (
                        promo.max_uses === null ||
                        promo.times_used < promo.max_uses
                    ) {
                        // Calcular desconto
                        if (promo.discount_type === "percentage") {
                            discountCents = Math.round(
                                (subtotalCents * promo.discount_value) / 100,
                            );
                        } else if (promo.discount_type === "fixed") {
                            discountCents = promo.discount_value;
                        }
                        console.log(
                            `Código promocional aplicado: ${data.promoCode} (-€${(discountCents / 100).toFixed(2)})`,
                        );
                    }
                }
            }
        }

        const subtotalAfterDiscount = subtotalCents - discountCents;
        const deliveryFeeCents =
            data.orderType === "delivery" && subtotalAfterDiscount < 3000
                ? 250
                : 0;
        const totalCents = subtotalAfterDiscount + deliveryFeeCents;

        console.log("Cálculos:", {
            subtotal: subtotalCents / 100,
            desconto: discountCents / 100,
            portes: deliveryFeeCents / 100,
            total: totalCents / 100,
        });

        // ========================================
        // 3. CRIAR ENCOMENDA
        // ========================================
        console.log("Criando encomenda...");

        const orderResult = await sql`
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
        ${userUuid},
        ${data.customerName},
        ${data.customerEmail},
        ${data.customerPhone || null},
        ${data.orderType},
        ${data.deliveryAddress || null},
        ${data.deliveryPostalCode || null},
        ${data.deliveryCity || null},
        ${subtotalCents},
        ${deliveryFeeCents},
        ${totalCents},
        ${data.promoCode?.toUpperCase() || null},
        ${data.paymentMethod},
        ${data.notes || null},
        'pending',
        NOW(),
        NOW()
      )
      RETURNING id
    `;

        const orderId = orderResult[0].id;
        console.log("Encomenda criada! ID:", orderId);

        // ========================================
        // 4. CRIAR ORDER ITEMS
        // ========================================
        console.log("Criando items da encomenda...");

        for (const item of data.items) {
            const itemPriceCents = Math.round(item.preco * 100);
            const subtotalItemCents = itemPriceCents * item.quantidade;

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
          ${item.id},
          ${item.nome},
          ${itemPriceCents},
          ${item.quantidade},
          ${subtotalItemCents},
          NOW()
        )
      `;
            console.log(
                `  - Item adicionado: ${item.nome} x${item.quantidade}`,
            );
        }

        // ========================================
        // 5. ATUALIZAR CÓDIGO PROMOCIONAL
        // ========================================
        if (data.promoCode && discountCents > 0) {
            await sql`
        UPDATE promo_codes
        SET times_used = times_used + 1
        WHERE code = ${data.promoCode.toUpperCase()}
      `;
            console.log("Código promocional atualizado");
        }

        // ========================================
        // 6. ATUALIZAR PONTOS DO USER (se autenticado)
        // ========================================
        if (userUuid) {
            const pointsToAdd = Math.floor(totalCents / 100);

            await sql`
        UPDATE users
        SET 
          points = points + ${pointsToAdd},
          total_spent_cents = total_spent_cents + ${totalCents},
          updated_at = NOW()
        WHERE id = ${userUuid}
      `;
            console.log(`User atualizado: +${pointsToAdd} pontos`);
        }

        console.log("=== CHECKOUT CONCLUÍDO COM SUCESSO ===");

        // ========================================
        // 7. ENVIAR EMAIL DE CONFIRMAÇÃO
        // ========================================
        console.log("Enviando email de confirmação...");

        const emailResult = await sendOrderConfirmation({
            to: data.customerEmail,
            customerName: data.customerName,
            orderId: orderId,
            orderType: data.orderType,
            deliveryAddress:
                data.orderType === "delivery"
                    ? `${data.deliveryAddress}, ${data.deliveryPostalCode} ${data.deliveryCity}`
                    : undefined,
            items: data.items.map((item) => ({
                name: item.nome,
                quantity: item.quantidade,
                price: item.preco,
                subtotal: item.preco * item.quantidade,
            })),
            subtotal: subtotalCents / 100,
            deliveryFee: deliveryFeeCents / 100,
            total: totalCents / 100,
            paymentMethod: data.paymentMethod,
            notes: data.notes,
        });

        if (emailResult.success) {
            console.log("Email enviado com sucesso");
        } else {
            console.warn("Erro ao enviar email (encomenda criada na mesma)");
        }

        return {
            success: true,
            orderId,
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
