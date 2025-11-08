"use client";

import { DollarSign, Coins, FileText } from 'lucide-react';

interface PolizasStatsProps {
  totalCargos: number;
  totalAbonos: number;
  totalPolizas: number;
}

export default function PolizasStats({ totalCargos, totalAbonos, totalPolizas }: PolizasStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <StatCard 
        icon={<DollarSign className="h-8 w-8" />}
        label="Total Cargos"
        value={`$${totalCargos.toLocaleString('es-MX', {minimumFractionDigits: 2})}`}
        bgColor="bg-blue-100 dark:bg-blue-900/30"
        iconColor="text-blue-600 dark:text-blue-400"
      />
      <StatCard 
        icon={<Coins className="h-8 w-8" />}
        label="Total Abonos"
        value={`$${totalAbonos.toLocaleString('es-MX', {minimumFractionDigits: 2})}`}
        bgColor="bg-green-100 dark:bg-green-900/30"
        iconColor="text-green-600 dark:text-green-400"
      />
      <StatCard 
        icon={<FileText className="h-8 w-8" />}
        label="Total Pólizas"
        value={totalPolizas.toString()}
        bgColor="bg-purple-100 dark:bg-purple-900/30"
        iconColor="text-purple-600 dark:text-purple-400"
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
  iconColor: string;
}

function StatCard({ icon, label, value, bgColor, iconColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-4">
      <div className={`${bgColor} ${iconColor} p-3 rounded-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
