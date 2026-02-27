"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReciboClient({
    orderData,
    items,
}: {
    orderData: any;
    items: any[];
}) {
    const handlePDF = () => {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4",
        });

        // Margens e layout
        const marginLeft = 50;
        const marginRight = 545;
        let y = 60;

        // Header
        doc.setFontSize(24);
        doc.setTextColor("#1E3A8A");
        doc.text("O Grego", marginLeft, y);
        doc.setFontSize(12);
        doc.setTextColor("#666");
        doc.text("Sabores Autênticos da Grécia", marginLeft, y + 18);

        // Linha separadora
        doc.setDrawColor(30, 58, 138);
        doc.setLineWidth(2);
        doc.line(marginLeft, y + 35, marginRight, y + 35);

        // Informações
        y += 60;
        doc.setFontSize(15);
        doc.setTextColor("#1E3A8A");
        doc.text(`Recibo de Encomenda #${orderData.id}`, marginLeft, y);

        doc.setFontSize(11);
        doc.setTextColor("#000");
        doc.text(
            `Data: ${new Date(orderData.created_at).toLocaleDateString("pt-PT")}`,
            marginLeft,
            y + 20,
        );
        doc.text(
            `Tipo: ${orderData.order_type === "delivery" ? "Delivery" : "Takeaway"}`,
            marginLeft + 200,
            y + 20,
        );
        doc.text(`Cliente: ${orderData.customer_name}`, marginLeft, y + 38);
        doc.text(
            `Email: ${orderData.customer_email}`,
            marginLeft + 200,
            y + 38,
        );

        // Linha separadora
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(1);
        doc.line(marginLeft, y + 50, marginRight, y + 50);

        // Tabela de Itens
        autoTable(doc, {
            startY: y + 60,
            head: [["Item", "Qtd", "Preço", "Total"]],
            body: items.map((item: any) => [
                item.item_name,
                item.quantity,
                `€${(item.item_price_cents / 100).toFixed(2)}`,
                `€${(item.subtotal_cents / 100).toFixed(2)}`,
            ]),
            theme: "striped",
            headStyles: {
                fillColor: [30, 58, 138],
                textColor: [255, 255, 255],
                fontSize: 12,
                halign: "center",
            },
            bodyStyles: {
                fontSize: 11,
                halign: "center",
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            margin: { left: marginLeft, right: 50 },
            tableWidth: 495,
        });

        // Cálculo de IVA (ajuste a percentagem se necessário)
        const ivaPercent = 0.23;
        const total = orderData.total_cents / 100;
        const semIVA = total / (1 + ivaPercent);
        const valorIVA = total - semIVA;

        // Totais
        let finalY = (doc as any).lastAutoTable.finalY + 20;
        doc.setFontSize(12);
        doc.setTextColor("#000");
        doc.text(
            `Subtotal: €${(orderData.subtotal_cents / 100).toFixed(2)}`,
            marginLeft,
            finalY,
        );
        if (orderData.delivery_fee_cents > 0) {
            doc.text(
                `Portes: €${(orderData.delivery_fee_cents / 100).toFixed(2)}`,
                marginLeft,
                finalY + 18,
            );
            finalY += 18;
        }

        // Valor sem IVA
        doc.text(
            `Valor sem IVA: €${semIVA.toFixed(2)}`,
            marginLeft,
            finalY + 36,
        );
        // Valor do IVA
        doc.text(`IVA (23%): €${valorIVA.toFixed(2)}`, marginLeft, finalY + 54);

        // Total destacado
        doc.setFillColor(30, 58, 138);
        doc.setTextColor("#fff");
        doc.roundedRect(marginLeft, finalY + 70, 495, 32, 8, 8, "F");
        doc.setFontSize(16);
        doc.text("Total:", marginLeft + 20, finalY + 90);
        doc.text(`€${total.toFixed(2)}`, marginRight - 20, finalY + 90, {
            align: "right",
        });

        // Footer
        doc.setFontSize(10);
        doc.setTextColor("#888");
        doc.text(
            "Atenção: Não é uma fatura válida para efeitos fiscais.",
            marginLeft,
            780,
        );
        doc.text(
            "Para solicitar fatura, contacte-nos: ogrego.rest@gmail.com",
            marginLeft,
            795,
        );

        // Abre o PDF numa nova janela
        window.open(doc.output("bloburl"), "_blank");
    };

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

                    <div className="flex justify-between text-sm">
                        <span>Valor sem IVA:</span>
                        <span>
                            €{(orderData.total_cents / 100 / 1.23).toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>IVA (23%):</span>
                        <span>
                            €
                            {(
                                orderData.total_cents / 100 -
                                orderData.total_cents / 100 / 1.23
                            ).toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between border-t pt-2 text-lg font-bold">
                        <span>Total:</span>
                        <span>€{(orderData.total_cents / 100).toFixed(2)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 border-t pt-6 text-center text-xs text-gray-500">
                    <p>Este documento não é válido como fatura.</p>
                    <p className="mt-2">
                        Para solicitar fatura, contacte-nos:
                        ogrego.rest@gmail.com
                    </p>
                </div>

                {/* Botões */}
                <div className="mt-8 flex gap-4 print:hidden">
                    <button
                        onClick={handlePDF}
                        className="flex-1 rounded-full bg-[#1E3A8A] px-6 py-3 text-white hover:bg-[#162F73] transition-all"
                    >
                        📄 Gerar PDF
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
