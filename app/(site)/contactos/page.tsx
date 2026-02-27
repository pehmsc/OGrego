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
                    Quer reservar mesa ou tirar uma dúvida rápida? Este é o
                    sítio certo.
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
                            <div>Rua de Atenas, n.º5, 1200-542 Lisboa</div>
                        </div>

                        <div>
                            <div className="text-sm font-semibold text-[#1E3A8A]/80">
                                Horário
                            </div>
                            <div>
                                Terça a Domingo — 12:00–15:00 / 19:00–23:00
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-semibold text-[#1E3A8A]/80">
                                Telefone
                            </div>
                            <div>+351 961 234 567</div>
                        </div>

                        <div>
                            <div className="text-sm font-semibold text-[#1E3A8A]/80">
                                Email
                            </div>
                            <div>ogrego.rest@gmail.com</div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="tel:+351900000000"
                                className="flex h-12 items-center justify-center rounded-full bg-[#1E3A8A] px-6 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#162F73] hover:-translate-y-[1px]"
                            >
                                Ligar
                            </Link>
                        </div>
                    </div>
                    <div className="mt-6 relative aspect-[16/10] overflow-hidden rounded-3xl bg-[#F4F7FB] shadow-sm">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d24910.54981788812!2d-9.1979776!3d38.699008!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1934b005e2b55f%3A0x2b356b0c7449fc9d!2sPonte%2025%20de%20Abril!5e0!3m2!1spt-PT!2spt!4v1769181261888!5m2!1spt-PT!2spt"
                            className="absolute inset-0 w-full h-full"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Localização - Ponte 25 de Abril"
                        />
                    </div>
                </div>

                <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/60 p-8 shadow-sm">
                    <h2 className="text-2xl font-bold tracking-tight text-[#1E3A8A]">
                        Pedido de reserva
                    </h2>

                    <p className="mt-3 leading-7 text-zinc-600/90 dark:text-zinc-400/90">
                        Preencha com o dia e a hora. Se houver alguma
                        preferência (mesa, alergias, carrinho de bebé…),
                        refira-a aqui — ajuda imenso.
                    </p>

                    <div className="mt-6">
                        <ReservationForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
