interface FeedbackStatsCardProps {
    totalFeedbacks: number;
    averageRating: number;
    lastFeedback?: string;
}

export default function FeedbackStatsCard({
    totalFeedbacks,
    averageRating,
    lastFeedback,
}: FeedbackStatsCardProps) {
    return (
        <div className="site-card p-6 sm:p-8">
            <h3 className="mb-6 text-2xl font-semibold text-[#1E3A8A]">
                As Suas Avaliações
            </h3>

            <div className="space-y-6">
                {/* Total de Feedbacks */}
                <div>
                    <p className="text-sm font-medium text-zinc-600/70">
                        Feedbacks Enviados
                    </p>
                    <p className="text-3xl font-bold text-[#1E3A8A]">
                        {totalFeedbacks}
                    </p>
                </div>

                {/* Avaliação Média */}
                <div>
                    <p className="text-sm font-medium text-zinc-600/70">
                        Avaliação Média
                    </p>
                    <div className="flex items-center gap-2">
                        <p className="text-3xl font-bold text-[#1E3A8A]">
                            {averageRating.toFixed(1)}
                        </p>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={
                                        star <= Math.round(averageRating)
                                            ? "text-yellow-500"
                                            : "text-gray-300"
                                    }
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Último Feedback */}
                {lastFeedback && (
                    <div>
                        <p className="text-sm font-medium text-zinc-600/70">
                            Último Feedback
                        </p>
                        <p className="text-sm text-zinc-600">{lastFeedback}</p>
                    </div>
                )}

                {/* Info */}
                <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-500/10">
                    <p className="text-sm text-[#1E3A8A]">
                        O seu feedback ajuda-nos a melhorar! Obrigado pela sua
                        opinião.
                    </p>
                </div>
            </div>
        </div>
    );
}
