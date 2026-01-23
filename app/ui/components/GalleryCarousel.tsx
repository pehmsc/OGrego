"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  images: string[];
  aspect?: string;
};

export default function GalleryCarousel({ images, aspect = "4/5" }: Props) {
  const [index, setIndex] = useState(0);

  const total = images.length;

  function prev() {
    setIndex((i) => (i - 1 + total) % total);
  }

  function next() {
    setIndex((i) => (i + 1) % total);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [total]);

  return (
    <div className="grid gap-4">
      <div className="relative overflow-hidden rounded-3xl border border-[#1E3A8A]/10 bg-[#F4F7FB] shadow-sm">
        <div className={`relative aspect-[${aspect}]`}>
          <Image
            key={images[index]}
            src={images[index]}
            alt={`Galeria O Grego ${index + 1}`}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 900px, 100vw"
          />
        </div>
        <button
          type="button"
          onClick={prev}
          aria-label="Imagem anterior"
          className="group absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/25 p-3 text-white backdrop-blur transition hover:bg-black/35"
        >
          <span className="block text-lg leading-none">‹</span>
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Imagem seguinte"
          className="group absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/25 p-3 text-white backdrop-blur transition hover:bg-black/35"
        >
          <span className="block text-lg leading-none">›</span>
        </button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {index + 1} / {total}
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            className={`relative h-16 w-24 flex-none overflow-hidden rounded-2xl border transition ${
              i === index
                ? "border-[#1E3A8A]/60 ring-2 ring-[#1E3A8A]/20"
                : "border-[#1E3A8A]/10 hover:border-[#1E3A8A]/30"
            }`}
            aria-label={`Ir para imagem ${i + 1}`}
          >
            <Image src={src} alt="" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
