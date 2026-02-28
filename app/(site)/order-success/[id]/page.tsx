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
      <div className="site-card p-8 text-center sm:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircleIcon className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="mb-2 text-3xl font-semibold text-[#1E3A8A]">
          Encomenda Confirmada!
        </h1>

        <p className="mb-8 text-gray-600 dark:text-slate-300">
          Obrigado pela sua encomenda, {order.customer_name}!
        </p>

        <div className="mb-8 rounded-2xl bg-[#1E3A8A]/5 p-6 dark:bg-slate-900/80">
          <p className="mb-2 text-sm text-gray-600 dark:text-slate-300">Número da encomenda</p>
          <p className="text-3xl font-bold text-[#1E3A8A]">#{orderId}</p>
        </div>

        <div className="space-y-4 text-left">
          <div className="site-card-soft flex items-center gap-3 rounded-lg p-4">
            <TruckIcon className="h-6 w-6 text-[#1E3A8A]" />
            <div>
              <p className="text-sm font-medium">Tipo de encomenda</p>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                {order.order_type === "delivery"
                  ? "Entrega ao domicílio"
                  : "Levantar no restaurante"}
              </p>
            </div>
          </div>

          <div className="site-card-soft flex items-center gap-3 rounded-lg p-4">
            <ClockIcon className="h-6 w-6 text-[#1E3A8A]" />
            <div>
              <p className="text-sm font-medium">Tempo estimado</p>
              <p className="text-sm text-gray-600 dark:text-slate-300">30-45 minutos</p>
            </div>
          </div>

          <div className="site-card-soft flex items-center gap-3 rounded-lg p-4">
            <CheckCircleIcon className="h-6 w-6 text-[#1E3A8A]" />
            <div>
              <p className="text-sm font-medium">Total pago</p>
              <p className="text-lg font-bold text-[#1E3A8A]">
                €{total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-600 dark:text-slate-300">
          Enviámos um email de confirmação para{" "}
          <strong>{order.customer_email}</strong>
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/menu"
            className="site-button-secondary flex h-12 flex-1"
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
