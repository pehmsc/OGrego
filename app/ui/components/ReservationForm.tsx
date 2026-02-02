"use client";

import { useState } from "react";

type FormState = {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    people: string;
    notes: string;
};

type Status = "idle" | "loading" | "ok" | "error";

export default function ReservationForm() {
    const [status, setStatus] = useState<Status>("idle");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        people: "2",
        notes: "",
    });

    function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((p) => ({ ...p, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setStatus("loading");
        setErrorMsg(null);

        try {
            const res = await fetch("/api/reservas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data: any = await res.json().catch(() => ({}));

            if (!res.ok) {
                setStatus("error");
                setErrorMsg(
                    data.error ||
                        "Não foi possível enviar o pedido de reserva. Tente novamente",
                );
                return;
            }

            setStatus("ok");

            setForm({
                name: "",
                email: "",
                phone: "",
                date: "",
                time: "",
                people: "2",
                notes: "",
            });
        } catch {
            setStatus("error");
            setErrorMsg("Falha de rede. Verifique a ligação e tente novamente");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#1E3A8A]/80">
                        Nome
                    </span>
                    <input
                        required
                        value={form.name}
                        onChange={(e) => onChange("name", e.target.value)}
                        className="h-11 rounded-2xl border border-[#1E3A8A]/15 bg-white px-4 text-sm outline-none focus:border-[#1E3A8A]/35"
                    />
                </label>

                <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#1E3A8A]/80">
                        Email
                    </span>
                    <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => onChange("email", e.target.value)}
                        className="h-11 rounded-2xl border border-[#1E3A8A]/15 bg-white px-4 text-sm outline-none focus:border-[#1E3A8A]/35"
                    />
                </label>
            </div>

            <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#1E3A8A]/80">
                    Telefone (opcional)
                </span>
                <input
                    value={form.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                    className="h-11 rounded-2xl border border-[#1E3A8A]/15 bg-white px-4 text-sm outline-none focus:border-[#1E3A8A]/35"
                />
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
                <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#1E3A8A]/80">
                        Data
                    </span>
                    <input
                        required
                        type="date"
                        value={form.date}
                        onChange={(e) => onChange("date", e.target.value)}
                        placeholder="dd-mm-yyyy"
                        className="h-11 rounded-2xl border border-[#1E3A8A]/15 bg-white px-4 text-sm outline-none focus:border-[#1E3A8A]/35"
                    />
                </label>

                <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#1E3A8A]/80">
                        Hora
                    </span>
                    <input
                        required
                        type="time"
                        value={form.time}
                        onChange={(e) => onChange("time", e.target.value)}
                        className="h-11 rounded-2xl border border-[#1E3A8A]/15 bg-white px-4 text-sm outline-none focus:border-[#1E3A8A]/35"
                    />
                </label>

                <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#1E3A8A]/80">
                        Pessoas
                    </span>
                    <input
                        required
                        min={1}
                        type="number"
                        value={form.people}
                        onChange={(e) => onChange("people", e.target.value)}
                        className="h-11 w-full rounded-2xl border border-[#1E3A8A]/15 bg-white px-4 text-sm outline-none focus:border-[#1E3A8A]/35"
                    />
                </label>
            </div>

            <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#1E3A8A]/80">
                    Notas (opcional)
                </span>
                <textarea
                    value={form.notes}
                    onChange={(e) => onChange("notes", e.target.value)}
                    className="min-h-28 rounded-2xl border border-[#1E3A8A]/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#1E3A8A]/35"
                />
            </label>

            <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-[#1E3A8A] px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#162F73] hover:-translate-y-[1px]"
            >
                {status === "loading" ? "A enviar..." : "Enviar pedido"}
            </button>

            {status === "ok" && (
                <div className="rounded-2xl border border-[#1E3A8A]/15 bg-[#F4F7FB] p-4 text-sm text-[#1E3A8A]/80">
                    Pedido enviado! Obrigado por reservar uma mesa no O Grego.
                </div>
            )}

            {status === "error" && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {errorMsg}
                </div>
            )}
        </form>
    );
}
