import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <section className="grid gap-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="grid gap-5">
          <h1 className="text-4xl font-semibold tracking-tight text-[#1E3A8A] sm:text-5xl dark:text-white">
            Bem-vindo a O Grego
          </h1>

          <p className="max-w-xl text-lg leading-8 text-zinc-600/90 dark:text-white/90">
            Um espaço pensado para parar, partilhar e saborear. Cozinha
            inspirada na Grécia, ingredientes frescos e um ambiente que pede
            tempo — sem pressas, sem ruído.
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
              className="flex h-12 items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-white/80 px-6 text-sm font-medium text-[#1E3A8A] shadow-sm transition-all hover:border-[#1E3A8A]/40 hover:-translate-y-[1px]"
            >
              Encomendar
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
        <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-8 shadow-sm">
          <Image
            src="/grego10.png"
            alt="10% desconto"
            width={400}
            height={300}
            className="rounded-2xl"
          />
          <p className="text-center mt-3 leading-7 text-zinc-600/90 dark:text-[#1e3a8a]/90">
            Um convite ao sabor. <br />
            10% de vantagem na sua próxima encomenda.
          </p>
        </div>

        <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-8 shadow-sm">
          <Image
            src="/bemvindo.png"
            alt="15% desconto"
            width={400}
            height={300}
            className="rounded-2xl"
          />
          <p className="text-center mt-3 leading-7 text-zinc-600/90 dark:text-[#1e3a8a]/90">
            Seja bem-vindo. <br />
            Um início especial, pensado para si.
          </p>
        </div>

        <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-8 shadow-sm">
          <Image
            src="/promo20.png"
            alt="20% desconto"
            width={400}
            height={300}
            className="rounded-2xl"
          />
          <p className="text-center mt-3 leading-7 text-zinc-600/90 dark:text-[#1e3a8a]/90">
            Mais para quem escolhe mais. <br />
            20% de vantagem em compras selecionadas.
          </p>
        </div>
      </div>
      <div className="grid gap-8 rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-8 shadow-sm lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-[#1E3A8A]">
            Horário & Localização
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-zinc-600/90 dark:text-[#1e3a8a]/90">
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
