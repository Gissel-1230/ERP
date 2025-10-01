import type { OrdenDeCompra } from '@/lib/data';

export default function KanbanCard({ order }: { order: OrdenDeCompra }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col">
        <p className="font-mono text-xs text-slate-500">{order.codigo}</p>
        <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">{order.producto}</p>
        <div className="mt-3 border-t pt-2 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-300">
          <p><span className="font-medium">Cliente:</span> {order.cliente}</p>
          <p><span className="font-medium">Cantidad:</span> {order.cantidad} pzs</p>
        </div>
      </div>
    </div>
  );
}