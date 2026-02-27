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

    // ✅ FUNÇÃO PARA MÁSCARA DE DATA (DD-MM-YYYY)
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove não-dígitos

        if (value.length >= 2) {
            value = value.slice(0, 2) + "-" + value.slice(2);
        }
        if (value.length >= 5) {
            value = value.slice(0, 5) + "-" + value.slice(5);
        }
        if (value.length > 10) {
            value = value.slice(0, 10);
        }

        onChange("date", value);
    };

    // ✅ FUNÇÃO PARA MÁSCARA DE HORA (HH:MM)
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove não-dígitos

        if (value.length >= 2) {
            value = value.slice(0, 2) + ":" + value.slice(2);
        }
        if (value.length > 5) {
            value = value.slice(0, 5);
        }

        onChange("time", value);
    };

    // ✅ VALIDAÇÃO DE DATA
    const validateDate = (date: string): boolean => {
        if (!/^\d{2}-\d{2}-\d{4}$/.test(date)) return false;

        const [day, month, year] = date.split("-").map(Number);
        const dateObj = new Date(year, month - 1, day);

        return (
            dateObj.getDate() === day &&
            dateObj.getMonth() === month - 1 &&
            dateObj.getFullYear() === year
        );
    };

    // ✅ VALIDAÇÃO DE HORA
    const validateTime = (time: string): boolean => {
        if (!/^\d{2}:\d{2}$/.test(time)) return false;

        const [hour, minute] = time.split(":").map(Number);
        return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // ✅ VALIDAR DATA E HORA
        if (!validateDate(form.date)) {
            setStatus("error");
            setErrorMsg("Data inválida. Use o formato DD-MM-AAAA");
            return;
        }

        if (!validateTime(form.time)) {
            setStatus("error");
            setErrorMsg("Hora inválida. Use o formato HH:MM (24h)");
            return;
        }

        setStatus("loading");
        setErrorMsg(null);

        try {
            // ✅ CONVERTER DATA PARA FORMATO ISO (YYYY-MM-DD) PARA BD
            const [day, month, year] = form.date.split("-");
            const isoDate = `${year}-${month}-${day}`;

            const res = await fetch("/api/reservas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    date: isoDate, // ✅ Enviar em formato ISO
                }),
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

            <div className="flex flex-col sm:flex-row sm:gap-x-2 gap-y-3">
                {/* ✅ DATA COM MÁSCARA */}
                <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#1E3A8A]/80">
                        Data
                    </span>
                    <input
                        required
                        type="text"
                        value={form.date}
                        onChange={handleDateChange}
                        placeholder="DD-MM-AAAA"
                        maxLength={10}
                        className="h-11 rounded-2xl border border-[#1E3A8A]/15 bg-white px-4 text-sm outline-none focus:border-[#1E3A8A]/35"
                    />
                </label>

                {/* ✅ HORA COM MÁSCARA */}
                <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#1E3A8A]/80">
                        Hora
                    </span>
                    <input
                        required
                        type="text"
                        value={form.time}
                        onChange={handleTimeChange}
                        placeholder="HH:MM"
                        maxLength={5}
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
