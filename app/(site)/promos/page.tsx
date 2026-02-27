import Image from "next/image";
import PromoLink from "./PromoLink";

type Promo = {
    code: string;
    discount: string;
    minOrder: string;
    usageLimit: string;
    validFrom: string;
    validUntil: string;
    image?: string;
};

const promos: Promo[] = [
    {
        code: "GREGO10",
        discount: "10% de desconto",
        minOrder: "Sem mínimo de encomenda",
        usageLimit: "Utilizações ilimitadas",
        validFrom: "09/02/2026",
        validUntil: "31/12/2026",
        image: "/grego10.png",
    },
    {
        code: "BEMVINDO",
        discount: "15% de desconto",
        minOrder: "Sem mínimo de encomenda",
        usageLimit: "1 utilização por conta (até 100 utilizações)",
        validFrom: "09/02/2026",
        validUntil: "30/06/2026",
        image: "/bemvindo.png",
    },
    {
        code: "PROMO20",
        discount: "20% de desconto",
        minOrder: "Mínimo de 30,00 €",
        usageLimit: "Até 50 utilizações",
        validFrom: "09/02/2026",
        validUntil: "31/03/2026",
        image: "/promo20.png",
    },
    {
        code: "FIXO5",
        discount: "5,00 € de desconto fixo",
        minOrder: "Sem mínimo de encomenda",
        usageLimit: "Utilizações ilimitadas",
        validFrom: "09/02/2026",
        validUntil: "31/12/2026",
        image: "/fixo5.png",
    },
    {
        code: "ENTREGA0",
        discount: "2,50 € de desconto fixo",
        minOrder: "Mínimo de 20,00 €",
        usageLimit: "Utilizações ilimitadas",
        validFrom: "09/02/2026",
        validUntil: "31/12/2026",
        image: "/entregao.png",
    },
    {
        code: "VIP25",
        discount: "25% de desconto",
        minOrder: "Mínimo de 50,00 €",
        usageLimit: "Até 20 utilizações",
        validFrom: "09/02/2026",
        validUntil: "31/12/2026",
        image: "/vip025.png",
    },
];

export default function PromosPage() {
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

                        <dl className="mt-4 grid gap-3 text-sm leading-6 text-zinc-700/90">
                            <div>
                                <dt className="font-medium text-zinc-800">
                                    Encomenda mínima
                                </dt>
                                <dd>{promo.minOrder}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-zinc-800">
                                    Limite de utilizações
                                </dt>
                                <dd>{promo.usageLimit}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-zinc-800">
                                    Válida de
                                </dt>
                                <dd>{promo.validFrom}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-zinc-800">
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
