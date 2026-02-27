"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  SquaresPlusIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  ShoppingBagIcon,
  UserPlusIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import {
  getVendasTotal,
  getTotalUtilizadores,
  getPedidosPendentes,
  getVendasPorPeriodo,
  getTopCategorias,
  getPedidosRecentes,
  atualizarEstadoPedido,
  getAtividadeRecente,
} from "@/app/lib/admin-actions";
import type {
  VendaPonto,
  CategoriaTop,
  PedidoRecente,
  Atividade,
} from "@/app/lib/admin-actions";

// ─── Helpers ────────────────────────────────────────────────────

function formatCents(cents: number): string {
  return `€${(cents / 100).toFixed(2).replace(".", ",")}`;
}

function tempoRelativo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora mesmo";
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
    case "preparing":
      return "bg-yellow-100 text-yellow-800";
    case "ready":
      return "bg-blue-100 text-blue-800";
    case "delivered":
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

const PERIOD_LABELS: Record<string, string> = {
  hoje: "Hoje",
  semana: "Esta semana",
  "15dias": "Últimos 15 dias",
  mes: "Último mês",
  "6meses": "Últimos 6 meses",
  "12meses": "Últimos 12 meses",
};

const ATIVIDADE_ICONS: Record<string, React.ElementType> = {
  novo_utilizador: UserPlusIcon,
  reserva: CalendarDaysIcon,
  novo_pedido: ClipboardDocumentListIcon,
  pedido_entregue: TruckIcon,
};

// ─── Interactive Line Chart (SVG) ───────────────────────────────

const CHART_HEIGHT = 200;
const CHART_PADDING = { top: 20, right: 20, bottom: 40, left: 60 };

