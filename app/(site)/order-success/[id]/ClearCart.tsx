"use client";

import { useEffect } from "react";
import { useCart } from "@/app/contexts/CartContext";

export default function ClearCart() {
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}
