import postgres from "postgres";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import ClearCart from "./ClearCart";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não está definida");
}

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
});

type Props = {
  params: Promise<{ id: string }>;
};

function getStatusLabel(status: string): string {
  switch (status) {
    case "awaiting_payment":
      return "Aguarda Pagamento";
    case "pending":
      return "Pendente";
    case "ready":
      return "Pronta";
    case "delivered":
      return "Entregue";
    case "cancelled":
      return "Cancelada";
    default:
      return status;
  }
}

export default async function OrderSuccessPage({ params }: Props) {
  const { id } = await params;
  const orderId = parseInt(id);

  // Buscar encomenda
  const orderResult = await sql`
        SELECT 
            id,
            customer_name,
            customer_email,
            order_type,
            delivery_address,
            total_cents,
            status,
            created_at
        FROM orders
        WHERE id = ${orderId}
    `;

  if (orderResult.length === 0) {
    notFound();
  }

  const order = orderResult[0];

  // Se a order ainda está awaiting_payment, confirmar pagamento
  // (o Stripe só redireciona para success_url após pagamento bem-sucedido)
  if (order.status === "awaiting_payment") {
    await sql`
            UPDATE orders
            SET status = 'pending', updated_at = NOW()
            WHERE id = ${orderId} AND status = 'awaiting_payment'
        `;
    order.status = "pending";
  }

  const total = order.total_cents / 100;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <ClearCart />
      <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/80 p-12 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircleIcon className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="mb-2 text-3xl font-semibold text-[#1E3A8A]">
          Encomenda Confirmada!
        </h1>

        <p className="mb-8 text-gray-600">
          Obrigado pela sua encomenda, {order.customer_name}!
        </p>

        <div className="mb-8 rounded-2xl bg-[#1E3A8A]/5 p-6">
          <p className="mb-2 text-sm text-gray-600">Número da encomenda</p>
          <p className="text-3xl font-bold text-[#1E3A8A]">#{orderId}</p>
        </div>

        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <TruckIcon className="h-6 w-6 text-[#1E3A8A]" />
            <div>
              <p className="text-sm font-medium">Tipo de encomenda</p>
              <p className="text-sm text-gray-600">
                {order.order_type === "delivery"
                  ? "Entrega ao domicílio"
                  : "Levantar no restaurante"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <ClockIcon className="h-6 w-6 text-[#1E3A8A]" />
            <div>
              <p className="text-sm font-medium">Tempo estimado</p>
              <p className="text-sm text-gray-600">30-45 minutos</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <CheckCircleIcon className="h-6 w-6 text-[#1E3A8A]" />
            <div>
              <p className="text-sm font-medium">Total pago</p>
              <p className="text-lg font-bold text-[#1E3A8A]">
                €{total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-600">
          Enviámos um email de confirmação para{" "}
          <strong>{order.customer_email}</strong>
        </p>

        <div className="mt-8 flex gap-3">
          <Link
            href="/menu"
            className="flex h-12 flex-1 items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-white text-sm font-medium text-[#1E3A8A] transition-all hover:border-[#1E3A8A]/40"
          >
            Ver Menu
          </Link>
          <Link
            href="/user/encomendas"
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-[#1E3A8A] text-sm font-medium text-white transition-all hover:bg-[#162F73]"
          >
            Minhas Encomendas
          </Link>
        </div>
      </div>
    </main>
  );
}
