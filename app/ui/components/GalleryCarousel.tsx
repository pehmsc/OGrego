"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
    images: string[];
    aspect?: string;
};

export default function GalleryCarousel({ images, aspect = "4/5" }: Props) {
    const [index, setIndex] = useState(0);

    const total = images.length;

    function prev() {
        setIndex((i) => (i - 1 + total) % total);
    }

    function next() {
        setIndex((i) => (i + 1) % total);
    }

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "ArrowLeft") {
                setIndex((i) => (i - 1 + total) % total);
            }
            if (e.key === "ArrowRight") {
                setIndex((i) => (i + 1) % total);
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [total]);

    return (
        <div className="grid gap-4 sm:gap-6">
            <div className="group relative overflow-hidden rounded-3xl border-2 border-[#1E3A8A]/20 bg-gradient-to-br from-[#F4F7FB] via-white to-[#e3eaf7] shadow-lg dark:border-white/10 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                <div
                    className={`relative aspect-[${aspect}] transition-transform duration-300 group-hover:scale-105`}
                >
                    <Image
                        key={images[index]}
                        src={images[index]}
                        alt={`Galeria O Grego ${index + 1}`}
                        fill
                        priority
                        className="animate-fadeIn object-contain bg-white opacity-0 dark:bg-slate-950"
                        sizes="(min-width: 1024px) 900px, 100vw"
                    />
                </div>
                <button
                    type="button"
                    onClick={prev}
                    aria-label="Imagem anterior"
                    className="group absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/25 p-2.5 text-white backdrop-blur transition hover:bg-[#1E3A8A]/80 hover:scale-110 sm:p-3"
                >
                    <span className="block text-lg leading-none">‹</span>
                </button>

                <button
                    type="button"
                    onClick={next}
                    aria-label="Imagem seguinte"
                    className="group absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/25 p-2.5 text-white backdrop-blur transition hover:bg-[#1E3A8A]/80 hover:scale-110 sm:p-3"
                >
                    <span className="block text-lg leading-none">›</span>
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur shadow">
                    {index + 1} / {total}
                </div>
            </div>
            <div className="flex justify-center gap-3 overflow-x-auto pb-2">
                {images.map((src, i) => (
                    <button
                        key={src}
                        type="button"
                        onClick={() => setIndex(i)}
                        className={`relative h-16 w-24 flex-none overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition-all duration-200 dark:bg-slate-950 ${
                            i === index
                                ? "border-[#1E3A8A] ring-2 ring-[#1E3A8A]/20 scale-105 z-10"
                                : "border-[#1E3A8A]/10 hover:border-[#1E3A8A]/40 opacity-80 hover:opacity-100"
                        }`}
                        aria-label={`Ir para imagem ${i + 1}`}
                    >
                        <Image
                            src={src}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-200 hover:scale-105"
                        />
                    </button>
                ))}
            </div>
            <style jsx global>{`
                @keyframes fadeIn {
                    to {
                        opacity: 1;
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.7s ease forwards;
                }
            `}</style>
        </div>
    );
}
