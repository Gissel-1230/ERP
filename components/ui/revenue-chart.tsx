"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Ene', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Abr', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
];

const RevenueChart = () => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ingresos Recientes</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">Últimos 6 meses</p>
      <div className="mt-6 h-80 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
              }}
            />
            <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4, fill: '#4f46e5' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;