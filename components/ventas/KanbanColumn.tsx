import type { OrdenDeCompra } from '@/lib/data';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  title: string;
  orders: OrdenDeCompra[];
}

const statusColors: { [key: string]: string } = {
  'Pendiente': 'bg-amber-500',
  'En proceso de preparar': 'bg-blue-500',
  'Aceptado': 'bg-green-500',
  'En Camino': 'bg-cyan-500',
  'Rechazado': 'bg-red-500',
};

export default function KanbanColumn({ title, orders }: KanbanColumnProps) {
  return (
    <div className="flex h-full min-w-[300px] flex-col rounded-md bg-white/60 dark:bg-slate-800/80">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${statusColors[title]}`}></span>
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
        </div>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">{orders.length}</span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {orders.map(order => (
          <KanbanCard key={order.codigo} order={order} />
        ))}
        {orders.length === 0 && (
          <p className="p-4 text-center text-sm text-slate-500">No hay órdenes en este estado.</p>
        )}
      </div>
    </div>
  );
}