function LineChart({ data }: { data: VendaPonto[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Responsive width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-400">
        Sem dados para este período
      </div>
    );
  }

  const w = containerWidth;
  const h = CHART_HEIGHT;
  const plotW = w - CHART_PADDING.left - CHART_PADDING.right;
  const plotH = h - CHART_PADDING.top - CHART_PADDING.bottom;

  if (plotW <= 0) {
    return <div ref={containerRef} className="h-48 rounded-lg bg-slate-50" />;
  }

  const max = Math.max(...data.map((d) => d.total_cents), 1);
  const yMax = max * 1.1;

  const getX = (i: number) =>
    CHART_PADDING.left +
    (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);

  const getY = (val: number) =>
    CHART_PADDING.top + plotH - (val / yMax) * plotH;

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.total_cents)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L ${getX(data.length - 1)} ${CHART_PADDING.top + plotH}` +
    ` L ${getX(0)} ${CHART_PADDING.top + plotH} Z`;

  const yTicks = Array.from({ length: 5 }, (_, i) => (yMax / 4) * i);

  return (
    <div ref={containerRef} className="rounded-lg bg-slate-50 p-2">
      {w > 0 && (
        <svg
          width={w}
          height={h}
          className="overflow-visible"
          onMouseLeave={() => setActiveIndex(null)}
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={CHART_PADDING.left}
                x2={CHART_PADDING.left + plotW}
                y1={getY(tick)}
                y2={getY(tick)}
                stroke="#e2e8f0"
                strokeDasharray={i === 0 ? "0" : "4 4"}
                strokeWidth={1}
              />
              <text
                x={CHART_PADDING.left - 8}
                y={getY(tick) + 4}
                textAnchor="end"
                className="fill-slate-400"
                fontSize={10}
              >
                {formatCents(Math.round(tick))}
              </text>
            </g>
          ))}

          <path d={areaPath} fill="url(#areaGrad)" />

          <path
            d={linePath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.total_cents);
            const isActive = activeIndex === i;

            return (
              <g key={i}>
                <rect
                  x={cx - plotW / data.length / 2}
                  y={CHART_PADDING.top}
                  width={plotW / data.length}
                  height={plotH}
                  fill="transparent"
                  onMouseEnter={() => setActiveIndex(i)}
                />

                {isActive && (
                  <line
                    x1={cx}
                    x2={cx}
                    y1={CHART_PADDING.top}
                    y2={CHART_PADDING.top + plotH}
                    stroke="#3b82f6"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    opacity={0.4}
                  />
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r={isActive ? 6 : 4}
                  fill={isActive ? "#2563eb" : "#3b82f6"}
                  stroke="white"
                  strokeWidth={2}
                  className="transition-all duration-150"
                />

                {isActive && (
                  <g>
                    <rect
                      x={cx - 50}
                      y={cy - 38}
                      width={100}
                      height={26}
                      rx={6}
                      fill="#1e293b"
                    />
                    <polygon
                      points={`${cx - 5},${cy - 12} ${cx + 5},${cy - 12} ${cx},${cy - 6}`}
                      fill="#1e293b"
                    />
                    <text
                      x={cx}
                      y={cy - 21}
                      textAnchor="middle"
                      fill="white"
                      fontSize={12}
                      fontWeight={600}
                    >
                      {formatCents(d.total_cents)}
                    </text>
                  </g>
                )}

                <text
                  x={cx}
                  y={CHART_PADDING.top + plotH + 20}
                  textAnchor="middle"
                  className="fill-slate-400"
                  fontSize={10}
                  fontWeight={isActive ? 600 : 400}
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
  );
}

// ─── Dashboard Page ─────────────────────────────────────────────

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("semana");

  // loading gerais (dados fixos do dashboard)
  const [loading, setLoading] = useState(true);

  // loading por bloco (quando muda o período)
  const [loadingVendas, setLoadingVendas] = useState(false);
  const [loadingGrafico, setLoadingGrafico] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);

  const [vendasTotal, setVendasTotal] = useState(0);
  const [totalUtilizadores, setTotalUtilizadores] = useState(0);
  const [pedidosPendentes, setPedidosPendentes] = useState(0);

  const [vendasGrafico, setVendasGrafico] = useState<VendaPonto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaTop[]>([]);
  const [recentes, setRecentes] = useState<PedidoRecente[]>([]);
  const [atividade, setAtividade] = useState<Atividade[]>([]);

  // ── Load inicial (não depende do período) ─────────────────────

  useEffect(() => {
    async function load() {
      setLoading(true);

      const [users, pendentes, pedidos, atv] = await Promise.all([
        getTotalUtilizadores(),
        getPedidosPendentes(),
        getPedidosRecentes(),
        getAtividadeRecente(),
      ]);

      setTotalUtilizadores(users);
      setPedidosPendentes(pendentes);
      setRecentes(pedidos);
      setAtividade(atv);

      setLoading(false);
    }

    load();
  }, []);

  // ── Fetch por período: vendas + gráfico + categorias ──────────

  const fetchPeriodo = useCallback(async (periodo: string) => {
    setLoadingVendas(true);
    setLoadingGrafico(true);
    setLoadingCategorias(true);

    const [total, grafico, cats] = await Promise.all([
      getVendasTotal(periodo),
      getVendasPorPeriodo(periodo),
      getTopCategorias(periodo),
    ]);

    setVendasTotal(total);
    setVendasGrafico(grafico);
    setCategorias(cats);

    setLoadingVendas(false);
    setLoadingGrafico(false);
    setLoadingCategorias(false);
  }, []);

  useEffect(() => {
    fetchPeriodo(timeRange);
  }, [timeRange, fetchPeriodo]);

  // ── Atualizar estado do pedido ────────────────────────────────

  const handleEstadoChange = async (id: number, novoEstado: string) => {
    const sucesso = await atualizarEstadoPedido(id, novoEstado);
    if (sucesso) {
      setRecentes((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: novoEstado } : item,
        ),
      );
      const pendentes = await getPedidosPendentes();
      setPedidosPendentes(pendentes);
    }
  };

  // ── Render ────────────────────────────────────────────────────

  return (
    <main className="p-6 space-y-6">
      {/* Header + Filtro global */}
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl shadow">
            <SquaresPlusIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Visão geral do desempenho do restaurante
            </p>
          </div>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
        >
          <option value="hoje">Hoje</option>
          <option value="semana">Esta semana</option>
          <option value="15dias">Últimos 15 dias</option>
          <option value="mes">Último mês</option>
          <option value="6meses">Últimos 6 meses</option>
          <option value="12meses">Últimos 12 meses</option>
        </select>
      </header>

      {/* ── Stats Cards ─────────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase">
                Vendas · {PERIOD_LABELS[timeRange]}
              </p>
              {loading || loadingVendas ? (
                <Skeleton className="h-8 w-28 bg-blue-400/40 mt-1" />
              ) : (
                <p className="text-2xl font-bold">{formatCents(vendasTotal)}</p>
              )}
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase">Utilizadores</p>
              {loading ? (
                <Skeleton className="h-8 w-16 bg-purple-400/40 mt-1" />
              ) : (
                <p className="text-2xl font-bold">{totalUtilizadores}</p>
              )}
            </div>
            <UsersIcon className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase">Pedidos Pendentes</p>
              {loading ? (
                <Skeleton className="h-8 w-12 bg-orange-400/40 mt-1" />
              ) : (
                <p className="text-2xl font-bold">{pedidosPendentes}</p>
              )}
            </div>
            <ShoppingBagIcon className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </section>

      {/* ── Gráfico + Top Categorias ────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow border p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Vendas · {PERIOD_LABELS[timeRange]}
            </h2>
          </div>
          {loadingGrafico ? (
            <Skeleton className="h-48" />
          ) : (
            <LineChart data={vendasGrafico} />
          )}
        </div>

        <div className="bg-white rounded-2xl shadow border p-6">
          <h2 className="text-lg font-semibold mb-4">
            Top Categorias · {PERIOD_LABELS[timeRange]}
          </h2>

          {loading || loadingCategorias ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          ) : categorias.length === 0 ? (
            <p className="text-sm text-slate-400">Sem dados de categorias</p>
          ) : (
            <ul className="space-y-3">
              {categorias.map((cat) => (
                <li
                  key={cat.categoria}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{cat.categoria}</span>
                  <span className="font-semibold">{cat.percentagem}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── Pedidos Recentes + Atividade ────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow border overflow-x-auto">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Pedidos Recentes</h2>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Pedido</th>
                  <th className="px-6 py-3 text-left">Cliente</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-left">Hora</th>
                </tr>
              </thead>
              <tbody>
                {recentes.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">#{item.id}</td>
                    <td className="px-6 py-3">{item.customer_name}</td>
                    <td className="px-6 py-3 font-semibold">
                      {formatCents(item.total_cents)}
                    </td>
                    <td className="px-6 py-3">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleEstadoChange(item.id, e.target.value)
                        }
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}
                      >
                        <option value="pending">Pendente</option>
                        <option value="preparing">Em preparação</option>
                        <option value="ready">Pronto</option>
                        <option value="delivered">Entregue</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {new Date(item.created_at).toLocaleTimeString("pt-PT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow border p-6">
          <h2 className="text-lg font-semibold mb-4">Atividade Recente</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : atividade.length === 0 ? (
            <p className="text-sm text-slate-400">Sem atividade recente</p>
          ) : (
            <ul className="space-y-3">
              {atividade.map((atv, i) => {
                const Icon =
                  ATIVIDADE_ICONS[atv.tipo] ?? ClipboardDocumentListIcon;
                return (
                  <li
                    key={i}
                    className={`flex justify-between text-sm ${i < atividade.length - 1 ? "pb-3 border-b" : ""}`}
                  >
                    <div className="flex gap-3 items-start min-w-0">
                      <Icon className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium">{atv.titulo}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {atv.detalhe}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {tempoRelativo(atv.created_at)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
