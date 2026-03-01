"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

// Extensão do tipo jsPDF para incluir lastAutoTable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

export type ReceiptStatus = "pago" | "pendente" | "cancelado";

export type Receipt = {
  id: string;
  date: string;
  amount: number;
  status: ReceiptStatus;
  restaurant: string;
  invoiceNumber: string;
};

const getStatusColor = (status: ReceiptStatus) => {
  switch (status) {
    case "pago":
      return "bg-emerald-100 text-emerald-800";
    case "pendente":
      return "bg-amber-100 text-amber-800";
    case "cancelado":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: ReceiptStatus) => {
  switch (status) {
    case "pago":
      return "Pago";
    case "pendente":
      return "Pendente";
    case "cancelado":
      return "Cancelado";
    default:
      return "Desconhecido";
  }
};

export default function InvoicesClient({ receipts }: { receipts: Receipt[] }) {
  const [activeTab, setActiveTab] = useState<"todos" | "pagos" | "pendentes">(
    "todos",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const filteredReceipts = receipts
    .filter((receipt) => {
      if (activeTab === "todos") return true;
      if (activeTab === "pagos") return receipt.status === "pago";
      if (activeTab === "pendentes") return receipt.status === "pendente";
      return true;
    })
    .filter((receipt) =>
      searchQuery === ""
        ? true
        : receipt.restaurant
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          receipt.invoiceNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          receipt.date.includes(searchQuery) ||
          receipt.amount.toString().includes(searchQuery),
    );

  const totalPaid = receipts
    .filter((r) => r.status === "pago")
    .reduce((sum, r) => sum + r.amount, 0);
  const totalPending = receipts
    .filter((r) => r.status === "pendente")
    .reduce((sum, r) => sum + r.amount, 0);

  const exportToPDF = (receipt: Receipt) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Documento Fiscal", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(receipt.invoiceNumber, 105, 28, { align: "center" });

    // Linha separadora
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Informações do Fornecedor
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Fornecedor", 20, 45);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(receipt.restaurant, 20, 52);
    doc.text("NIF: 123 456 789", 20, 58);
    doc.text("Morada: Rua Exemplo, 123, Lisboa", 20, 64);

    // Detalhes do Documento
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Detalhes", 20, 78);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Número: ${receipt.invoiceNumber}`, 20, 85);
    doc.text(`Data: ${receipt.date}`, 20, 91);
    doc.text(`Estado: ${getStatusText(receipt.status)}`, 20, 97);

    // Tabela de Itens (mesma lógica do mock: base=85%, iva=15%)
    const subtotal = receipt.amount * 0.85;
    const iva = receipt.amount * 0.15;

    autoTable(doc, {
      startY: 110,
      head: [["Descrição", "Valor"]],
      body: [
        ["Serviço de Alimentação", `€${subtotal.toFixed(2)}`],
        ["IVA (23%)", `€${iva.toFixed(2)}`],
      ],
      theme: "striped",
      headStyles: {
        fillColor: [59, 130, 246],
        fontSize: 12,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 11,
      },
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFillColor(16, 185, 129);
    doc.rect(20, finalY, 170, 15, "F");

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Total a Pagar:", 25, finalY + 10);
    doc.text(`€${receipt.amount.toFixed(2)}`, 185, finalY + 10, {
      align: "right",
    });

    // Footer
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Documento gerado automaticamente", 105, 280, {
      align: "center",
    });

    doc.save(`${receipt.invoiceNumber}.pdf`);
  };

  return (
    <main className="admin-page">
      {/* Header */}
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow">
          <DocumentTextIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Recibos</h1>
          <p className="text-sm text-gray-600">Gestão de documentos</p>
        </div>
      </header>

      {/* Estatísticas */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase">Total Pago</p>
              <p className="text-2xl font-bold">€{totalPaid.toFixed(2)}</p>
            </div>
            <svg
              className="h-8 w-8 opacity-80"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase">Pendente</p>
              <p className="text-2xl font-bold">€{totalPending.toFixed(2)}</p>
            </div>
            <svg
              className="h-8 w-8 opacity-80"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase">Total Documentos</p>
              <p className="text-2xl font-bold">{receipts.length}</p>
            </div>
            <svg
              className="h-8 w-8 opacity-80"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Tabs */}
      <section className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap">
        <button
          onClick={() => setActiveTab("todos")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "todos"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Todos ({receipts.length})
        </button>
        <button
          onClick={() => setActiveTab("pagos")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "pagos"
              ? "bg-emerald-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Pagos ({receipts.filter((r) => r.status === "pago").length})
        </button>
        <button
          onClick={() => setActiveTab("pendentes")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "pendentes"
              ? "bg-amber-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Pendentes ({receipts.filter((r) => r.status === "pendente").length})
        </button>
      </section>

      {/* Lista de Recibos */}
      <section className="space-y-4">
        {filteredReceipts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sem resultados
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? `Nenhum documento encontrado para "${searchQuery}".`
                : "Não há documentos nesta categoria."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReceipts.map((receipt) => (
              <div
                key={receipt.id}
                onClick={() => setSelectedReceipt(receipt)}
                className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow">
                        <svg
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600">
                          {receipt.invoiceNumber}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {receipt.restaurant}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{receipt.date}</p>
                  </div>
                  <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <span className="text-xl font-bold text-gray-900">
                      €{receipt.amount.toFixed(2)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(receipt.status)}`}
                    >
                      {getStatusText(receipt.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal do Documento */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="sticky top-0 flex flex-col gap-4 bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <DocumentTextIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Documento Fiscal</h2>
                  <p className="text-blue-100 text-xs">
                    {selectedReceipt.invoiceNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Conteúdo do Documento */}
            <div className="p-6 space-y-4">
              {/* Informações do Fornecedor */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Fornecedor</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-bold text-gray-900">
                    {selectedReceipt.restaurant}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">NIF: 123 456 789</p>
                  <p className="text-xs text-gray-500">
                    Morada: Rua Exemplo, 123, Lisboa
                  </p>
                </div>
              </div>

              {/* Detalhes do Documento */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Detalhes</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium">Número</p>
                    <p className="font-bold text-blue-900 text-sm">
                      {selectedReceipt.invoiceNumber}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium">Data</p>
                    <p className="font-bold text-blue-900 text-sm">
                      {selectedReceipt.date}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium">Estado</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedReceipt.status)}`}
                    >
                      {getStatusText(selectedReceipt.status)}
                    </span>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium">
                      Valor Total
                    </p>
                    <p className="font-bold text-blue-900 text-sm">
                      €{selectedReceipt.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Itens */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Itens</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                    <span className="text-gray-700">
                      Serviço de Alimentação
                    </span>
                    <span className="font-bold text-gray-900">
                      €{(selectedReceipt.amount * 0.85).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                    <span className="text-gray-700">IVA (23%)</span>
                    <span className="font-bold text-gray-900">
                      €{(selectedReceipt.amount * 0.15).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Totais */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-emerald-900">
                    Total a Pagar
                  </span>
                  <span className="text-2xl font-bold text-emerald-900">
                    €{selectedReceipt.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer com Botões */}
            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t bg-gray-50 p-4 sm:flex-row">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all text-sm"
              >
                Fechar
              </button>
              <button
                onClick={() => exportToPDF(selectedReceipt)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exportar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
