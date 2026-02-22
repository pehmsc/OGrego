"use client";

import { useState, useTransition } from "react";
import { deleteAccount } from "@/app/lib/profile-actions";

export default function DeleteAccountButton() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    function handleConfirm() {
        startTransition(async () => {
            await deleteAccount();
        });
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex h-12 w-full items-center justify-center rounded-full border border-red-300 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
            >
                Eliminar Conta
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
                        <h3 className="mb-2 text-xl font-semibold text-zinc-800">
                            Eliminar conta?
                        </h3>
                        <p className="mb-6 text-sm text-zinc-600">
                            Os seus dados pessoais serão apagados permanentemente.
                            O histórico de encomendas e faturas será mantido por
                            obrigação fiscal, mas deixará de estar associado ao
                            seu perfil. Esta ação não pode ser revertida.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={isPending}
                                className="flex h-12 w-full items-center justify-center rounded-full bg-red-600 text-sm font-medium text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isPending ? "A eliminar..." : "Confirmar eliminação"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                disabled={isPending}
                                className="flex h-12 w-full items-center justify-center rounded-full border border-zinc-200 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
