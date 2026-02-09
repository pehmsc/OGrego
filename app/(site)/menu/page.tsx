"use client";

import { useState } from "react";
import Image from "next/image";

const BASE_URL =
    "https://pub-1d125fe406c2413c836fec3139f85cbd.r2.dev/public/menu";

type Lang = "pt" | "en";

type ItemMenu = {
    id: number;
    nome: { pt: string; en: string };
    descricao?: { pt: string; en: string };
    preco: string;
    imagem: string;
};

type CategoriaMenu = {
    id: string;
    titulo: { pt: string; en: string };
    itens: ItemMenu[];
};

const categorias: CategoriaMenu[] = [
    {
        id: "entradas",
        titulo: {
            pt: "Entradas Gregas",
            en: "Greek Starters",
        },
        itens: [
            {
                id: 1,
                nome: {
                    pt: "Tzatziki com pão pita",
                    en: "Tzatziki with pita bread",
                },
                descricao: {
                    pt: "Iogurte grego com pepino, alho e azeite extra virgem.",
                    en: "Greek yogurt with cucumber, garlic and extra virgin olive oil.",
                },
                preco: "5,50 €",
                imagem: `${BASE_URL}/entrada-tzatziki.jpg`,
            },
            {
                id: 2,
                nome: {
                    pt: "Dolmas (folhas de videira recheadas)",
                    en: "Dolmas (stuffed vine leaves)",
                },
                descricao: {
                    pt: "Folhas de videira recheadas com arroz aromatizado e ervas.",
                    en: "Vine leaves stuffed with herbed rice.",
                },
                preco: "7,50 €",
                imagem: `${BASE_URL}/entrada-dolmas.jpg`,
            },
            {
                id: 3,
                nome: {
                    pt: "Saganaki de queijo",
                    en: "Cheese saganaki",
                },
                descricao: {
                    pt: "Queijo grego frito, servido com limão.",
                    en: "Fried Greek cheese served with lemon.",
                },
                preco: "8,50 €",
                imagem: `${BASE_URL}/entrada-saganaki.jpg`,
            },
        ],
    },
    {
        id: "principais",
        titulo: {
            pt: "Pratos Principais",
            en: "Main Dishes",
        },
        itens: [
            {
                id: 1,
                nome: { pt: "Moussaka", en: "Moussaka" },
                descricao: {
                    pt: "Lasanha grega de beringela, carne picada e molho bechamel.",
                    en: "Layered eggplant, minced meat and béchamel casserole.",
                },
                preco: "16,50 €",
                imagem: `${BASE_URL}/principal-moussaka.jpg`,
            },
            {
                id: 2,
                nome: {
                    pt: "Souvlaki de porco com pita",
                    en: "Pork souvlaki with pita",
                },
                descricao: {
                    pt: "Espetadas de porco marinadas, servidas com pita, tomate e tzatziki.",
                    en: "Marinated pork skewers served with pita, tomato and tzatziki.",
                },
                preco: "15,00 €",
                imagem: `${BASE_URL}/principal-souvlaki.jpg`,
            },
            {
                id: 3,
                nome: { pt: "Pastitsio", en: "Pastitsio" },
                descricao: {
                    pt: "Massa ao forno com carne picada e cobertura de bechamel.",
                    en: "Baked pasta with minced meat and béchamel topping.",
                },
                preco: "15,50 €",
                imagem: `${BASE_URL}/principal-pastitsio.jpeg`,
            },
        ],
    },
    {
        id: "sobremesas",
        titulo: {
            pt: "Sobremesas Gregas",
            en: "Greek Desserts",
        },
        itens: [
            {
                id: 1,
                nome: { pt: "Baklava", en: "Baklava" },
                descricao: {
                    pt: "Camadas de massa filo com nozes e mel.",
                    en: "Layers of phyllo pastry with nuts and honey syrup.",
                },
                preco: "5,00 €",
                imagem: `${BASE_URL}/sobremesa-baklava.jpg`,
            },
            {
                id: 2,
                nome: { pt: "Galaktoboureko", en: "Galaktoboureko" },
                descricao: {
                    pt: "Doce de sémola e creme, envolvido em massa filo.",
                    en: "Semolina custard wrapped in crispy phyllo.",
                },
                preco: "5,50 €",
                imagem: `${BASE_URL}/sobremesa-galaktoboureko.jpg`,
            },
            {
                id: 3,
                nome: { pt: "Loukoumades", en: "Loukoumades" },
                descricao: {
                    pt: "Bolinhos fritos com mel e canela.",
                    en: "Fried dough bites with honey and cinnamon.",
                },
                preco: "4,80 €",
                imagem: `${BASE_URL}/sobremesa-loukoumades.jpg`,
            },
        ],
    },
    {
        id: "bebidas",
        titulo: {
            pt: "Bebidas",
            en: "Drinks",
        },
        itens: [
            {
                id: 1,
                nome: { pt: "Ouzo (copo)", en: "Ouzo (glass)" },
                descricao: {
                    pt: "Licor grego anisado, servido fresco.",
                    en: "Traditional Greek anise liqueur, served chilled.",
                },
                preco: "4,00 €",
                imagem: `${BASE_URL}/bebida-ouzo.jpg`,
            },
            {
                id: 2,
                nome: {
                    pt: "Vinho tinto grego da casa",
                    en: "House Greek red wine",
                },
                descricao: {
                    pt: "Vinho tinto seco, seleção do Grego.",
                    en: "Dry red wine, house selection.",
                },
                preco: "5,50 €",
                imagem: `${BASE_URL}/bebida-vinho-grego.jpg`,
            },
            {
                id: 3,
                nome: {
                    pt: "Café grego frio (frappé)",
                    en: "Greek iced coffee (frappé)",
                },
                descricao: {
                    pt: "Café instantâneo batido com gelo e espuma.",
                    en: "Iced whipped instant coffee with foam.",
                },
                preco: "3,50 €",
                imagem: `${BASE_URL}/bebida-iced-coffee.jpg`,
            },
        ],
    },
];

