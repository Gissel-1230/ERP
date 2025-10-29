// components/traspasos/TraspasosDashboard.tsx
"use client";
import { type Traspaso } from "@/lib/data";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = {
  pendiente: '#f59e0b',
  aceptado: '#22c55e',
  rechazado: '#ef4444',
};

export default function TraspasosDashboard({ traspasos }: { traspasos: Traspaso[] }) {
  const data = [
    { name: 'Pendientes', value: traspasos.filter(t => t.estatus === 'pendiente').length },
    { name: 'Aceptados', value: traspasos.filter(t => t.estatus === 'aceptado').length },
    { name: 'Rechazados', value: traspasos.filter(t => t.estatus === 'rechazado').length },
  ];

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800">
      <h3 className="text-lg font-semibold">Resumen de Estados</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label>
              {data.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}