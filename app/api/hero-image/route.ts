import { NextResponse } from "next/server";
import { getImageUrlByName } from "@/app/lib/logs";

export async function GET() {
    const url = await getImageUrlByName("homehero");
    if (!url) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json({ url });
}
