"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderFeedbackStars({ orderId }: { orderId: number }) {
    const [hovered, setHovered] = useState(0);
    const router = useRouter();

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() =>
                        router.push(
                            `/user/feedback?encomenda=${orderId}&rating=${star}`,
                        )
                    }
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    title={`${star} estrela${star > 1 ? "s" : ""}`}
                    className="text-base leading-none transition-transform hover:scale-125"
                    style={{ color: star <= hovered ? "#eab308" : "#d1d5db" }}
                >
                    ★
                </button>
            ))}
        </div>
    );
}
