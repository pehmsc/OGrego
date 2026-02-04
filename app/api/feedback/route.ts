export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";

type Body = {
    encomenda: string;
    comentario: string;
    imagem: string; //check this
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as Body;

        // validações simples
        if (!body.encomenda?.trim())
            return NextResponse.json(
                { error: "Referência da encomenda obrigatória" },
                { status: 400 },
            );
        if (!body.comentario?.trim())
            return NextResponse.json(
                { error: "Comentário obrigatório" },
                { status: 400 },
            );

        // INSERT
        await sql`
      INSERT INTO feedback (encomenda, comentario, imagem)
      VALUES (
        ${body.encomenda.trim()},
        ${body.comentario.trim()},
        ${body.imagem}, //check this
    
      )
    `;

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Erro ao enviar feedback" },
            { status: 500 },
        );
    }
}
