import Image from "next/image";
import { getLoyaltyInfo } from "@/app/lib/loyalty";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

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
    const info = getLoyaltyInfo(loyaltyPoints);

    return (
        <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-8 shadow-sm">
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
                    <h1 className="text-2xl font-semibold text-[#1E3A8A]">
                        {name}
                    </h1>

                    <div className="flex items-center gap-3">
                        <span
                            className={`flex h-8 items-center gap-1 rounded-full bg-gradient-to-r ${info.badgeGradient} px-4 text-sm font-medium text-white shadow-sm`}
                        >
                            <CheckBadgeIcon className="h-4 w-4" /> {info.level}
                        </span>

                        <span className="text-sm font-medium text-zinc-600">
                            {loyaltyPoints} pontos
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
