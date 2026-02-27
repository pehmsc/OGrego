"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    TrashIcon,
    ShoppingCartIcon,
    TruckIcon,
    TicketIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "@/app/contexts/CartContext";
import { useUser } from "@clerk/nextjs";
import { validatePromoCodeInCart } from "@/app/lib/promo-actions";

export default function CartPage() {
    const searchParams = useSearchParams();
    const promoFromUrl = (searchParams.get("promo") || "").toUpperCase();
    // Check localStorage for promo if not in URL
    const [promoFromStorage, setPromoFromStorage] = useState("");
    useEffect(() => {
        if (!promoFromUrl && typeof window !== "undefined") {
            const promo = localStorage.getItem("promoSelecionada") || "";
            setPromoFromStorage(promo.toUpperCase());
        }
    }, [promoFromUrl]);

    const { user } = useUser();
    const {
        items,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
    } = useCart();

    // ========================================
    // CÓDIGO PROMOCIONAL
    // ========================================
    const [codigoPromocional, setCodigoPromocional] = useState(
        promoFromUrl || promoFromStorage,
    );
    const [descontoAplicado, setDescontoAplicado] = useState(0); // em cêntimos agora
    const [mensagemCodigo, setMensagemCodigo] = useState("");
    const [validandoCodigo, setValidandoCodigo] = useState(false);

    useEffect(() => {
        // Auto-aplicar promo se existir
        const promo = promoFromUrl || promoFromStorage;
        if (!promo) return;

        const autoAplicar = async () => {
            if (!promo.trim()) return;

            setValidandoCodigo(true);
            setMensagemCodigo("");

            try {
                const subtotalCents = Math.round(subtotal * 100);

                const result = await validatePromoCodeInCart(
                    promo,
                    subtotalCents,
                );

                if (result.valid && result.discountCents) {
                    setDescontoAplicado(result.discountCents);
                    setMensagemCodigo(result.message);
                } else {
                    setDescontoAplicado(0);
                    setMensagemCodigo(result.message);
                }
            } catch (error) {
                setDescontoAplicado(0);
                setMensagemCodigo("Erro ao validar código");
            } finally {
                setValidandoCodigo(false);
            }
        };

        autoAplicar();
    }, [promoFromUrl, promoFromStorage, subtotal]);

    const aplicarCodigo = async () => {
        if (!codigoPromocional.trim()) {
            setMensagemCodigo("Insira um código");
            return;
        }

        setValidandoCodigo(true);
        setMensagemCodigo("");

        try {
            const subtotalCents = Math.round(subtotal * 100);

            const result = await validatePromoCodeInCart(
                codigoPromocional,
                subtotalCents,
            );

            if (result.valid && result.discountCents) {
                setDescontoAplicado(result.discountCents);
                setMensagemCodigo(result.message);
            } else {
                setDescontoAplicado(0);
                setMensagemCodigo(result.message);
            }
        } catch (error) {
            setDescontoAplicado(0);
            setMensagemCodigo("Erro ao validar código");
        } finally {
            setValidandoCodigo(false);
        }
    };

    const removerCodigo = () => {
        setCodigoPromocional("");
        setDescontoAplicado(0);
        setMensagemCodigo("");
        if (typeof window !== "undefined") {
            localStorage.removeItem("promoSelecionada");
        }
    };

    // ========================================
    // CÁLCULOS
    // ========================================
    const aumentarQuantidade = (id: number) => {
        const item = items.find((i) => i.id === id);
        if (item) {
            updateQuantity(id, item.quantidade + 1);
        }
    };

    const diminuirQuantidade = (id: number) => {
        const item = items.find((i) => i.id === id);
        if (item && item.quantidade > 1) {
            updateQuantity(id, item.quantidade - 1);
        }
    };

    const valorDesconto = descontoAplicado / 100; // Converter cêntimos para euros (antes: const valorDesconto = (subtotal * descontoAplicado) / 100;)
    const subtotalComDesconto = subtotal - valorDesconto;

    const portes = subtotalComDesconto > 30 ? 0 : 2.5;
    const total = subtotalComDesconto + portes;
    const pontosAGanhar = Math.floor(total);

    // ========================================
    // CARRINHO VAZIO
    // ========================================
    if (items.length === 0) {
        return (
            <main className="mx-auto max-w-4xl px-4 py-12">
                <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-12 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#1E3A8A]/10">
                        <ShoppingCartIcon className="h-10 w-10 text-[#1E3A8A]" />
                    </div>
                    <h2 className="mb-2 text-2xl font-semibold text-[#1E3A8A]">
                        O seu carrinho está vazio
                    </h2>
                    <p className="mb-6 text-zinc-600">
                        Adicione pratos deliciosos ao seu carrinho!
                    </p>
                    <Link
                        href="/menu"
                        className="inline-flex h-12 items-center justify-center rounded-full bg-[#1E3A8A] px-8 text-sm font-medium text-white shadow-xl transition-all hover:-translate-y-[1px] hover:bg-[#162F73]"
                    >
                        Ver Menu
                    </Link>
                </div>
            </main>
        );
    }

    // ========================================
    // CARRINHO COM ITENS
    // ========================================
    return (
        <main className="mx-auto max-w-6xl px-4 py-8">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-3xl font-semibold text-[#1E3A8A]">
                    Carrinho de Compras
                </h1>
                <p className="text-zinc-600">
                    {totalItems} {totalItems === 1 ? "item" : "itens"} no
                    carrinho
                </p>
            </header>

            <div className="space-y-6">
                {/* Lista de Itens */}
                {items.map((item) => (
                    <article
                        key={item.id}
                        className="flex gap-4 rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                        {/* Imagem */}
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl">
                            <Image
                                src={item.imagem}
                                alt={item.nome}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Informação */}
                        <div className="flex flex-1 flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-[#1E3A8A]">
                                    {item.nome}
                                </h2>
                                <p className="text-sm text-zinc-600">
                                    {item.descricao}
                                </p>
                            </div>

                            {/* Preço e Controles - Mobile */}
                            <div className="mt-3 flex flex-wrap items-center gap-3 md:hidden">
                                <div className="text-lg font-semibold text-emerald-700">
                                    €{item.preco.toFixed(2)} × {item.quantidade}{" "}
                                    ={" "}
                                    <span className="text-[#1E3A8A]">
                                        €
                                        {(item.preco * item.quantidade).toFixed(
                                            2,
                                        )}
                                    </span>
                                </div>

                                {/* Quantidade */}
                                <div className="flex items-center gap-2 rounded-full border border-[#1E3A8A]/20 bg-white px-3 py-1">
                                    <button
                                        onClick={() =>
                                            diminuirQuantidade(item.id)
                                        }
                                        className="flex h-6 w-6 items-center justify-center rounded-full text-[#1E3A8A] transition-colors hover:bg-[#1E3A8A]/10"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center font-medium">
                                        {item.quantidade}
                                    </span>
                                    <button
                                        onClick={() =>
                                            aumentarQuantidade(item.id)
                                        }
                                        className="flex h-6 w-6 items-center justify-center rounded-full text-[#1E3A8A] transition-colors hover:bg-[#1E3A8A]/10"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Remover */}
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 transition-colors hover:bg-red-50"
                                    aria-label="Remover item"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Preço e Controles - Desktop */}
                        <div className="hidden flex-col items-end justify-between md:flex">
                            <div className="text-right">
                                <div className="text-sm text-zinc-600">
                                    €{item.preco.toFixed(2)} × {item.quantidade}
                                </div>
                                <div className="text-xl font-semibold text-[#1E3A8A]">
                                    €{(item.preco * item.quantidade).toFixed(2)}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Quantidade */}
                                <div className="flex items-center gap-2 rounded-full border border-[#1E3A8A]/20 bg-white px-3 py-1">
                                    <button
                                        onClick={() =>
                                            diminuirQuantidade(item.id)
                                        }
                                        className="flex h-6 w-6 items-center justify-center rounded-full text-[#1E3A8A] transition-colors hover:bg-[#1E3A8A]/10"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center font-medium">
                                        {item.quantidade}
                                    </span>
                                    <button
                                        onClick={() =>
                                            aumentarQuantidade(item.id)
                                        }
                                        className="flex h-6 w-6 items-center justify-center rounded-full text-[#1E3A8A] transition-colors hover:bg-[#1E3A8A]/10"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Remover */}
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full text-red-600 transition-colors hover:bg-red-50"
                                    aria-label="Remover item"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}

                {/* Código Promocional */}
                <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-6 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                        <TicketIcon className="h-5 w-5 text-[#1E3A8A]" />
                        <h3 className="font-semibold text-[#1E3A8A]">
                            Código Promocional
                        </h3>
                    </div>

                    {descontoAplicado > 0 ? (
                        // Código aplicado
                        <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-3">
                            <div>
                                <p className="text-sm font-medium text-emerald-800">
                                    {mensagemCodigo}
                                </p>
                                <p className="text-xs text-emerald-600">
                                    Código: {codigoPromocional.toUpperCase()}
                                </p>
                            </div>
                            <button
                                onClick={removerCodigo}
                                className="text-sm text-emerald-700 underline hover:text-emerald-900"
                            >
                                Remover
                            </button>
                        </div>
                    ) : (
                        // Campo para inserir código
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={codigoPromocional}
                                onChange={(e) =>
                                    setCodigoPromocional(
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                placeholder="Insira o código"
                                className="flex-1 rounded-full border border-[#1E3A8A]/20 bg-white px-4 py-2 text-sm transition-all focus:border-[#1E3A8A]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                            />
                            <button
                                onClick={aplicarCodigo}
                                disabled={
                                    validandoCodigo || !codigoPromocional.trim()
                                }
                                className="rounded-full bg-[#1E3A8A] px-6 py-2 text-sm font-medium text-white transition-all hover:bg-[#162F73] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {validandoCodigo ? "A validar..." : "Aplicar"}
                            </button>
                        </div>
                    )}

                    {mensagemCodigo && descontoAplicado === 0 && (
                        <p className="mt-2 text-xs text-red-600">
                            {mensagemCodigo}
                        </p>
                    )}
                </div>

                {/* Resumo da Encomenda */}
                <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <TruckIcon className="h-6 w-6 text-[#1E3A8A]" />
                        <h3 className="text-xl font-semibold text-[#1E3A8A]">
                            Resumo da Encomenda
                        </h3>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-zinc-600">
                                Subtotal ({totalItems}{" "}
                                {totalItems === 1 ? "item" : "itens"})
                            </span>
                            <span className="font-medium">
                                €{subtotal.toFixed(2)}
                            </span>
                        </div>

                        {descontoAplicado > 0 && (
                            <div className="flex justify-between text-emerald-600">
                                <span>Desconto ({codigoPromocional})</span>
                                <span className="font-medium">
                                    -€{valorDesconto.toFixed(2)}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <span className="text-zinc-600">
                                Portes e taxas
                            </span>
                            <span className="font-medium">
                                {portes === 0 ? (
                                    <span className="text-emerald-600">
                                        Grátis
                                    </span>
                                ) : (
                                    `€${portes.toFixed(2)}`
                                )}
                            </span>
                        </div>

                        {subtotalComDesconto < 30 && (
                            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                                <TruckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                <p>
                                    Adicione €
                                    {(30 - subtotalComDesconto).toFixed(2)} para
                                    portes grátis!
                                </p>
                            </div>
                        )}

                        <div className="my-3 border-t border-[#1E3A8A]/10"></div>

                        <div className="flex justify-between text-lg">
                            <span className="font-semibold text-[#1E3A8A]">
                                Total a pagar
                            </span>
                            <span className="font-bold text-[#1E3A8A]">
                                €{total.toFixed(2)}
                            </span>
                        </div>

                        {/* Pontos a ganhar */}
                        <div className="rounded-lg bg-[#1E3A8A]/5 p-3">
                            <p className="text-xs text-[#1E3A8A]">
                                Vai ganhar{" "}
                                <strong>{pontosAGanhar} pontos</strong> com esta
                                compra!
                            </p>
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="mt-6 space-y-3">
                        {user ? (
                            // User autenticado - pode finalizar compra
                            <Link
                                href={
                                    codigoPromocional
                                        ? `/checkout?promo=${encodeURIComponent(codigoPromocional)}`
                                        : "/checkout"
                                }
                                className="flex h-12 w-full items-center justify-center rounded-full bg-[#1E3A8A] text-sm font-medium text-white shadow-xl transition-all hover:-translate-y-[1px] hover:bg-[#162F73]"
                            >
                                Finalizar Compra
                            </Link>
                        ) : (
                            // User NÃO autenticado - precisa login
                            <div className="space-y-2">
                                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
                                    <p className="text-xs text-amber-800">
                                        🔒 Necessário iniciar sessão para
                                        finalizar compra
                                    </p>
                                </div>
                                <Link
                                    href={
                                        codigoPromocional
                                            ? `/sign-in?redirect_url=${encodeURIComponent(`/checkout?promo=${codigoPromocional}`)}`
                                            : "/sign-in?redirect_url=/checkout"
                                    }
                                    className="flex h-12 w-full items-center justify-center rounded-full bg-[#1E3A8A] text-sm font-medium text-white shadow-xl transition-all hover:-translate-y-[1px] hover:bg-[#162F73]"
                                >
                                    Iniciar Sessão
                                </Link>
                                <Link
                                    href={
                                        codigoPromocional
                                            ? `/sign-up?redirect_url=${encodeURIComponent(`/checkout?promo=${codigoPromocional}`)}`
                                            : "/sign-up?redirect_url=/checkout"
                                    }
                                    className="flex h-12 w-full items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-white text-sm font-medium text-[#1E3A8A] transition-all hover:border-[#1E3A8A]/40"
                                >
                                    Criar Conta
                                </Link>
                            </div>
                        )}

                        <Link
                            href="/menu"
                            className="flex h-12 w-full items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-white text-sm font-medium text-[#1E3A8A] transition-all hover:border-[#1E3A8A]/40"
                        >
                            Continuar a Comprar
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
