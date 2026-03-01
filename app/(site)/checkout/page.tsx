"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/app/contexts/CartContext";
import { createOrder, getCheckoutPricingPreview } from "./actions";
import Image from "next/image";
import {
    TruckIcon,
    ShoppingBagIcon,
    CreditCardIcon,
} from "@heroicons/react/24/outline";

type ProfileData = {
    name?: string;
    email?: string;
    phone?: string;
    nif?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    points?: number;
};

type PricingPreview = {
    role: "admin" | "user";
    breakdown: {
        subtotalCents: number;
        discountCents: number;
        discountKind: "none" | "promo" | "admin" | "loyalty";
        deliveryFeeCents: number;
        totalCents: number;
    };
};

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { items, subtotal, clearCart } = useCart();
    const { user, isLoaded } = useUser();
    const userId = user?.id;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingUserData, setIsLoadingUserData] = useState(true);
    const [isPricingLoading, setIsPricingLoading] = useState(false);
    const [pricingPreview, setPricingPreview] = useState<PricingPreview | null>(
        null,
    );
    const [userData, setUserData] = useState<ProfileData | null>(null);

    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        orderType: "delivery" as "delivery" | "takeaway",
        deliveryAddress: "",
        deliveryPostalCode: "",
        deliveryCity: "",
        paymentMethod: "mbway",
        notes: "",
    });

    // LER PROMO CODE DO URL
    const promoFromUrl = (searchParams.get("promo") || "").trim().toUpperCase();
    const promoCode = promoFromUrl;

    // ========================================
    // BUSCAR DADOS DO USER NA BD
    // ========================================
    useEffect(() => {
        async function fetchUserData() {
            if (!isLoaded) return;

            setIsLoadingUserData(true);

            try {
                if (user) {
                    const response = await fetch("/api/profile");

                    if (response.ok) {
                        const data = await response.json();
                        setUserData(data);

                        setFormData((prev) => ({
                            ...prev,
                            customerName: data.name || user.fullName || "",
                            customerEmail:
                                data.email ||
                                user.primaryEmailAddress?.emailAddress ||
                                "",
                            customerPhone: data.phone || "",
                            deliveryAddress: data.address || "",
                            deliveryPostalCode: data.postalCode || "",
                            deliveryCity: data.city || "",
                        }));
                    } else if (
                        response.status === 401 ||
                        response.status === 500
                    ) {
                        console.log("Erro na API, usando dados do Clerk");
                        setFormData((prev) => ({
                            ...prev,
                            customerName: user.fullName || "",
                            customerEmail:
                                user.primaryEmailAddress?.emailAddress || "",
                        }));
                    } else {
                        setFormData((prev) => ({
                            ...prev,
                            customerName: user.fullName || "",
                            customerEmail:
                                user.primaryEmailAddress?.emailAddress || "",
                        }));
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados do user:", error);
                if (user) {
                    setFormData((prev) => ({
                        ...prev,
                        customerName: user.fullName || "",
                        customerEmail:
                            user.primaryEmailAddress?.emailAddress || "",
                    }));
                }
            } finally {
                setIsLoadingUserData(false);
            }
        }

        fetchUserData();
    }, [user, isLoaded]);

    useEffect(() => {
        let isCancelled = false;

        async function fetchPricingPreview() {
            if (!isLoaded || !userId || items.length === 0) {
                setPricingPreview(null);
                setIsPricingLoading(false);
                return;
            }

            setIsPricingLoading(true);

            try {
                const result = await getCheckoutPricingPreview({
                    items: items.map((item) => ({
                        id: item.id,
                        quantidade: item.quantidade,
                    })),
                    orderType: formData.orderType,
                    promoCode: promoCode || undefined,
                });

                if (isCancelled) return;

                if (result.success) {
                    setPricingPreview({
                        role: result.role,
                        breakdown: {
                            subtotalCents: result.breakdown.subtotalCents,
                            discountCents: result.breakdown.discountCents,
                            discountKind: result.breakdown.discountKind,
                            deliveryFeeCents: result.breakdown.deliveryFeeCents,
                            totalCents: result.breakdown.totalCents,
                        },
                    });
                } else {
                    setPricingPreview(null);
                }
            } catch (error) {
                if (isCancelled) return;
                console.error("Erro ao calcular preview do checkout:", error);
                setPricingPreview(null);
            } finally {
                if (!isCancelled) {
                    setIsPricingLoading(false);
                }
            }
        }

        void fetchPricingPreview();

        return () => {
            isCancelled = true;
        };
    }, [isLoaded, userId, items, formData.orderType, promoCode]);

    // ========================================
    // SUBMIT: Criar order + redirect Stripe ou success
    // ========================================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await createOrder({
                ...formData,
                items,
                promoCode: promoCode || undefined,
            });

            if (result.success) {
                if (result.checkoutUrl) {
                    // Stripe: NÃO limpar carrinho agora, limpa no order-success
                    window.location.href = result.checkoutUrl;
                } else {
                    // Cash: limpar carrinho e ir para sucesso
                    clearCart();
                    router.push(`/order-success/${result.orderId}`);
                }
            } else {
                alert(result.error || "Erro ao processar encomenda");
            }
        } catch {
            alert("Erro ao processar encomenda. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fallbackSubtotalCents = Math.round(subtotal * 100);
    const fallbackDeliveryFeeCents =
        formData.orderType === "delivery" && fallbackSubtotalCents < 3000
            ? 250
            : 0;
    const fallbackTotalCents = fallbackSubtotalCents + fallbackDeliveryFeeCents;

    const subtotalCents =
        pricingPreview?.breakdown.subtotalCents ?? fallbackSubtotalCents;
    const discountCents = pricingPreview?.breakdown.discountCents ?? 0;
    const discountKind = pricingPreview?.breakdown.discountKind ?? "none";
    const deliveryFeeCents =
        pricingPreview?.breakdown.deliveryFeeCents ?? fallbackDeliveryFeeCents;
    const totalCents =
        pricingPreview?.breakdown.totalCents ?? fallbackTotalCents;
    const discountLabel =
        discountKind === "admin"
            ? "Desconto Admin (50%)"
            : discountKind === "loyalty"
              ? "Desconto Fidelização"
              : "Desconto Promocional";

    // ========================================
    // LOADING
    // ========================================
    if (!isLoaded || isLoadingUserData) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#1E3A8A]/20 border-t-[#1E3A8A]"></div>
                        <p className="text-zinc-600 dark:text-slate-300">
                            A carregar dados...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    // ========================================
    // PROTEÇÃO: USER TEM QUE ESTAR AUTENTICADO
    // ========================================
    if (isLoaded && !user) {
        return (
            <main className="mx-auto max-w-4xl px-4 py-12">
                <div className="site-card p-8 text-center sm:p-12">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                        <span className="text-4xl">🔒</span>
                    </div>
                    <h2 className="mb-2 text-2xl font-semibold text-[#1E3A8A]">
                        Necessário iniciar sessão
                    </h2>
                    <p className="mb-6 text-zinc-600 dark:text-slate-300">
                        Para fazer encomendas precisa de ter uma conta.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/sign-in?redirect_url=/checkout"
                            className="inline-flex h-12 items-center justify-center rounded-full bg-[#1E3A8A] px-8 text-sm font-medium text-white hover:bg-[#162F73] transition-all shadow-lg"
                        >
                            Iniciar Sessão
                        </Link>
                        <Link
                            href="/sign-up?redirect_url=/checkout"
                            className="site-button-secondary inline-flex h-12 px-8"
                        >
                            Criar Conta
                        </Link>
                    </div>
                    <div className="mt-6">
                        <Link
                            href="/cart"
                            className="text-sm text-zinc-600 underline hover:text-[#1E3A8A] dark:text-slate-300"
                        >
                            ← Voltar ao carrinho
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // ========================================
    // NIF EM FALTA
    // ========================================
    if (user && userData && !userData.nif) {
        return (
            <main className="mx-auto max-w-4xl px-4 py-12">
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center shadow-sm dark:border-amber-900/60 dark:bg-amber-500/10 sm:p-12">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                        <span className="text-4xl">📋</span>
                    </div>
                    <h2 className="mb-2 text-2xl font-semibold text-amber-900">
                        NIF necessário para continuar
                    </h2>
                    <p className="mb-6 text-amber-800">
                        Para emitir recibo fiscal é necessário ter o NIF
                        preenchido no perfil. Adicione o seu NIF e volte para
                        finalizar a encomenda.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/user/profile"
                            className="inline-flex h-12 items-center justify-center rounded-full bg-[#1E3A8A] px-8 text-sm font-medium text-white hover:bg-[#162F73] transition-all shadow-lg"
                        >
                            Ir para o Perfil
                        </Link>
                        <Link
                            href="/menu"
                            className="site-button-secondary inline-flex h-12 px-8"
                        >
                            ← Voltar ao Menu
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // ========================================
    // CARRINHO VAZIO
    // ========================================
    if (items.length === 0 && !isSubmitting) {
        return (
            <main className="mx-auto max-w-4xl px-4 py-12">
                <div className="site-card p-8 text-center sm:p-12">
                    <h2 className="mb-4 text-2xl font-semibold text-[#1E3A8A]">
                        Carrinho vazio
                    </h2>
                    <p className="mb-6 text-zinc-600 dark:text-slate-300">
                        Adicione produtos antes de fazer checkout.
                    </p>
                    <Link
                        href="/menu"
                        className="inline-flex h-12 items-center justify-center rounded-full bg-[#1E3A8A] px-8 text-sm font-medium text-white hover:bg-[#162F73] transition-all"
                    >
                        Ver Menu
                    </Link>
                </div>
            </main>
        );
    }

    // ========================================
    // FORMULÁRIO DE CHECKOUT
    // ========================================
    return (
        <main className="mx-auto max-w-6xl px-4 py-8">
            <h1 className="mb-8 text-3xl font-semibold text-[#1E3A8A]">
                Finalizar Compra
            </h1>

            {/* Banner user autenticado */}
            <div className="mb-6 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
                <p className="text-sm text-emerald-800">
                    ✓ Sessão iniciada como{" "}
                    <strong>
                        {userData?.name ||
                            user.fullName ||
                            user.primaryEmailAddress?.emailAddress}
                    </strong>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
                {/* COLUNA ESQUERDA - FORMULÁRIO */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Dados Pessoais */}
                    <section className="site-card p-6">
                        <h2 className="mb-4 text-xl font-semibold text-[#1E3A8A]">
                            Dados Pessoais
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Nome completo *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.customerName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            customerName: e.target.value,
                                        })
                                    }
                                    className="site-input-pill"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.customerEmail}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            customerEmail: e.target.value,
                                        })
                                    }
                                    className="site-input-pill"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.customerPhone}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            customerPhone: e.target.value,
                                        })
                                    }
                                    className="site-input-pill"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Tipo de Encomenda */}
                    <section className="site-card p-6">
                        <h2 className="mb-4 text-xl font-semibold text-[#1E3A8A]">
                            Tipo de Encomenda
                        </h2>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        orderType: "delivery",
                                    })
                                }
                                className={`flex items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                                    formData.orderType === "delivery"
                                        ? "border-[#1E3A8A] bg-[#1E3A8A]/5"
                                        : "border-[#1E3A8A]/20 hover:border-[#1E3A8A]/40"
                                }`}
                            >
                                <TruckIcon className="h-6 w-6 text-[#1E3A8A]" />
                                <div className="text-left">
                                    <p className="font-semibold text-[#1E3A8A]">
                                        Delivery
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-slate-300">
                                        Entrega ao domicílio
                                    </p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        orderType: "takeaway",
                                    })
                                }
                                className={`flex items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                                    formData.orderType === "takeaway"
                                        ? "border-[#1E3A8A] bg-[#1E3A8A]/5"
                                        : "border-[#1E3A8A]/20 hover:border-[#1E3A8A]/40"
                                }`}
                            >
                                <ShoppingBagIcon className="h-6 w-6 text-[#1E3A8A]" />
                                <div className="text-left">
                                    <p className="font-semibold text-[#1E3A8A]">
                                        Takeaway
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-slate-300">
                                        Levantar no restaurante
                                    </p>
                                </div>
                            </button>
                        </div>
                    </section>

                    {/* Morada (só se delivery) */}
                    {formData.orderType === "delivery" && (
                        <section className="site-card p-6">
                            <h2 className="mb-4 text-xl font-semibold text-[#1E3A8A]">
                                Morada de Entrega
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                        Morada completa *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.deliveryAddress}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                deliveryAddress: e.target.value,
                                            })
                                        }
                                        placeholder="Rua, número, andar"
                                        className="site-input-pill"
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                            Código Postal *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.deliveryPostalCode}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    deliveryPostalCode:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="1000-000"
                                            className="site-input-pill"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                            Cidade *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.deliveryCity}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    deliveryCity:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="Lisboa"
                                            className="site-input-pill"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Pagamento */}
                    <section className="site-card p-6">
                        <h2 className="mb-4 text-xl font-semibold text-[#1E3A8A]">
                            Método de Pagamento
                        </h2>

                        <select
                            value={formData.paymentMethod}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    paymentMethod: e.target.value,
                                })
                            }
                            className="site-input-pill"
                        >
                            <option value="mbway">MB WAY</option>
                            <option value="card">Cartão</option>
                            <option value="cash">
                                Dinheiro (na entrega/levantamento)
                            </option>
                            <option value="multibanco">Multibanco</option>
                        </select>

                        {formData.paymentMethod !== "cash" && (
                            <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
                                Será redirecionado para uma página de pagamento
                                segura.
                            </p>
                        )}
                    </section>

                    {/* Observações */}
                    <section className="site-card p-6">
                        <h2 className="mb-4 text-xl font-semibold text-[#1E3A8A]">
                            Observações (opcional)
                        </h2>

                        <textarea
                            value={formData.notes}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    notes: e.target.value,
                                })
                            }
                            rows={3}
                            placeholder="Ex: sem cebola, tocar à campainha, etc."
                            className="site-input"
                        />
                    </section>
                </div>

                {/* COLUNA DIREITA - RESUMO */}
                <div className="lg:col-span-1">
                    <div className="space-y-6 lg:sticky lg:top-4">
                        {/* Pontos do user */}
                        {(userData?.points ?? 0) > 0 && (
                            <div className="rounded-3xl border border-[#1E3A8A]/10 bg-gradient-to-br from-amber-50 to-orange-50 p-6 dark:border-white/10 dark:from-amber-500/10 dark:to-orange-500/10">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500">
                                        <span className="text-2xl">🏆</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-amber-800">
                                            Tem disponível
                                        </p>
                                        <p className="text-2xl font-bold text-amber-900">
                                            {userData?.points ?? 0} pontos
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Resumo da Encomenda */}
                        <section className="site-card p-6">
                            <h2 className="mb-4 text-xl font-semibold text-[#1E3A8A]">
                                Resumo
                            </h2>

                            <div className="space-y-3">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                                            <Image
                                                src={item.imagem}
                                                alt={item.nome}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                {item.nome}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-slate-300">
                                                {item.quantidade}x €
                                                {item.preco.toFixed(2)}
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            €
                                            {(
                                                item.preco * item.quantidade
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                ))}

                                <div className="my-3 border-t border-[#1E3A8A]/10"></div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-slate-300">
                                        Subtotal
                                    </span>
                                    <span className="font-medium">
                                        €{(subtotalCents / 100).toFixed(2)}
                                    </span>
                                </div>

                                {discountCents > 0 && (
                                    <div className="flex justify-between text-sm text-emerald-700">
                                        <span>{discountLabel}</span>
                                        <span className="font-medium">
                                            -€
                                            {(discountCents / 100).toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-slate-300">
                                        Portes
                                    </span>
                                    {deliveryFeeCents > 0 ? (
                                        <span className="font-medium">
                                            €
                                            {(deliveryFeeCents / 100).toFixed(
                                                2,
                                            )}
                                        </span>
                                    ) : (
                                        <span className="font-medium text-emerald-600">
                                            Grátis
                                        </span>
                                    )}
                                </div>

                                <div className="my-3 border-t border-[#1E3A8A]/10"></div>

                                <div className="flex justify-between text-lg">
                                    <span className="font-semibold text-[#1E3A8A]">
                                        Total
                                    </span>
                                    <span className="font-bold text-[#1E3A8A]">
                                        €{(totalCents / 100).toFixed(2)}
                                    </span>
                                </div>

                                {isPricingLoading && (
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                        A atualizar total...
                                    </p>
                                )}
                            </div>
                        </section>

                        {/* Botão Finalizar */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#1E3A8A] text-sm font-medium text-white shadow-xl transition-all hover:-translate-y-[1px] hover:bg-[#162F73] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                "A processar..."
                            ) : (
                                <>
                                    <CreditCardIcon className="h-5 w-5" />
                                    {formData.paymentMethod === "cash"
                                        ? "Finalizar Encomenda"
                                        : "Pagar Encomenda"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </main>
    );
}
