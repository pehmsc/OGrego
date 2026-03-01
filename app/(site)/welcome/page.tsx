"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// O array é preenchido dinamicamente

export default function WelcomePage() {
    const [randomPromo, setRandomPromo] = useState<{
        src: string;
        alt: string;
        title: string;
    } | null>(null);
    const [heroUrl, setHeroUrl] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/promo-images")
            .then((res) => res.json())
            .then((images) => {
                if (!images || images.length === 0) return;
                const highlights = images.map((src: string, i: number) => ({
                    src,
                    alt: `Promoção ${i + 1}`,
                    title: "Ofertas especiais à sua espera",
                }));
                setRandomPromo(
                    highlights[Math.floor(Math.random() * highlights.length)],
                );
            });
    }, []);

    useEffect(() => {
        fetch("/api/hero-image")
            .then((res) => res.json())
            .then((data) => {
                if (data && data.url) setHeroUrl(data.url);
            });
    }, []);

    return (
        <section className="grid gap-10 sm:gap-16">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
                <div className="grid gap-5">
                    <h1 className="text-4xl font-semibold tracking-tight text-[#1E3A8A] sm:text-5xl dark:text-white">
                        Bem-vindo a O Grego
                    </h1>

                    <p className="max-w-xl text-lg leading-8 text-zinc-600/90 dark:text-white/90">
                        Um espaço pensado para parar, partilhar e saborear.
                        Cozinha inspirada na Grécia, ingredientes frescos e um
                        ambiente que pede tempo — sem pressas, sem ruído.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Link
                            href="/menu"
                            className="flex h-12 items-center justify-center rounded-full bg-[#1E3A8A] px-6 text-sm font-medium text-white shadow-xl transition-all hover:bg-[#162F73] hover:-translate-y-[1px] dark:border dark:border-white/30"
                        >
                            Ver Menu
                        </Link>

                        <Link
                            href="/menu"
                            className="site-button-secondary flex h-12 px-6 shadow-sm"
                        >
                            Encomendar
                        </Link>
                    </div>
                </div>

                <div className="relative w-full">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-[#F4F7FB] shadow-sm">
                        <Image
                            src={heroUrl || "/homehero.png"}
                            alt="Ambiente do restaurante O Grego"
                            fill
                            className="object-cover object-[50%_30%]"
                            priority
                            sizes="(min-width: 1024px) 50vw, 100vw"
                        />
                    </div>
                </div>
            </div>

            <Link
                href="/promos"
                className="site-card group grid items-center gap-6 p-6 transition-all hover:-translate-y-[1px] hover:border-[#1E3A8A]/30 hover:shadow-md sm:p-8 lg:grid-cols-[1fr_340px]"
            >
                <div className="grid gap-3">
                    <p className="w-fit rounded-full bg-[#1E3A8A]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E3A8A]">
                        Promoções O Grego
                    </p>
                    <h2 className="text-2xl font-semibold text-[#1E3A8A] sm:text-3xl">
                        {randomPromo?.title ?? "Promoção"}
                    </h2>
                    <p className="max-w-2xl leading-7 text-zinc-600/90 dark:text-slate-300">
                        Clique para ver todas as promoções ativas e aplicar o
                        seu código diretamente no checkout.
                    </p>
                    <span className="inline-flex h-11 w-fit items-center justify-center rounded-full bg-[#1E3A8A] px-6 text-sm font-medium text-white">
                        Ver Promoções
                    </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#1E3A8A]/10">
                    <Image
                        src={randomPromo?.src || "/placeholder.png"}
                        alt={randomPromo?.alt ?? "Promoção"}
                        width={720}
                        height={500}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                </div>
            </Link>
            <div className="site-card grid gap-8 p-6 sm:p-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-[#1E3A8A]">
                        Horário & Localização
                    </h2>
                    <p className="mt-3 max-w-2xl leading-7 text-zinc-600/90 dark:text-slate-300">
                        Terça a Domingo — 12:00–15:00 / 19:00–23:00. <br />
                        Reservas recomendadas ao jantar.
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-center">
                    <Link
                        href="/contactos"
                        className="flex h-12 items-center justify-center rounded-full bg-[#1E3A8A] px-6 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#162F73] hover:-translate-y-[1px]"
                    >
                        Como chegar
                    </Link>
                </div>
            </div>
        </section>
    );
}
