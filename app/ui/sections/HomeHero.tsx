import Image from "next/image";
import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="grid gap-8 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <Image
                src="/logo.svg"
                alt="O Grego"
                width={200}
                height={60}
                priority
              />
            </div>

            <div className="grid gap-5">
              <h1 className="mx-auto max-w-xl text-3xl font-semibold leading-tight tracking-tight text-[var(--foreground)] sm:text-4xl lg:mx-0 lg:text-5xl">
                Grécia à mesa.
                <br />
                Sem sair do lugar.
              </h1>

              <p className="mx-auto max-w-xl text-base leading-7 text-zinc-700/90 dark:text-zinc-200/85 sm:text-lg sm:leading-8 lg:mx-0">
                No O Grego, a tradição mediterrânica encontra-se com
                ingredientes frescos, sabores intensos e uma cozinha feita com
                tempo e respeito.
                <br />
                Cada prato é uma viagem — simples, honesta e cheia de carácter.
                <br />
                Aqui, come-se devagar, conversa-se mais e volta-se sempre.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 text-base font-medium sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/welcome"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1E3A8A] px-5 text-white shadow-sm transition-all duration-200 ease-out hover:bg-[#162F73] hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]/30 focus-visible:ring-offset-2 sm:w-[158px] dark:bg-white dark:text-[#1E3A8A] dark:hover:bg-[#F4F7FB] dark:focus-visible:ring-[#F4F7FB]/30"
              >
                <Image
                  className="transition-transform duration-200 ease-out group-hover:scale-105"
                  src="/omegawhite.svg"
                  alt="O Grego logomark"
                  width={20}
                  height={20}
                />
                Visitar
              </Link>

              <Link
                href="/auth/entrar"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#F4F7FB] px-5 text-[#1E3A8A] border border-[#1E3A8A]/20 shadow-sm transition-all duration-200 ease-out hover:bg-white hover:border-[#1E3A8A]/40 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]/30 focus-visible:ring-offset-2 sm:w-[190px]
                  dark:bg-[#F4F7FB] dark:text-[#1E3A8A] dark:border-white/20 dark:hover:border-white/35 dark:focus-visible:ring-white/30"
              >
                Entrar / Criar conta
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-[#F4F7FB] shadow-sm sm:aspect-[4/5]">
              <Image
                src="/homehero.png"
                alt="Ambiente do restaurante O Grego"
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
