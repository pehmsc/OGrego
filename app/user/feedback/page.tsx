import { getCurrentUserDb } from "@/app/lib/current-user";
import {
    getUserFeedbacks,
    getUserFeedbackStats,
} from "@/app/lib/feedback-actions";
import UserPageLayout from "@/app/ui/components/user/UserPageLayout";
import FeedbackStatsCard from "@/app/ui/components/user/FeedbackStatsCard";
import FeedbackForm from "@/app/ui/components/FeedbackForm";
import Image from "next/image";

export default async function FeedbackPage({
    searchParams,
}: {
    searchParams: Promise<{ encomenda?: string; rating?: string }>;
}) {
    const params = await searchParams;
    const initialOrderId = params.encomenda ? parseInt(params.encomenda) : undefined;
    const initialRating = params.rating ? parseInt(params.rating) : undefined;

    const userDb = await getCurrentUserDb();

    // ✅ Dados reais da BD
    const stats = await getUserFeedbackStats(userDb.id);
    const feedbacks = await getUserFeedbacks(userDb.id);

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
                        {initialOrderId && (
                            <span className="ml-3 text-base font-normal text-zinc-500">
                                — Encomenda #{initialOrderId}
                            </span>
                        )}
                    </h2>

                    <FeedbackForm initialOrderId={initialOrderId} initialRating={initialRating} />
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
