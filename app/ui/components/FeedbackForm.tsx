"use client";

import { useState } from "react";

// TODO: Descomentar quando criares a tabela feedback e configurares R2
// import { createFeedback } from "@/app/lib/feedback-actions";

/* =======================
   Tipos
======================= */
type FeedbackResult = { success: true } | { success: false; error: string };

export default function FeedbackForm() {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (rating === 0) {
            alert("Por favor, selecione uma avaliação");
            return;
        }

        setIsSubmitting(true);

        // ========== TODO: DESCOMENTAR QUANDO TIVERES BD ==========
        // const formData = new FormData(e.currentTarget);
        // formData.append("rating", rating.toString());
        // const result: FeedbackResult = await createFeedback(formData);
        // ========================================================

        // ========== MOCK - APAGAR DEPOIS ==========
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const result = { success: true } as FeedbackResult;
        // ========================================

        setIsSubmitting(false);

        if (result.success) {
            alert("Feedback enviado com sucesso!");
            e.currentTarget.reset();
            setRating(0);

            // TODO: Descomentar quando tiveres BD para recarregar feedbacks
            // window.location.reload();
        } else {
            alert(result.error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating com estrelas */}
            <div>
                <label className="mb-2 block text-sm font-medium text-[#1E3A8A]">
                    Avaliação *
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="text-3xl transition-all hover:scale-110"
                            style={{
                                color:
                                    star <= (hoveredRating || rating)
                                        ? "#eab308"
                                        : "#d1d5db",
                            }}
                        >
                            ★
                        </button>
                    ))}
                </div>

                {rating > 0 && (
                    <p className="mt-2 text-sm text-zinc-600">
                        {rating === 1 && "Muito insatisfeito"}
                        {rating === 2 && "Insatisfeito"}
                        {rating === 3 && "Neutro"}
                        {rating === 4 && "Satisfeito"}
                        {rating === 5 && "Muito satisfeito"}
                    </p>
                )}
            </div>

            {/* Comentário */}
            <div>
                <label className="mb-2 block text-sm font-medium text-[#1E3A8A]">
                    Comentário *
                </label>
                <textarea
                    name="comment"
                    rows={6}
                    required
                    minLength={10}
                    placeholder="Conte-nos sobre a sua experiência... (mínimo 10 caracteres)"
                    className="w-full rounded-2xl border border-[#1E3A8A]/20 bg-white/80 px-6 py-3 text-sm transition-all focus:border-[#1E3A8A]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                />
            </div>

            {/* Upload Imagem */}
            <div>
                <label className="mb-2 block text-sm font-medium text-[#1E3A8A]">
                    Adicionar Foto (opcional)
                </label>
                <input
                    name="image"
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-zinc-600
                        file:mr-4 file:rounded-full file:border-0
                        file:bg-[#1E3A8A] file:px-4 file:py-2
                        file:text-sm file:font-medium file:text-white
                        file:transition-all hover:file:bg-[#162F73]"
                />
                <p className="mt-1 text-xs text-zinc-600/70">
                    Máximo 5MB (JPG, PNG, WEBP)
                </p>
            </div>

            {/* Botão Enviar */}
            <button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className="flex h-12 w-full items-center justify-center rounded-full bg-[#1E3A8A] text-sm font-medium text-white shadow-xl transition-all hover:-translate-y-[1px] hover:bg-[#162F73] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
                {isSubmitting ? "A enviar..." : "Enviar Feedback"}
            </button>
        </form>
    );
}
