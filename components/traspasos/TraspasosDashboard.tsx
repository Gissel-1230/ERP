"use client";
import { type Traspaso, type TraspasoStatus } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Corregimos los tipos para que coincidan con la API (lowercase)
const COLORS: { [key: string]: string } = {
  'pending': '#f59e0b',
  'approved': '#22c55e',
  'rejected': '#ef4444',
};

export default function TraspasosDashboard({ traspasos }: { traspasos: Traspaso[] }) {
  
  // Usamos 'status' (minúsculas) como lo define la interfaz
  const data = [
    { name: 'Pendiente', value: traspasos.filter(t => t.status === 'pending').length, color: COLORS.pending },
    { name: 'Aprobado', value: traspasos.filter(t => t.status === 'approved').length, color: COLORS.approved },
    { name: 'Rechazado', value: traspasos.filter(t => t.status === 'rejected').length, color: COLORS.rejected },
  ].filter(item => item.value > 0);

  return (
    // --- CLASES DARK MODE AÑADIDAS AQUÍ ---
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Resumen de Estados de Traspasos</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Cantidad de traspasos por estado.</p>
      
      <div className="h-60 w-full">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.3} stroke="#94a3b8"/>
            {/* --- Ejes de la gráfica con colores legibles --- */}
            <XAxis type="number" stroke="#94a3b8" fontSize={12} allowDecimals={false} />
            <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={80} tickLine={false} axisLine={false} />
            <Tooltip
                contentStyle={{ 
                  backgroundColor: '#fff', // Fondo blanco para el tooltip
                  border: '1px solid #e2e8f0', 
                  borderRadius: '0.5rem' 
                }}
                cursor={{ fill: 'rgba(200, 200, 200, 0.2)' }}
            />
            <Bar dataKey="value" fill="#8884d8" barSize={30}>
              {data.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}