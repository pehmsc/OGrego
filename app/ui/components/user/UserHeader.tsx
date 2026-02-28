import Image from "next/image";

interface UserHeaderProps {
    name: string;
    email: string;
    photo?: string;
    loyaltyPoints: number;
}

export default function UserHeader({
    name,
    email,
    photo,
    loyaltyPoints,
}: UserHeaderProps) {
    return (
        <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                {/* Avatar */}
                <div className="relative h-24 w-24 shrink-0">
                    {photo ? (
                        <Image
                            src={photo}
                            alt={name}
                            fill
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1E3A8A] text-3xl font-bold text-white">
                            {name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Nome + Badge + Pontos */}
                <div className="flex flex-col justify-center gap-2">
                    <h1 className="text-2xl font-semibold text-[#1E3A8A] dark:text-slate-50">
                        {name}
                    </h1>
                    <p className="text-sm text-zinc-600 dark:text-slate-300">
                        {email}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        <span className="flex h-8 items-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 text-sm font-medium text-white shadow-sm">
                            Ouro
                        </span>

                        <span className="text-sm font-medium text-zinc-600 dark:text-slate-300">
                            {loyaltyPoints} pontos
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
