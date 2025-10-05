"use client";

import { getOrdenes } from "@/lib/ventas-store";
import type { OrdenDeCompra } from "@/lib/data";

export default function RecentSales() {
  // 1. Obtenemos TODAS las órdenes desde nuestro store central.
  const allOrders = getOrdenes();

  // 2. Seleccionamos solo las más recientes (por ejemplo, las últimas 5) y las invertimos para mostrar la más nueva primero.
  const recentOrders = allOrders.slice(-5).reverse();

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
              {/* Contenido Izquierdo: Producto y Folio */}
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">{orden.producto}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium">Cliente:</span> {orden.cliente}
                </p>
                <p className="font-mono text-xs text-slate-400">
                  Remisión: {orden.folio}
                </p>
              </div>
              {/* Contenido Derecho: Valor (Ejemplo) */}
              <div className="text-right">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {/* 3. Valor de ejemplo para la remisión. En un futuro, este dato vendría del objeto 'orden'. */}
                  ${(orden.cantidad * (Math.random() * 5 + 10)).toFixed(2)}
                </p>
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