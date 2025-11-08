"use client";

interface PolizasStatsProps {
  totalCargos: number;
  totalAbonos: number;
  totalPolizas: number;
}

export default function PolizasStats({ totalCargos, totalAbonos, totalPolizas }: PolizasStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <StatCard 
        icon="$"
        label="Total Cargos"
        value={`$${totalCargos.toLocaleString('es-MX', {minimumFractionDigits: 2})}`}
      />
      <StatCard 
        icon="$"
        label="Total Abonos"
        value={`$${totalAbonos.toLocaleString('es-MX', {minimumFractionDigits: 2})}`}
      />
      <StatCard 
        icon="$"
        label="Total Pólizas"
        value={totalPolizas.toString()}
      />
            <div className="flex gap-3 flex-wrap">
      <Button className="flex items-center gap-2" disabled={user?.role_id === 3}>
        <Plus className="h-4 w-4" />
        Nueva Póliza
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Generar Reporte
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Exportar Excel
      </Button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-4">
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
