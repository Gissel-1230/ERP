// components/ventas/SalesDashboardView.tsx

"use client";

import { DollarSign, Users, ShoppingCart, PackageMinus, FileText } from 'lucide-react';
import StatCard from '@/components/ui/stat-card';
import RevenueChart from '@/components/ui/revenue-chart';
import RecentSales from '@/components/ui/recent-sales';
// highlight-start
import OrderStatusSummary from './OrderStatusSummary'; // Importamos el nuevo componente
import { getOrdenes } from '@/lib/ventas-store';
import type { OrderStatus } from '@/lib/data';
// highlight-end

export default function SalesDashboardView() {
  // highlight-start
  // Obtenemos los datos del store para calcular los resúmenes
  const allOrders = getOrdenes();
  const statuses: OrderStatus[] = ['Pendiente', 'En proceso de preparar', 'Aceptado', 'En Camino', 'Rechazado'];

  const orderSummary = statuses.map(status => ({
    status: status,
    count: allOrders.filter(order => order.status === status).length
  }));
  // highlight-end

  return (
    <div className="flex flex-col gap-8">
      {/* SECCIÓN 1: KPIs Principales */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Ventas Totales (Mes)" value="$45,231.89" change="+20.1% vs mes anterior" icon={DollarSign} />
        <StatCard title="Nuevos Clientes" value="+2,350" change="+180.1% vs mes anterior" icon={Users} />
        <StatCard title="Órdenes Activas" value={allOrders.length.toString()} change={`${orderSummary.find(s => s.status === 'Pendiente')?.count || 0} pendientes`} icon={ShoppingCart} />
        <StatCard title="Valor de Remisiones (Mes)" value="$12,450.00" change="Generadas este mes" icon={FileText} />
      </section>

      {/* SECCIÓN 2: Resúmenes y Gráfico */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Columna de Resumen de Órdenes */}
        <div className="lg:col-span-1">
          <OrderStatusSummary summary={orderSummary} />
        </div>
        {/* Columna de Gráfico de Ingresos */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
      </section>

      {/* SECCIÓN 3: Ventas Recientes */}
      <section>
        <RecentSales />
      </section>
    </div>
  );
}