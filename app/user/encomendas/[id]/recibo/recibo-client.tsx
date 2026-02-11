"use client";

export default function ReciboClient({
    orderData,
    items,
}: {
    orderData: any;
    items: any[];
}) {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-3xl bg-white p-12 shadow-lg">
                {/* Header */}
                <div className="mb-8 border-b pb-6">
                    <h1 className="text-3xl font-bold text-[#1E3A8A]">
                        O Grego
                    </h1>
                    <p className="text-sm text-gray-600">
                        Sabores Autênticos da Grécia
                    </p>
                </div>

                {/* Aviso */}
                <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
                    <p className="text-sm text-amber-800">
                        ⚠️ <strong>Atenção:</strong> Este documento NÃO é uma
                        fatura válida para efeitos fiscais. É apenas um recibo
                        de encomenda.
                    </p>
                </div>

                {/* Informações */}
                <div className="mb-8">
                    <h2 className="mb-4 text-xl font-semibold">
                        Recibo de Encomenda #{orderData.id}
                    </h2>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600">Data:</p>
                            <p className="font-medium">
                                {new Date(
                                    orderData.created_at,
                                ).toLocaleDateString("pt-PT")}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Tipo:</p>
                            <p className="font-medium">
                                {orderData.order_type === "delivery"
                                    ? "Delivery"
                                    : "Takeaway"}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Cliente:</p>
                            <p className="font-medium">
                                {orderData.customer_name}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Email:</p>
                            <p className="font-medium">
                                {orderData.customer_email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <table className="mb-8 w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="pb-2 text-left text-sm font-semibold">
                                Item
                            </th>
                            <th className="pb-2 text-center text-sm font-semibold">
                                Qtd
                            </th>
                            <th className="pb-2 text-right text-sm font-semibold">
                                Preço
                            </th>
                            <th className="pb-2 text-right text-sm font-semibold">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} className="border-b">
                                <td className="py-3 text-sm">
                                    {item.item_name}
                                </td>
                                <td className="py-3 text-center text-sm">
                                    {item.quantity}
                                </td>
                                <td className="py-3 text-right text-sm">
                                    €{(item.item_price_cents / 100).toFixed(2)}
                                </td>
                                <td className="py-3 text-right text-sm">
                                    €{(item.subtotal_cents / 100).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totais */}
                <div className="ml-auto max-w-xs space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>
                            €{(orderData.subtotal_cents / 100).toFixed(2)}
                        </span>
                    </div>

                    {orderData.delivery_fee_cents > 0 && (
                        <div className="flex justify-between text-sm">
                            <span>Portes:</span>
                            <span>
                                €
                                {(orderData.delivery_fee_cents / 100).toFixed(
                                    2,
                                )}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between border-t pt-2 text-lg font-bold">
                        <span>Total:</span>
                        <span>€{(orderData.total_cents / 100).toFixed(2)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 border-t pt-6 text-center text-xs text-gray-500">
                    <p>Este documento não é válido como fatura.</p>
                    <p className="mt-2">
                        Para solicitar fatura, contacte-nos: info@ogrego.pt
                    </p>
                </div>

                {/* Botões - FUNCIONAM AGORA! */}
                <div className="mt-8 flex gap-4 print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="flex-1 rounded-full bg-[#1E3A8A] px-6 py-3 text-white hover:bg-[#162F73] transition-all"
                    >
                        🖨️ Imprimir
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="flex-1 rounded-full border border-gray-300 px-6 py-3 hover:bg-gray-50 transition-all"
                    >
                        ← Voltar
                    </button>
                </div>
            </div>
        </div>
    );
}
