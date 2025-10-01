// components/ventas/OrderStatusSummary.tsx
import type { OrderStatus } from '@/lib/data';

interface OrderSummary {
  status: OrderStatus;
  count: number;
}

const statusColors: { [key in OrderStatus]: string } = {
  'Pendiente': 'border-amber-500',
  'En proceso de preparar': 'border-blue-500',
  'Aceptado': 'border-green-500',
  'En Camino': 'border-cyan-500',
  'Rechazado': 'border-red-500',
};

const statusTextColors: { [key in OrderStatus]: string } = {
    'Pendiente': 'text-amber-500',
    'En proceso de preparar': 'text-blue-500',
    'Aceptado': 'text-green-500',
    'En Camino': 'text-cyan-500',
    'Rechazado': 'text-red-500',
};

export default function OrderStatusSummary({ summary }: { summary: OrderSummary[] }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800 h-full">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Resumen de Órdenes de Compra</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">Estado actual de las órdenes activas.</p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {summary.map(({ status, count }) => (
          <div key={status} className={`flex flex-col rounded-lg border-l-4 p-3 bg-slate-50 dark:bg-slate-700/50 ${statusColors[status]}`}>
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{count}</span>
            <span className={`text-sm font-medium ${statusTextColors[status]}`}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}