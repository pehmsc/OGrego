import "server-only";

import type { UserRole } from "@/src/lib/roles";

const ADMIN_DISCOUNT_PERCENT = 50;
const DELIVERY_FREE_THRESHOLD_CENTS = 3000;
const DELIVERY_FEE_CENTS = 250;

export type CheckoutOrderType = "delivery" | "takeaway";

export type CheckoutPricingItemInput = {
    id: string;
    quantity: number;
};

export type PricedCatalogItem = {
    id: string;
    name: string;
    unit_price_cents: number;
};

export type PricingPromoCandidate = {
    code: string;
    discount_type: "percentage" | "fixed";
    discount_value: number;
    min_order_value_cents: number;
    max_uses: number | null;
    times_used: number;
};

export type ValidatedCheckoutItem = {
    menuItemId: string;
    name: string;
    quantity: number;
    unitPriceCents: number;
    subtotalCents: number;
};

export type CheckoutPricingBreakdown = {
    items: ValidatedCheckoutItem[];
    productSubtotalCents: number;
    discountCents: number;
    discountKind: "none" | "promo" | "admin";
    deliveryFeeCents: number;
    totalCents: number;
    appliedPromoCode: string | null;
    shouldIncrementPromoUsage: boolean;
};

type PricingInput = {
    items: CheckoutPricingItemInput[];
    orderType: CheckoutOrderType;
    role: UserRole;
    promoCode?: string;
};

type PricingDeps = {
    fetchPricedItems: (ids: string[]) => Promise<PricedCatalogItem[]>;
    fetchPromoByCode?: (normalizedCode: string) => Promise<PricingPromoCandidate | null>;
};

function normalizeAndAggregateItems(items: CheckoutPricingItemInput[]) {
    if (!items.length) {
        throw new Error("Carrinho vazio.");
    }

    const quantities = new Map<string, number>();

    for (const item of items) {
        const id = String(item.id).trim();
        const quantity = Number(item.quantity);

        if (!id) {
            throw new Error("Item inválido no carrinho.");
        }
        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error(`Quantidade inválida para o item ${id}.`);
        }

        quantities.set(id, (quantities.get(id) ?? 0) + quantity);
    }

    return Array.from(quantities.entries()).map(([id, quantity]) => ({
        id,
        quantity,
    }));
}

function applyPromoDiscount(
    promo: PricingPromoCandidate | null,
    productSubtotalCents: number,
) {
    if (!promo) {
        return {
            discountCents: 0,
            appliedPromoCode: null,
            shouldIncrementPromoUsage: false,
        };
    }

    if (productSubtotalCents < Number(promo.min_order_value_cents)) {
        return {
            discountCents: 0,
            appliedPromoCode: null,
            shouldIncrementPromoUsage: false,
        };
    }

    if (
        promo.max_uses !== null &&
        Number(promo.times_used) >= Number(promo.max_uses)
    ) {
        return {
            discountCents: 0,
            appliedPromoCode: null,
            shouldIncrementPromoUsage: false,
        };
    }

    let discountCents = 0;
    if (promo.discount_type === "percentage") {
        discountCents = Math.round(
            (productSubtotalCents * Number(promo.discount_value)) / 100,
        );
    } else {
        discountCents = Math.round(Number(promo.discount_value));
    }

    discountCents = Math.max(0, Math.min(discountCents, productSubtotalCents));

    return {
        discountCents,
        appliedPromoCode: discountCents > 0 ? String(promo.code).trim().toUpperCase() : null,
        shouldIncrementPromoUsage: discountCents > 0,
    };
}

export async function calculateCheckoutPricing(
    input: PricingInput,
    deps: PricingDeps,
): Promise<CheckoutPricingBreakdown> {
    if (input.orderType !== "delivery" && input.orderType !== "takeaway") {
        throw new Error("Tipo de encomenda inválido.");
    }

    const normalizedItems = normalizeAndAggregateItems(input.items);
    const requestedIds = normalizedItems.map((item) => item.id);
    const pricedItems = await deps.fetchPricedItems(requestedIds);

    const pricedById = new Map<string, PricedCatalogItem>();
    for (const pricedItem of pricedItems) {
        const id = String(pricedItem.id).trim();
        if (!id) continue;

        const unitPriceCents = Math.round(Number(pricedItem.unit_price_cents));
        if (!Number.isInteger(unitPriceCents) || unitPriceCents < 0) {
            throw new Error(`Preço inválido para o item ${id}.`);
        }

        const itemName = String(pricedItem.name ?? "").trim() || `Item ${id}`;

        pricedById.set(id, {
            id,
            name: itemName,
            unit_price_cents: unitPriceCents,
        });
    }

    const validatedItems: ValidatedCheckoutItem[] = normalizedItems.map((item) => {
        const priced = pricedById.get(item.id);
        if (!priced) {
            throw new Error(`Item não encontrado: ${item.id}`);
        }

        const subtotalCents = priced.unit_price_cents * item.quantity;
        return {
            menuItemId: item.id,
            name: priced.name,
            quantity: item.quantity,
            unitPriceCents: priced.unit_price_cents,
            subtotalCents,
        };
    });

    const productSubtotalCents = validatedItems.reduce(
        (acc, item) => acc + item.subtotalCents,
        0,
    );

    let discountCents = 0;
    let discountKind: CheckoutPricingBreakdown["discountKind"] = "none";
    let appliedPromoCode: string | null = null;
    let shouldIncrementPromoUsage = false;

    // Regra de negócio: admin tem sempre -50% nos produtos e substitui promoções.
    if (input.role === "admin") {
        discountCents = Math.round(
            (productSubtotalCents * ADMIN_DISCOUNT_PERCENT) / 100,
        );
        discountKind = discountCents > 0 ? "admin" : "none";
    } else if (deps.fetchPromoByCode) {
        const normalizedCode = input.promoCode?.trim().toUpperCase();
        if (normalizedCode) {
            const promo = await deps.fetchPromoByCode(normalizedCode);
            const promoResult = applyPromoDiscount(promo, productSubtotalCents);
            discountCents = promoResult.discountCents;
            appliedPromoCode = promoResult.appliedPromoCode;
            shouldIncrementPromoUsage = promoResult.shouldIncrementPromoUsage;
            discountKind = discountCents > 0 ? "promo" : "none";
        }
    }

    const subtotalAfterDiscountCents = Math.max(
        0,
        productSubtotalCents - discountCents,
    );
    const deliveryFeeCents =
        input.orderType === "delivery" &&
        subtotalAfterDiscountCents < DELIVERY_FREE_THRESHOLD_CENTS
            ? DELIVERY_FEE_CENTS
            : 0;
    const totalCents = subtotalAfterDiscountCents + deliveryFeeCents;

    return {
        items: validatedItems,
        productSubtotalCents,
        discountCents,
        discountKind,
        deliveryFeeCents,
        totalCents,
        appliedPromoCode,
        shouldIncrementPromoUsage,
    };
}
