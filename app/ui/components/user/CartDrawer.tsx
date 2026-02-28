"use client";

import Image from "next/image";
import Link from "next/link";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/app/contexts/CartContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, updateQuantity, totalItems, subtotal } = useCart();

  if (!open) return null;

  const aumentar = (id: number) => {
    const item = items.find((i) => i.id === id);
    if (item) updateQuantity(id, item.quantidade + 1);
  };

  const diminuir = (id: number) => {
    const item = items.find((i) => i.id === id);
    if (item && item.quantidade > 1) updateQuantity(id, item.quantidade - 1);
  };

  return (
    <div className="fixed inset-0 z-[999]">
      {/* overlay */}
      <button
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] dark:bg-slate-950/70"
        onClick={onClose}
        aria-label="Fechar carrinho"
      />

      {/* painel */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl dark:bg-slate-950">
        <div className="flex h-16 items-center justify-between border-b border-[#1E3A8A]/10 px-5 dark:border-white/10">
          <div>
            <p className="text-sm text-[#1E3A8A]/70 dark:text-slate-300">Carrinho</p>
            <p className="text-base font-semibold text-[#1E3A8A] dark:text-slate-50">
              {totalItems} {totalItems === 1 ? "item" : "itens"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1E3A8A]/15 hover:bg-[#F4F7FB] dark:border-white/10 dark:hover:bg-slate-800"
            aria-label="Fechar"
          >
            <XMarkIcon className="h-5 w-5 text-[#1E3A8A] dark:text-slate-100" />
          </button>
        </div>

        {/* conteúdo */}
        <div className="h-[calc(100%-16rem)] overflow-auto p-5">
          {items.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-slate-300">O carrinho está vazio.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-2xl border border-[#1E3A8A]/10 p-3"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl">
                    <Image
                      src={item.imagem}
                      alt={item.nome}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[#1E3A8A] dark:text-slate-50">
                          {item.nome}
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-slate-300">
                          €{item.preco.toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                        aria-label="Remover"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {/* quantidade */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-[#1E3A8A]/20 bg-white px-2 py-1 dark:border-white/10 dark:bg-slate-900">
                        <button
                          onClick={() => diminuir(item.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[#1E3A8A] hover:bg-[#1E3A8A]/10 dark:text-slate-100 dark:hover:bg-slate-800"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() => aumentar(item.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[#1E3A8A] hover:bg-[#1E3A8A]/10 dark:text-slate-100 dark:hover:bg-slate-800"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-sm font-semibold text-[#1E3A8A] dark:text-slate-50">
                        €{(item.preco * item.quantidade).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="border-t border-[#1E3A8A]/10 p-5 dark:border-white/10">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-zinc-600 dark:text-slate-300">Subtotal</span>
            <span className="text-base font-semibold text-[#1E3A8A] dark:text-slate-50">
              €{subtotal.toFixed(2)}
            </span>
          </div>

          <div className="space-y-3">
            <Link
              href="/cart"
              onClick={onClose}
              className="flex h-12 w-full items-center justify-center rounded-full bg-[#1E3A8A] text-sm font-medium text-white shadow-xl transition-all hover:-translate-y-[1px] hover:bg-[#162F73]"
            >
              Ir para Checkout
            </Link>

            <Link
              href="/menu"
              onClick={onClose}
              className="flex h-12 w-full items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-white text-sm font-medium text-[#1E3A8A] transition-all hover:border-[#1E3A8A]/40 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Continuar a comprar
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
