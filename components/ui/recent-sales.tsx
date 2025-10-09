"use client";

import { getOrdenes } from "@/lib/ventas-store";
import type { OrdenDeCompra } from "@/lib/data";

export default function RecentSales() {
  const allOrders = getOrdenes();
  const recentOrders = allOrders.slice(-5).reverse();
  
  // highlight-start
  const currencyFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });
  // highlight-end

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ventas Recientes</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Mostrando las últimas {recentOrders.length} órdenes generadas.
      </p>
      <div className="mt-6 space-y-6">
        {recentOrders.length > 0 ? (
          recentOrders.map((orden) => (
            <div key={orden.codigo} className="flex items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">{orden.producto}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium">Cliente:</span> {orden.cliente}
                </p>
                <p className="font-mono text-xs text-slate-400">
                  Remisión: {orden.folio}
                </p>
              </div>
              <div className="text-right">
                {/* highlight-start */}
                <p className="font-semibold text-slate-900 dark:text-white">
                  {currencyFormatter.format(orden.valorTotal)}
                </p>
                {/* highlight-end */}
                <p className="text-xs text-slate-500">{orden.fechaCreacion}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">No hay ventas recientes para mostrar.</p>
        )}
      </div>
    </div>
  );
}