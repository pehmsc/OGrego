"use client";
import Link from "next/link";

interface PromoLinkProps {
    code: string;
    href: string;
    children: React.ReactNode;
    className?: string;
}

export default function PromoLink({
    code,
    href,
    children,
    className,
}: PromoLinkProps) {
    const handleClick = () => {
        if (typeof window !== "undefined") {
            localStorage.setItem("promoSelecionada", code);
        }
    };

    return (
        <Link href={href} className={className} onClick={handleClick}>
            {children}
        </Link>
    );
}
