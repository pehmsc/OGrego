import { getCurrentUserDb } from "@/app/lib/current-user";
import UserPageLayout from "@/app/ui/components/user/UserPageLayout";
import FeedbackStatsCard from "@/app/ui/components/user/FeedbackStatsCard";
import FeedbackForm from "@/app/ui/components/FeedbackForm";
import Image from "next/image";

// TODO: Descomentar quando criares a tabela feedback
// import { getUserFeedbacks, getUserFeedbackStats } from "@/app/lib/feedback-actions";

export default async function FeedbackPage() {
    const userDb = await getCurrentUserDb();

    // ========== TODO: DESCOMENTAR QUANDO TIVERES TABELA ==========
    // const stats = await getUserFeedbackStats(userDb.id);
    // const feedbacks = await getUserFeedbacks(userDb.id);
    // ==============================================================

    // ========== MOCK DATA - APAGAR DEPOIS ==========
    const stats = {
        totalFeedbacks: 8,
        averageRating: 4.5,
        lastFeedback: "Há 3 dias",
    };

    const feedbacks = [
        {
            id: 1,
            rating: 5,
            comment: "Comida deliciosa! O Moussaka estava perfeito.",
            image_url: null,
            date: "3 de Fev de 2026",
        },
        {
            id: 2,
            rating: 4,
            comment: "Muito bom! Apenas o tempo de espera foi um pouco longo.",
            image_url: null,
            date: "15 de Jan de 2026",
        },
    ];
    // ========== FIM MOCK DATA ==========

    return (
        <UserPageLayout
            sidebar={
                <FeedbackStatsCard
                    totalFeedbacks={stats.totalFeedbacks}
                    averageRating={stats.averageRating}
                    lastFeedback={stats.lastFeedback}
                />
            }
        >
            <div className="space-y-8">
                {/* Formulário */}
                <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-8 shadow-sm">
                    <h2 className="mb-6 text-2xl font-semibold text-[#1E3A8A]">
                        Deixe o seu Feedback
                    </h2>

                    <FeedbackForm />
                </div>

                {/* Histórico */}
                {feedbacks.length > 0 && (
                    <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-8 shadow-sm">
                        <h3 className="mb-6 text-lg font-semibold text-[#1E3A8A]">
                            Os Seus Feedbacks Anteriores
                        </h3>

                        <div className="space-y-4">
                            {feedbacks.map((feedback: any) => (
                                <div
                                    key={feedback.id}
                                    className="rounded-2xl border border-[#1E3A8A]/10 bg-[#F4F7FB] p-4"
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    className={
                                                        star <= feedback.rating
                                                            ? "text-yellow-500"
                                                            : "text-gray-300"
                                                    }
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-xs text-zinc-600/70">
                                            {feedback.date}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-600">
                                        {feedback.comment}
                                    </p>

                                    {feedback.image_url && (
                                        <div className="mt-3 relative h-48 w-full overflow-hidden rounded-xl">
                                            <Image
                                                src={feedback.image_url}
                                                alt="Foto do feedback"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </UserPageLayout>
    );
}
