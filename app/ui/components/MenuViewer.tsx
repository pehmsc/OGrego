"use client";

import { useMemo, useState } from "react";

type Props = {
  ptSrc: string;
  enSrc: string;
};

export default function MenuViewer({ ptSrc, enSrc }: Props) {
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [loaded, setLoaded] = useState(false);

  const src = useMemo(
    () => (lang === "pt" ? ptSrc : enSrc),
    [lang, ptSrc, enSrc],
  );

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setLang("pt");
            setLoaded(false);
          }}
          className={`h-10 rounded-full px-4 text-sm font-semibold transition ${
            lang === "pt"
              ? "bg-[#1E3A8A] text-white"
              : "border border-[#1E3A8A]/20 bg-white/60 text-[#1E3A8A] hover:border-[#1E3A8A]/40"
          }`}
        >
          PT
        </button>

        <button
          type="button"
          onClick={() => {
            setLang("en");
            setLoaded(false);
          }}
          className={`h-10 rounded-full px-4 text-sm font-semibold transition ${
            lang === "en"
              ? "bg-[#1E3A8A] text-white"
              : "border border-[#1E3A8A]/20 bg-white/60 text-[#1E3A8A] hover:border-[#1E3A8A]/40"
          }`}
        >
          EN
        </button>

        {lang === "en" && (
          <span className="text-sm text-zinc-600/90">
            (quando adicionares o PDF em EN)
          </span>
        )}
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-[#1E3A8A]/10 bg-white/60 shadow-sm">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-[#F4F7FB]" />
        )}

        <iframe
          key={src}
          src={src}
          onLoad={() => setLoaded(true)}
          className="h-[78vh] w-full"
          title="Menu PDF"
        />
      </div>
    </div>
  );
}
