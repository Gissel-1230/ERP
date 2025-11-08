"use client";

import { useState, useEffect } from 'react';
import { Plus, FileText, Download, Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/context/AuthContext';

// Tipos de datos
interface Poliza {
  id: number;
  fecha: string;
  tipo: string;
  numero: string;
  concepto: string;
  cargos: number;
  abonos: number;
}

export default function ContabilidadPage() {
  const { user } = useAuth();
  
  // ✅ CORRECCIÓN: Declarar explícitamente el tipo del estado
  const [polizas, setPolizas] = useState<Poliza[]>([]);
  
  const [filtros, setFiltros] = useState({
    mes: 'Enero',
    año: '2025',
    tipo: 'Todos',
    busqueda: ''
  });

  // Datos de ejemplo (luego conectarás con tu API)
  useEffect(() => {
    const datosEjemplo: Poliza[] = [
      {
        id: 568,
        fecha: '31/01/2025',
        tipo: 'Diario',
        numero: '568',
        concepto: 'IMPUESTO SOBRE NÓMINA',
        cargos: 0,
        abonos: 0
      },
      {
        id: 567,
        fecha: '31/01/2025',
        tipo: 'Diario',
        numero: '567',
        concepto: 'PÓLIZA DE DEPRECIACIONES',
        cargos: 251892,
        abonos: 251892
      },
      {
        id: 600,
        fecha: '31/01/2025',
        tipo: 'Diario',
        numero: '600',
        concepto: 'COSTO DE VENTAS',
        cargos: 35571,
        abonos: 35571
      },
      {
        id: 382,
        fecha: '31/01/2025',
        tipo: 'Egresos',
        numero: '382',
        concepto: 'PAGO PRÉSTAMO 27-DIC-24',
        cargos: 167775,
        abonos: 167775
      }
    ];
    setPolizas(datosEjemplo);
  }, []);

  // Calcular totales
  const totalCargos = polizas.reduce((sum, p) => sum + p.cargos, 0);
  const totalAbonos = polizas.reduce((sum, p) => sum + p.abonos, 0);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Gestión de Pólizas Contables
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Administra y consulta las pólizas contables del periodo.
        </p>
      </div>

      {/* Botones de Acción */}
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

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap p-5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <select 
          value={filtros.mes}
          title='filtro-mes'
          onChange={(e) => setFiltros({...filtros, mes: e.target.value})}
          className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
        >
          <option>Enero</option>
          <option>Febrero</option>
          <option>Marzo</option>
        </select>

        <select 
          value={filtros.año}
          title='filtro-anio'
          onChange={(e) => setFiltros({...filtros, año: e.target.value})}
          className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
        >
          <option>2025</option>
          <option>2024</option>
        </select>

        <select 
          value={filtros.tipo}
          title='filtro-target'
          onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
          className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
        >
          <option>Todos</option>
          <option>Diario</option>
          <option>Egresos</option>
          <option>Ingresos</option>
        </select>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar póliza..."
            value={filtros.busqueda}
            onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
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
          <div>
            <FileText className="h-6 w-6 text-indigo-500" />
          </div>
          label="Total Pólizas"
          value={polizas.length.toString()}
        />
      </div>

      {/* Tabla de Pólizas */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  # Póliza
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Concepto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Cargos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Abonos
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {polizas.map((poliza, index) => (
                <tr 
                  key={poliza.id}
                  className={`${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900'} hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    {poliza.fecha}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      poliza.tipo === 'Diario' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {poliza.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    {poliza.numero}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                    {poliza.concepto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    ${poliza.cargos.toLocaleString('es-MX')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    ${poliza.abonos.toLocaleString('es-MX')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" title='btn'>
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center p-5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {polizas.length} registros totales
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">← Anterior</Button>
          <Button variant="outline" size="sm" className="bg-indigo-600 text-white">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">Siguiente →</Button>
        </div>
      </div>
    </div>
  );
}

// Componente reutilizable para tarjetas de estadísticas
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