export default function MenuPage() {
    const [lang, setLang] = useState<Lang>("pt");
    const [categoriaAtiva, setCategoriaAtiva] = useState<string>("entradas");

    const categoria =
        categorias.find((c) => c.id === categoriaAtiva) ?? categorias[0];

    const tituloSite =
        lang === "pt"
            ? "O Grego · Sabores da Grécia"
            : "O Grego · Flavors of Greece";

    const subtitulo =
        lang === "pt"
            ? "Pratos típicos gregos preparados com ingredientes mediterrânicos."
            : "Traditional Greek dishes made with Mediterranean ingredients.";

    return (
        <section className="w-full space-y-8 py-6">
            {/* Toggle de idioma */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
                <button
                    type="button"
                    onClick={() => setLang("pt")}
                    className={` cursor-pointer h-10 rounded-full px-4 text-sm font-semibold transition ${
                        lang === "pt"
                            ? "bg-[#1E3A8A] text-white"
                            : "border border-[#1E3A8A]/20 bg-white/60 text-[#1E3A8A] hover:border-[#1E3A8A]/40"
                    }`}
                >
                    PT
                </button>
                <button
                    type="button"
                    onClick={() => setLang("en")}
                    className={`cursor-pointer h-10 rounded-full px-4 text-sm font-semibold transition ${
                        lang === "en"
                            ? "bg-[#1E3A8A] text-white"
                            : "border border-[#1E3A8A]/20 bg-white/60 text-[#1E3A8A] hover:border-[#1E3A8A]/40"
                    }`}
                >
                    EN
                </button>
            </div>

            <header className="space-y-2">
                <h1 className="text-3xl font-semibold text-[#1E3A8A]">
                    {tituloSite}
                </h1>
                <p className="text-gray-600">{subtitulo}</p>
            </header>

            {/* Tabs de categorias */}
            <nav className="flex flex-wrap gap-3">
                {categorias.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoriaAtiva(cat.id)}
                        className={`h-10 rounded-full px-4 text-sm font-semibold transition ${
                            categoriaAtiva === cat.id
                                ? "bg-[#1E3A8A] text-white"
                                : "border border-[#1E3A8A]/20 bg-white/60 text-[#1E3A8A] hover:border-[#1E3A8A]/40"
                        }`}
                    >
                        {cat.titulo[lang]}
                    </button>
                ))}
            </nav>

            {/* Lista de itens da categoria ativa */}
            <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {categoria.itens.map((item) => (
                    <article
                        key={item.id}
                        className="border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow"
                    >
                        <div className="relative h-65 w-full">
                            <Image
                                src={item.imagem}
                                alt={item.nome[lang]}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="p-6 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-base font-semibold">
                                    {item.nome[lang]}
                                </h2>
                                <span className="text-emerald-700 font-semibold whitespace-nowrap">
                                    {item.preco}
                                </span>
                            </div>

                            {item.descricao && (
                                <p className="text-sm text-gray-600">
                                    {item.descricao[lang]}
                                </p>
                            )}
                        </div>
                    </article>
                ))}
            </section>
        </section>
    );
}
