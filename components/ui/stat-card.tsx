import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  variant?: 'default' | 'danger';
}

const StatCard = ({ title, value, icon: Icon, change, variant = 'default' }: StatCardProps) => {
  const changeColor = variant === 'danger' ? 'text-red-500' : 'text-emerald-500';

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className={`mt-1 text-xs ${changeColor}`}>{change}</p>
      </div>
    </div>
  );
};

export default StatCard;