"use client";
import { type Traspaso, type TraspasoStatus } from "@/lib/data";
// highlight-start
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// highlight-end

// Mantenemos los colores definidos
const COLORS: { [key in TraspasoStatus]: string } = {
  pendiente: '#f59e0b', // amber-500
  aceptado: '#22c55e',  // green-500
  rechazado: '#ef4444', // red-500
};

export default function TraspasosDashboard({ traspasos }: { traspasos: Traspaso[] }) {
  const data = [
    { name: 'Pendiente', value: traspasos.filter(t => t.estatus === 'pendiente').length, color: COLORS.pendiente },
    { name: 'Aceptado', value: traspasos.filter(t => t.estatus === 'aceptado').length, color: COLORS.aceptado },
    { name: 'Rechazado', value: traspasos.filter(t => t.estatus === 'rechazado').length, color: COLORS.rechazado },
  ].filter(item => item.value > 0); // Opcional: filtrar estados sin traspasos

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Resumen de Estados de Traspasos</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Cantidad de traspasos por estado.</p>
      <div className="h-60 w-full"> {/* Ajusta la altura si es necesario */}
        <ResponsiveContainer>
          {/* highlight-start */}
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.3}/>
            <XAxis type="number" stroke="#94a3b8" fontSize={12} allowDecimals={false} />
            <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={80} tickLine={false} axisLine={false} />
            <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                cursor={{ fill: 'rgba(230, 230, 230, 0.3)' }}
            />
            <Bar dataKey="value" fill="#8884d8" barSize={30}>
              {data.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
          {/* highlight-end */}
        </ResponsiveContainer>
      </div>
    </div>
  );
}