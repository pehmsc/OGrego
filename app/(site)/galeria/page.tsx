import GalleryCarousel from "../../ui/components/GalleryCarousel";
import { getGalleryImages } from "@/app/lib/gallery";

export default async function GaleriaPage() {
    const images = await getGalleryImages();

    return (
        <section className="grid gap-10">
            <header className="grid gap-4">
                <h1 className="text-4xl font-semibold tracking-tight text-[#1E3A8A] sm:text-5xl">
                    Galeria
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-zinc-600/90 dark:text-zinc-400/90">
                    Um cheirinho do que o espera: luz, detalhe e aquele ambiente
                    que dá vontade de ficar. Deslize as fotos e já vai perceber
                    porquê.
                </p>
            </header>

            <GalleryCarousel images={images} aspect="16/10" />
        </section>
    );
}
