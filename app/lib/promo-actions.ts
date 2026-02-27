"use server";

import { sql } from "@/app/lib/db";

type PromoCodeValidationResult = {
    valid: boolean;
    message: string;
    discountCents?: number;
    discountType?: "percentage" | "fixed";
    discountValue?: number;
};

type PromoCodeRow = {
    id: number;
    code: string;
    discount_type: "percentage" | "fixed";
    discount_value: number;
    min_order_value_cents: number;
    max_uses: number | null;
    times_used: number;
    valid_from: string;
    valid_until: string | null;
    is_active: boolean;
};

export async function validatePromoCodeInCart(
    code: string,
    subtotalCents: number,
): Promise<PromoCodeValidationResult> {
    try {
        // Validação básica
        if (!code || !code.trim()) {
            return { valid: false, message: "Código vazio" };
        }

        // Buscar promo code da BD
        const result = (await sql`
            SELECT 
                id,
                code,
                discount_type,
                discount_value,
                min_order_value_cents,
                max_uses,
                times_used,
                valid_from,
                valid_until,
                is_active
            FROM promo_codes
            WHERE UPPER(code) = UPPER(${code.trim()})
            LIMIT 1
        `) as PromoCodeRow[];

        // Verificar se existe
        if (result.length === 0) {
            return { valid: false, message: "Código inválido" };
        }

        const promo = result[0];

        // Verificar se está ativo
        if (!promo.is_active) {
            return { valid: false, message: "Código inválido ou expirado" };
        }

        // Verificar datas
        const now = new Date();
        const validFrom = new Date(promo.valid_from);
        const validUntil = promo.valid_until
            ? new Date(promo.valid_until)
            : null;

        if (now < validFrom) {
            return { valid: false, message: "Código ainda não está ativo" };
        }

        if (validUntil && now > validUntil) {
            return { valid: false, message: "Código expirado" };
        }

        // Verificar número de usos
        if (promo.max_uses !== null && promo.times_used >= promo.max_uses) {
            return { valid: false, message: "Código esgotado" };
        }

        // Verificar valor mínimo
        if (subtotalCents < promo.min_order_value_cents) {
            const minValue = (promo.min_order_value_cents / 100).toFixed(2);
            return {
                valid: false,
                message: `Pedido mínimo de €${minValue}`,
            };
        }

        // Calcular desconto
        let discountCents = 0;
        if (promo.discount_type === "percentage") {
            // Percentagem: valor é % (ex: 10 = 10%)
            discountCents = Math.round(
                (subtotalCents * promo.discount_value) / 100,
            );
        } else {
            // Fixed: valor já está em cêntimos (ex: 500 = €5)
            discountCents = promo.discount_value;
        }

        // Desconto não pode ser maior que o subtotal
        if (discountCents > subtotalCents) {
            discountCents = subtotalCents;
        }

        // Retorno de sucesso
        return {
            valid: true,
            message: `Desconto de €${(discountCents / 100).toFixed(2)} aplicado!`,
            discountCents,
            discountType: promo.discount_type,
            discountValue: promo.discount_value,
        };
    } catch (error) {
        console.error("Erro ao validar promo code:", error);
        return { valid: false, message: "Erro ao validar código" };
    }
}

export type Promo = {
    code: string;
    discount: string;
    minOrder: string;
    usageLimit: string;
    validFrom: string;
    validUntil: string;
    image: string | null;
};
export async function getPromos(): Promise<Promo[]> {
    const rows = await sql<
        {
            code: string;
            discount_type: string;
            discount_value: number;
            min_order_value_cents: number;
            max_uses: number | null;
            times_used: number;
            valid_from: string;
            valid_until: string | null;
            image: string | null;
        }[]
    >`        SELECT            code,            discount_type,            discount_value,            min_order_value_cents,            max_uses,            times_used,            valid_from::text,            valid_until::text,            image        FROM promo_codes        WHERE is_active = true        ORDER BY id ASC    `;
    return rows.map((r) => ({
        code: r.code,
        discount:
            r.discount_type === "percentage"
                ? `${r.discount_value}% de desconto`
                : `${(r.discount_value / 100).toFixed(2).replace(".", ",")} € de desconto fixo`,
        minOrder:
            r.min_order_value_cents === 0
                ? "Sem mínimo de encomenda"
                : `Mínimo de ${(r.min_order_value_cents / 100).toFixed(2).replace(".", ",")} €`,
        usageLimit:
            r.max_uses === null
                ? "Utilizações ilimitadas"
                : `Até ${r.max_uses} utilizações`,
        validFrom: r.valid_from
            ? new Date(r.valid_from).toLocaleDateString("pt-PT")
            : "—",
        validUntil: r.valid_until
            ? new Date(r.valid_until).toLocaleDateString("pt-PT")
            : "—",
        image: r.image ?? null,
    }));
}
