"use client";

import { useState } from "react";

type FormState = {
    encomenda: string;
    comentario: string;
    imagem: string;
};

type Status = "idle" | "loading" | "ok" | "error";

export default function FeedbackForm() {
    const [status, setStatus] = useState<Status>("idle");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [form, setForm] = useState<FormState>({
        encomenda: "",
        comentario: "",
        imagem: "",
    });

    function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((p) => ({ ...p, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setStatus("loading");
        setErrorMsg(null);

        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data: any = await res.json().catch(() => ({}));

            if (!res.ok) {
                setStatus("error");
                setErrorMsg(
                    data.error ||
                        "Não foi possível enviar o feedback. Tente novamente",
                );
                return;
            }

            setStatus("ok");

            setForm({
                encomenda: "",
                comentario: "",
                imagem: "",
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
                        Referência da Encomenda
                    </span>
                    <input
                        required
                        value={form.encomenda}
                        onChange={(e) => onChange("encomenda", e.target.value)}
                        className="h-11 rounded-2xl border border-[#1E3A8A]/15 bg-white px-4 text-sm outline-none focus:border-[#1E3A8A]/35"
                    />
                </label>

                <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#1E3A8A]/80">
                        Imagem (opcional)
                    </span>

                    <input
                        type="file"
                        accept="image/*"
                        //value={form.imagem}
                        //onChange={(e) => onChange("imagem", e.target.value)}
                        //className="h-11 rounded-2xl border border-[#1E3A8A]/15 bg-white px-4 text-sm outline-none focus:border-[#1E3A8A]/35"
                        ///>
                        className="block w-full text-sm text-zinc-600
                    file:mr-4 file:rounded-full file:border-0
                    file:bg-[#1E3A8A] file:px-4 file:py-2
                    file:text-sm file:font-medium file:text-white
                    file:transition-all hover:file:bg-[#162F73]"
                    />
                </label>
            </div>

            <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#1E3A8A]/80">
                    Comentário
                </span>
                <textarea
                    value={form.comentario}
                    onChange={(e) => onChange("comentario", e.target.value)}
                    className="min-h-28 rounded-2xl border border-[#1E3A8A]/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#1E3A8A]/35"
                />
            </label>

            <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-[#1E3A8A] px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#162F73] hover:-translate-y-[1px]"
            >
                {status === "loading" ? "A enviar..." : "Enviar feedback"}
            </button>

            {status === "ok" && (
                <div className="rounded-2xl border border-[#1E3A8A]/15 bg-[#F4F7FB] p-4 text-sm text-[#1E3A8A]/80">
                    Feedback enviado! Obrigado por nos ajudar a melhorar.
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
