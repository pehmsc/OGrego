import GalleryCarousel from "../../ui/components/GalleryCarousel";

const images = [
    "/galeria/01.png",
    "/galeria/02.png",
    "/galeria/03.png",
    "/galeria/04.png",
];

export default function GaleriaPage() {
    return (
        <section className="grid gap-10">
            <header className="grid gap-4">
                <h1 className="text-4xl font-semibold tracking-tight text-[#1E3A8A] sm:text-5xl">
                    Galeria
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-zinc-600/90 dark:text-zinc-400/90">
                    Um cheirinho do que te espera: luz, detalhe e aquele
                    ambiente que dá vontade de ficar. Desliza as fotos… e já
                    vais perceber porquê.
                </p>
            </header>

            <GalleryCarousel images={images} aspect="16/10" />
        </section>
    );
}
