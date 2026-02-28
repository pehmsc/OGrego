import { NextResponse } from "next/server";
import { getPromos } from "@/app/lib/promo-actions";

export async function GET() {
    const promos = await getPromos();
    // Apenas imagens não nulas
    const images = promos.map((promo) => promo.image).filter(Boolean);
    return NextResponse.json(images);
}
