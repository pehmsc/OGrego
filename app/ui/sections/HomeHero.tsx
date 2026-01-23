import Image from "next/image";
import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="bg-[var(--background)]">
      <div className="mx-auto min-h-screen max-w-7xl px-6 py-24 sm:py-28 lg:py-32">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="grid h-full grid-rows-[auto_1fr_auto] text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <Image
                className="text-[var(--foreground)]"
                src="/logodark.svg"
                alt="O Grego"
                width={200}
                height={60}
                priority
              />
            </div>
            <div className="flex flex-col justify-center gap-6 py-10 lg:py-0">
              <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-[#1E3A8A] text-[var(--foreground)] sm:text-5xl">
                Grécia à mesa.<span className="hidden sm:inline"> </span>
                <br className="hidden sm:block" />
                Sem sair do lugar.
              </h1>

              <p className="max-w-xl text-lg leading-8 text-zinc-600/90 dark:invert">
                No O Grego, a tradição mediterrânica encontra-se com
                ingredientes frescos, sabores intensos e uma cozinha feita com
                tempo e respeito.
                <br />
                Cada prato é uma viagem — simples, honesta e cheia de carácter.
                <br />
                Aqui, come-se devagar, conversa-se mais e volta-se sempre.
              </p>
            </div>
            <div className="mt-2 flex w-full flex-col gap-4 text-base font-medium sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/welcome"
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1E3A8A] px-5 text-white shadow-sm transition-all duration-200 ease-out hover:bg-[#162F73] hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]/30 focus-visible:ring-offset-2 sm:w-[158px] dark:bg-white dark:text-[#1E3A8A]
    dark:hover:bg-[#F4F7FB]
    dark:focus-visible:ring-[#F4F7FB]/30"
              >
                <Image
                  className="transition-transform duration-200 ease-out group-hover:scale-105 text-[var(--foreground)]"
                  src="/omegawhite.svg"
                  alt="O Grego logomark"
                  width={16}
                  height={16}
                />
                Visitar
              </Link>

              <Link
                href="/sobre"
                className="flex h-12 w-full items-center justify-center rounded-full bg-[#F4F7FB] px-5 text-[#1E3A8A] border border-[#1E3A8A]/20 shadow-sm transition-all duration-200 ease-out hover:bg-white hover:border-[#1E3A8A]/40 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]/30 focus-visible:ring-offset-2 sm:w-[158px]"
              >
                Sobre
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#F4F7FB] shadow-sm">
              <Image
                src="/homehero.png"
                alt="Ambiente do restaurante O Grego"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
