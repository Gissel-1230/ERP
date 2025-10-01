"use client";

import { useState } from 'react';
// highlight-start
// 1. Importamos desde el store dinámico, no desde los datos estáticos.
import { getOrdenes } from '@/lib/ventas-store';
import type { OrderStatus, OrdenDeCompra } from '@/lib/data';
// highlight-end
import KanbanColumn from './KanbanColumn';

const statuses: OrderStatus[] = [
  'Pendiente',
  'En proceso de preparar',
  'Aceptado',
  'En Camino',
  'Rechazado'
];

export default function EstadoVentasView() {
  // highlight-start
  // 2. Inicializamos el estado del componente consultando al store.
  // Esto se ejecuta cada vez que el componente se monta (al cambiar de pestaña).
  const [ordenes, setOrdenes] = useState<OrdenDeCompra[]>(() => getOrdenes());
  // highlight-end

  return (
    <div className="flex w-full space-x-4 overflow-x-auto rounded-lg bg-slate-100 p-4 dark:bg-slate-900">
      {statuses.map(status => {
        const ordersInColumn = ordenes.filter(order => order.status === status);
        return (
          <KanbanColumn
            key={status}
            title={status}
            orders={ordersInColumn}
          />
        );
      })}
    </div>
  );
}