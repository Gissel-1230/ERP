// app/dashboard/ventas/page.tsx

import { DollarSign, Users, ShoppingCart, PackageMinus } from 'lucide-react';
import StatCard from '@/components/ui/stat-card';
import RevenueChart from '@/components/ui/revenue-chart';
import RecentSales from '@/components/ui/recent-sales';

export default function VentasPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* -- Encabezado de la Página -- */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Módulo de Ventas
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Un resumen general de la actividad comercial y el rendimiento.
        </p>
      </div>

      {/* -- Sección de KPIs (Métricas Clave) -- */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Ventas Totales (Mes)"
          value="$45,231.89"
          change="+20.1% vs mes anterior"
          icon={DollarSign}
        />
        <StatCard
          title="Nuevos Clientes"
          value="+2,350"
          change="+180.1% vs mes anterior"
          icon={Users}
        />
        <StatCard
          title="Ventas Realizadas"
          value="+12,234"
          change="+19% vs mes anterior"
          icon={ShoppingCart}
        />
        <StatCard
          title="Productos con Bajo Stock"
          value="57"
          change="Revisar inventario"
          icon={PackageMinus}
          variant="danger"
        />
      </section>

      {/* -- Sección de Gráficos y Actividad Reciente -- */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <RecentSales />
        </div>
      </section>
    </div>
  );
}