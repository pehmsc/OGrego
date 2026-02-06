export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";

type Body = {
    name: string;
    email: string;
    phone?: string;
    date: string; // "YYYY-MM-DD"
    time: string; // "HH:MM"
    people: string; // vem do input como string
    notes?: string;
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as Body;

        // validações simples
        if (!body.name?.trim())
            return NextResponse.json(
                { error: "Nome obrigatório" },
                { status: 400 },
            );
        if (!body.email?.trim())
            return NextResponse.json(
                { error: "Email obrigatório" },
                { status: 400 },
            );
        if (!body.date)
            return NextResponse.json(
                { error: "Data obrigatória" },
                { status: 400 },
            );
        if (!body.time)
            return NextResponse.json(
                { error: "Hora obrigatória" },
                { status: 400 },
            );

        const people = Number(body.people);
        if (!Number.isFinite(people) || people < 1) {
            return NextResponse.json(
                { error: "Número de pessoas inválido" },
                { status: 400 },
            );
        }

        // INSERT
        await sql`
      INSERT INTO reservas (nome, email, telefone, data, hora, pessoas, notas)
      VALUES (
        ${body.name.trim()},
        ${body.email.trim()},
        ${body.phone?.trim() || null},
        ${body.date},
        ${body.time},
        ${people},
        ${body.notes?.trim() || null}
      )
    `;

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Erro ao guardar reserva" },
            { status: 500 },
        );
    }
}
