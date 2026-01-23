import Image from "next/image";

export default function SobrePage() {
  return (
    <section className="grid gap-14">
      <header className="grid gap-6">
        <h1 className="text-4xl font-semibold tracking-tight text-[#1E3A8A] sm:text-5xl">
          Sobre Nós
        </h1>

        <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-[#1E3A8A] sm:text-5xl">
          Um sítio para parar, partilhar e saborear — como deve ser.
        </h2>

        <p className="max-w-3xl text-lg leading-8 text-zinc-600/90 dark:text-zinc-400/90">
          O O Grego nasceu numa ideia muito simples (e muito atual): trazer de
          volta o prazer de estar à mesa sem pressa. Cozinha mediterrânica,
          ingredientes frescos e um ambiente que pede conversa.
        </p>
      </header>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative">
          <div className="relative aspect-[16/11] overflow-hidden rounded-3xl bg-[#F4F7FB] shadow-sm">
            <Image
              src="/hero.png"
              alt="Ambiente do restaurante O Grego"
              fill
              className="object-cover object-[50%_30%]"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </div>
        </div>

        <div className="grid gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-[#1E3A8A]">
            A nossa história (fictícia, mas credível)
          </h2>

          <p className="leading-7 text-zinc-600/90 dark:text-zinc-400/90">
            Em 2024, no meio de horários impossíveis e refeições “a correr”,
            dois amigos (um cozinheiro e uma arquiteta) decidiram abrir um
            espaço onde o tempo voltava a contar. A inspiração veio de uma
            viagem às ilhas gregas: paredes claras, azul profundo, mesas que
            parecem durar horas e comida que sabe a verão — mesmo em pleno
            inverno.
          </p>

          <p className="leading-7 text-zinc-600/90 dark:text-zinc-400/90">
            O objetivo nunca foi inventar a roda. Foi fazer bem o essencial:
            pratos honestos, sabor intenso, simplicidade elegante. E um ambiente
            que não grita — convida.
          </p>

          <div className="grid gap-3 rounded-3xl border border-[#1E3A8A]/10 bg-white/60 p-6 shadow-sm">
            <div className="text-sm font-semibold text-[#1E3A8A]/80">
              A promessa do O Grego
            </div>
            <div className="text-[#1E3A8A]">
              “Grécia à mesa. Sem sair do lugar.”
            </div>
          </div>
        </div>
      </div>

      {/* 3 pilares */}
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Ingredientes frescos",
            text: "Menos truques, mais qualidade. O sabor vem do que é bem escolhido.",
          },
          {
            title: "Ambiente com calma",
            text: "Luz suave, espaço confortável e aquela vontade de ficar mais um bocado.",
          },
          {
            title: "Para partilhar",
            text: "Pratos pensados para mesa. Porque a experiência é melhor em conjunto.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-[#1E3A8A]/10 bg-white/60 p-8 shadow-sm"
          >
            <h3 className="text-xl font-bold tracking-tight text-[#1E3A8A]">
              {card.title}
            </h3>
            <p className="mt-3 leading-7 text-zinc-600/90 dark:text-zinc-400/90">
              {card.text}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-[#1E3A8A]/10 bg-[#F4F7FB] p-10 text-center shadow-sm">
        <p className="mx-auto max-w-3xl text-lg leading-8 text-[#1E3A8A]/85">
          A mesa é o centro. O resto é ruído. Aqui, come-se devagar, conversa-se
          mais e volta-se sempre.
        </p>
      </div>
    </section>
  );
}
