"use client";

import { DollarSign, Users, ShoppingCart, CheckCircle } from 'lucide-react';
import StatCard from '@/components/ui/stat-card';
import RevenueChart from '@/components/ui/revenue-chart';
import RecentSales from '@/components/ui/recent-sales';
import OrderStatusSummary from './OrderStatusSummary';
import { getOrdenes } from '@/lib/ventas-store';
import type { OrderStatus } from '@/lib/data';

export default function SalesDashboardView() {
  const allOrders = getOrdenes();
  const statuses: OrderStatus[] = ['Pendiente', 'En proceso de preparar', 'Aceptado', 'En Camino', 'Rechazado'];

  const orderSummary = statuses.map(status => ({
    status: status,
    count: allOrders.filter(order => order.status === status).length
  }));

  const completedOrdersCount = (orderSummary.find(s => s.status === 'Aceptado')?.count || 0) + 
                               (orderSummary.find(s => s.status === 'En Camino')?.count || 0);

  // highlight-start
  // Lógica para calcular clientes activos únicos
  const activeClientsCount = new Set(allOrders.map(order => order.cliente)).size;
  // highlight-end

  return (
    <div className="flex flex-col gap-8">
      {/* SECCIÓN 1: KPIs Principales */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          title="Ventas Totales (Mes)" 
          value="$45,231.89" 
          change="+20.1% vs mes anterior" 
          icon={DollarSign} 
        />
        {/* highlight-start */}
        <StatCard 
          title="Clientes Activos del Mes" 
          value={activeClientsCount.toString()} 
          change="Clientes con órdenes activas" 
          icon={Users} 
        />
        {/* highlight-end */}
        <StatCard 
          title="Órdenes Activas" 
          value={allOrders.length.toString()} 
          change={`${orderSummary.find(s => s.status === 'Pendiente')?.count || 0} pendientes`} 
          icon={ShoppingCart} 
        />
        <StatCard 
          title="Órdenes Completadas" 
          value={completedOrdersCount.toString()} 
          change="Este mes" 
          icon={CheckCircle} 
        />
      </section>

      {/* SECCIÓN 2: Resúmenes y Gráfico */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <OrderStatusSummary summary={orderSummary} />
        </div>
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