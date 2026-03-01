import Image from "next/image";
import PromoLink from "./PromoLink";
import { getPromos } from "@/app/lib/promo-actions";

export default async function PromosPage() {
    const promos = await getPromos();

    return (
        <section className="grid gap-10 py-6">
            <div className="grid gap-4">
                <h1 className="text-4xl font-semibold tracking-tight text-[#1E3A8A] sm:text-5xl dark:text-white">
                    Promoções O Grego
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-zinc-600/90 dark:text-white/90">
                    Aproveite os códigos promocionais ativos no nosso site. As
                    condições abaixo são aplicadas automaticamente no checkout,
                    após inserir o código correspondente.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {promos.map((promo) => (
                    <PromoLink
                        key={promo.code}
                        code={promo.code}
                        href={`/cart?promo=${promo.code}`}
                        className="block rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-6 shadow-sm transition-all hover:-translate-y-[1px] hover:border-[#1E3A8A]/30 hover:shadow-md"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <p className="rounded-full bg-[#1E3A8A] px-4 py-1.5 text-sm font-semibold tracking-wide text-white">
                                {promo.code}
                            </p>
                            <span className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                                Ativa
                            </span>
                        </div>

                        <h2 className="mt-4 text-xl font-semibold text-[#1E3A8A]">
                            {promo.discount}
                        </h2>

                        {promo.image ? (
                            <div className="mt-4 overflow-hidden rounded-2xl border border-[#1E3A8A]/10 bg-white">
                                <Image
                                    src={promo.image}
                                    alt={`Promoção ${promo.code}`}
                                    width={800}
                                    height={450}
                                    className="h-auto w-full object-cover"
                                />
                            </div>
                        ) : null}

                        <dl className="mt-4 grid gap-3 text-sm leading-6 text-zinc-700/90 dark:text-white/90">
                            <div>
                                <dt className="font-medium text-zinc-800 dark:text-white/90">
                                    Encomenda mínima
                                </dt>
                                <dd>{promo.minOrder}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-zinc-800 dark:text-white/90">
                                    Limite de utilizações
                                </dt>
                                <dd>{promo.usageLimit}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-zinc-800 dark:text-white/90">
                                    Válida de
                                </dt>
                                <dd>{promo.validFrom}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-zinc-800 dark:text-white/90">
                                    Válida até
                                </dt>
                                <dd>{promo.validUntil}</dd>
                            </div>
                        </dl>
                    </PromoLink>
                ))}
            </div>
        </section>
    );
}
