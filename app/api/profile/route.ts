import { getCurrentUserDb } from "@/app/lib/current-user";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const userDb = await getCurrentUserDb();

        const user = {
            name:
                [userDb.first_name, userDb.last_name]
                    .filter(Boolean)
                    .join(" ") || "",
            email: userDb.email ?? "",
            phone: userDb.phone ?? "",
            nif: userDb.nif ?? "",
            address: userDb.address ?? "",
            favoriteRestaurant: userDb.favorite_restaurant ?? "",
            imageUrl: userDb.image_url ?? "",
            points: userDb.points ?? 0,
        };

        return NextResponse.json(user);
    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        return NextResponse.json(
            { error: "Erro ao buscar perfil" },
            { status: 500 },
        );
    }
}
