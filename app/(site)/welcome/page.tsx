import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
    return (
        <section className="grid gap-16">
            <div className="grid items-center gap-10 lg:grid-cols-2">
                <div className="grid gap-5">
                    <h1 className="text-4xl font-semibold tracking-tight text-[#1E3A8A] sm:text-5xl">
                        Bem-vindo a O Grego
                    </h1>

                    <p className="max-w-xl text-lg leading-8 text-zinc-600/90 dark:text-zinc-400/90">
                        Um espaço pensado para parar, partilhar e saborear.
                        Cozinha inspirada na Grécia, ingredientes frescos e um
                        ambiente que pede tempo — sem pressas, sem ruído.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Link
                            href="/menu"
                            className="flex h-12 items-center justify-center rounded-full bg-[#1E3A8A] px-6 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#162F73] hover:-translate-y-[1px]"
                        >
                            Ver Menu
                        </Link>

                        <Link
                            href="/contactos"
                            className="flex h-12 items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-white/60 px-6 text-sm font-medium text-[#1E3A8A] shadow-sm transition-all hover:border-[#1E3A8A]/40 hover:-translate-y-[1px]"
                        >
                            Reservas & Contactos
                        </Link>
                    </div>
                </div>

                <div className="relative w-full">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-[#F4F7FB] shadow-sm">
                        <Image
                            src="/homehero.png"
                            alt="Ambiente do restaurante O Grego"
                            fill
                            className="object-cover object-[50%_30%]"
                            priority
                            sizes="(min-width: 1024px) 50vw, 100vw"
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/60 p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#1E3A8A]">
                        Ambiente mediterrânico
                    </h2>
                    <p className="mt-3 leading-7 text-zinc-600/90 dark:text-zinc-400/90">
                        Um espaço luminoso, calmo e confortável — ideal para
                        jantares longos, encontros a dois e mesas cheias de
                        conversa.
                    </p>
                </div>

                <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/60 p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#1E3A8A]">
                        Ingredientes frescos
                    </h2>
                    <p className="mt-3 leading-7 text-zinc-600/90 dark:text-zinc-400/90">
                        Sabores limpos, simples e bem executados. O que chega à
                        mesa tem intenção: qualidade, equilíbrio e carácter.
                    </p>
                </div>

                <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/60 p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#1E3A8A]">
                        Para partilhar
                    </h2>
                    <p className="mt-3 leading-7 text-zinc-600/90 dark:text-zinc-400/90">
                        A experiência é melhor quando é partilhada. Pratos
                        pensados para mesa, para pedir mais uma coisa… e mais
                        uma.
                    </p>
                </div>
            </div>
            <div className="grid gap-8 rounded-3xl border border-[#1E3A8A]/10 bg-white/60 p-8 shadow-sm lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-[#1E3A8A]">
                        Horário & Localização
                    </h2>
                    <p className="mt-3 max-w-2xl leading-7 text-zinc-600/90 dark:text-zinc-400/90">
                        Terça a Domingo — 12:00–15:00 / 19:00–23:00. <br />
                        Reservas recomendadas ao jantar.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/contactos"
                        className="flex h-12 items-center justify-center rounded-full bg-[#1E3A8A] px-6 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#162F73] hover:-translate-y-[1px]"
                    >
                        Como chegar
                    </Link>
                    <Link
                        href="/galeria"
                        className="flex h-12 items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-white/60 px-6 text-sm font-medium text-[#1E3A8A] shadow-sm transition-all hover:border-[#1E3A8A]/40 hover:-translate-y-[1px]"
                    >
                        Ver ambiente
                    </Link>
                </div>
            </div>
        </section>
    );
}
