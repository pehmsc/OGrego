import { getLoyaltyInfo } from "@/app/lib/loyalty";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

interface LoyaltyCardProps {
    points: number;
}

export default function LoyaltyCard({ points }: LoyaltyCardProps) {
    const info = getLoyaltyInfo(points);
    const nextLevel =
        info.pointsToNext !== null
            ? getLoyaltyInfo(points + info.pointsToNext).level
            : null;

    return (
        <div
            className={`rounded-3xl border border-white/10 bg-gradient-to-br ${info.gradient} p-8 text-white shadow-sm`}
        >
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h3 className="text-2xl font-semibold">Fidelização</h3>
                    <p className="mt-1 text-sm text-white/70">
                        1€ gasto = 1 ponto
                    </p>
                </div>
                <div className="text-4xl">
                    <CheckBadgeIcon className="h-8 w-8 text-white/80" />
                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm font-medium text-white/70">Saldo Atual</p>
                <p className="text-4xl font-bold">{points}</p>
                <p className="text-sm text-white/70">pontos</p>
            </div>

            {/* Barra de Progresso */}
            <div>
                <div className="mb-2 flex justify-between text-xs font-medium">
                    <span>Nível: {info.level}</span>
                    {info.pointsToNext !== null ? (
                        <span>
                            {info.pointsToNext} pts até {nextLevel}
                        </span>
                    ) : (
                        <span>Nível máximo atingido 🎉</span>
                    )}
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/30">
                    <div
                        className="h-full rounded-full bg-white transition-all"
                        style={{ width: `${info.progress}%` }}
                    />
                </div>
            </div>

            {/* Benefícios */}
            <div className="mt-6 space-y-2 border-t border-white/20 pt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                    Benefícios {info.level}
                </p>
                <ul className="space-y-1 text-sm">
                    {info.benefits.map((b) => (
                        <li key={b} className="flex items-center gap-2">
                            <span>✓</span>
                            <span>{b}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
