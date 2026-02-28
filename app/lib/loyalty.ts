export type LoyaltyLevel = "Bronze" | "Prata" | "Ouro" | "Platina";

export type LoyaltyInfo = {
    level: LoyaltyLevel;
    pointsMin: number;
    pointsMax: number | null;
    pointsToNext: number | null;
    progress: number;
    benefits: string[];
    gradient: string;
    badgeGradient: string;
};

const LEVELS = [
    {
        level: "Bronze" as LoyaltyLevel,
        min: 0,
        max: 50,
        benefits: ["5% desconto"],
        gradient: "from-orange-700 to-orange-500",
        badgeGradient: "from-orange-700 to-orange-500",
    },
    {
        level: "Prata" as LoyaltyLevel,
        min: 51,
        max: 100,
        benefits: ["8% desconto", "Entrega grátis"],
        gradient: "from-zinc-400 to-zinc-600",
        badgeGradient: "from-zinc-400 to-zinc-600",
    },
    {
        level: "Ouro" as LoyaltyLevel,
        min: 101,
        max: 150,
        benefits: ["10% desconto", "Entrega grátis"],
        gradient: "from-yellow-400 to-yellow-600",
        badgeGradient: "from-yellow-400 to-yellow-600",
    },
    {
        level: "Platina" as LoyaltyLevel,
        min: 151,
        max: null,
        benefits: ["15% desconto", "Entrega grátis"],
        gradient: "from-sky-400 to-indigo-600",
        badgeGradient: "from-sky-400 to-indigo-600",
    },
];

export function getLoyaltyInfo(points: number): LoyaltyInfo {
    const currentIndex =
        [...LEVELS]
            .map((l, i) => ({ ...l, i }))
            .reverse()
            .find((l) => points >= l.min)?.i ?? 0;

    const current = LEVELS[currentIndex];
    const next = LEVELS[currentIndex + 1] ?? null;

    const pointsToNext = next ? next.min - points : null;

    let progress = 100;
    if (current.max !== null) {
        const range = current.max - current.min;
        const done = points - current.min;
        progress = Math.min(100, Math.max(0, Math.round((done / range) * 100)));
    }

    return {
        level: current.level,
        pointsMin: current.min,
        pointsMax: current.max,
        pointsToNext,
        progress,
        benefits: current.benefits,
        gradient: current.gradient,
        badgeGradient: current.badgeGradient,
    };
}

export function getLoyaltyDiscountPercent(points: number): number {
    const info = getLoyaltyInfo(points);
    switch (info.level) {
        case "Bronze":
            return 5;
        case "Prata":
            return 8;
        case "Ouro":
            return 10;
        case "Platina":
            return 15;
    }
}

export function hasLoyaltyFreeDelivery(points: number): boolean {
    const info = getLoyaltyInfo(points);
    return info.level !== "Bronze";
}
