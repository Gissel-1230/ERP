"use client";

import { Search } from 'lucide-react';
import { PolizaFilters } from '@/lib/contabilidad-data';

interface PolizasFiltersProps {
  filtros: PolizaFilters;
  onFiltrosChange: (filtros: PolizaFilters) => void;
}

export default function PolizasFiltersComponent({ filtros, onFiltrosChange }: PolizasFiltersProps) {
  const handleChange = (key: keyof PolizaFilters, value: string) => {
    onFiltrosChange({ ...filtros, [key]: value });
  };

  return (
    <div className="flex gap-3 flex-wrap p-5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <select 
        value={filtros.mes}
        title='f-mes'
        onChange={(e) => handleChange('mes', e.target.value)}
        className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option>Enero</option>
        <option>Febrero</option>
        <option>Marzo</option>
        <option>Abril</option>
        <option>Mayo</option>
        <option>Junio</option>
        <option>Julio</option>
        <option>Agosto</option>
        <option>Septiembre</option>
        <option>Octubre</option>
        <option>Noviembre</option>
        <option>Diciembre</option>
      </select>

      <select 
        value={filtros.anio}
        title='f-anio'
        onChange={(e) => handleChange('anio', e.target.value)}
        className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option>2025</option>
        <option>2024</option>
        <option>2023</option>
      </select>

      <select 
        value={filtros.tipo}
        title='f-tipo'
        onChange={(e) => handleChange('tipo', e.target.value)}
        className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option>Todos</option>
        <option>Diario</option>
        <option>Egresos</option>
        <option>Ingresos</option>
      </select>

      <div className="flex-1 relative min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar póliza..."
          value={filtros.busqueda}
          onChange={(e) => handleChange('busqueda', e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}
