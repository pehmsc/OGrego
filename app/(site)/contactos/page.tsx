import ReservationForm from "../../ui/components/ReservationForm";
import Link from "next/link";
import Image from "next/image";

export default function ContactosPage() {
  return (
    <section className="grid gap-12">
      <header className="grid gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-[#1E3A8A] sm:text-5xl">
          Contactos
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-600/90 dark:text-zinc-400/90">
          Queres reservar mesa ou tirar uma dúvida rápida? Aqui é o sítio certo.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/60 p-8 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight text-[#1E3A8A]">
            Informações
          </h2>

          <div className="mt-5 grid gap-4 text-zinc-600/90 dark:text-zinc-400/90">
            <div>
              <div className="text-sm font-semibold text-[#1E3A8A]/80">
                Morada
              </div>
              <div>O Grego, Lisboa</div>
            </div>

            <div>
              <div className="text-sm font-semibold text-[#1E3A8A]/80">
                Horário
              </div>
              <div>Terça a Domingo — 12:00–15:00 / 19:00–23:00 (exemplo)</div>
            </div>

            <div>
              <div className="text-sm font-semibold text-[#1E3A8A]/80">
                Telefone
              </div>
              <div>+351 9xx xxx xxx</div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="tel:+351900000000"
                className="flex h-12 items-center justify-center rounded-full bg-[#1E3A8A] px-6 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#162F73] hover:-translate-y-[1px]"
              >
                Ligar
              </Link>
              <Link
                href="https://maps.app.goo.gl/GkGtYConndLVUFa68"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-white/60 px-6 text-sm font-medium text-[#1E3A8A] shadow-sm transition-all hover:border-[#1E3A8A]/40 hover:-translate-y-[1px]"
              >
                Abrir no Maps
              </Link>
            </div>
          </div>
          <div className="mt-6 relative aspect-[16/10] overflow-hidden rounded-3xl bg-[#F4F7FB] shadow-sm">
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

        <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/60 p-8 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight text-[#1E3A8A]">
            Pedido de reserva
          </h2>

          <p className="mt-3 leading-7 text-zinc-600/90 dark:text-zinc-400/90">
            Preenche com o dia e a hora. Se houver alguma preferência (mesa,
            alergias, carrinho de bebé…), diz aqui — ajuda imenso.
          </p>

          <div className="mt-6">
            <ReservationForm />
          </div>
        </div>
      </div>
    </section>
  );
}
