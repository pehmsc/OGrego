interface LoyaltyCardProps {
    points: number;
}

export default function LoyaltyCard({ points }: LoyaltyCardProps) {
    const maxPoints = 50;
    const progress = (points / maxPoints) * 100;
    const pointsToNext = maxPoints - points;

    return (
        <div className="rounded-3xl border border-[#1E3A8A]/10 bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 text-white shadow-sm">
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h3 className="text-2xl font-semibold">Fidelização</h3>
                    <p className="mt-1 text-sm text-yellow-100">
                        1€ gasto = 1 ponto
                    </p>
                </div>
                <div className="text-4xl"></div>
            </div>

            <div className="mb-6">
                <p className="text-sm font-medium text-yellow-100">
                    Saldo Atual
                </p>
                <p className="text-4xl font-bold">{points}</p>
                <p className="text-sm text-yellow-100">pontos</p>
            </div>

            {/* Barra de Progresso */}
            <div>
                <div className="mb-2 flex justify-between text-xs font-medium">
                    <span>Nível: Ouro</span>
                    <span>{pointsToNext} pts até Platina</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-yellow-300/50">
                    <div
                        className="h-full rounded-full bg-white transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Benefícios */}
            <div className="mt-6 space-y-2 border-t border-yellow-500/30 pt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-yellow-100">
                    Benefícios Ouro
                </p>
                <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                        <span>✓</span>
                        <span>10% desconto</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span>✓</span>
                        <span>Sobremesa grátis</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span>✓</span>
                        <span>Reserva prioritária</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
