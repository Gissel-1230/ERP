// app/dashboard/ventas/page.tsx

"use client";

import { useState } from "react";
import SalesDashboardView from "@/components/ventas/SalesDashboardView";
import OrdenesDeCompraView from "@/components/ventas/OrdenesDeCompraView";
// highlight-next-line
import EstadoVentasView from "@/components/ventas/EstadoVentasView"; // Importamos el nuevo componente

export default function VentasPage() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "ordenes" | "estado"
  >("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard de Ventas" },
    { id: "ordenes", label: "Órdenes de Compra" },
    // highlight-next-line
    { id: "estado", label: "Estado de Ventas" }, // Nueva pestaña
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* -- Encabezado Principal del Módulo -- */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Módulo de Ventas
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Visualiza métricas y gestiona las órdenes de compra.
        </p>
      </div>

      {/* -- Navegación de Pestañas -- */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              } whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* -- Contenido de la Pestaña Activa -- */}
      <div className="mt-4">
        {activeTab === "dashboard" && <SalesDashboardView />}
        {activeTab === "ordenes" && <OrdenesDeCompraView />}
        {/* highlight-next-line */}
        {activeTab === "estado" && <EstadoVentasView />}
      </div>
    </div>
  );
}
