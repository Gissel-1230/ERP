"use client";

import { useState, useEffect } from 'react';
import { Plus, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/context/AuthContext';
import { Poliza, PolizaFilters } from '@/lib/contabilidad-data';

// Importar componentes
import PolizasStats from '@/components/contabilidad/polizasStats';
import PolizasFiltersComponent from '@/components/contabilidad/polizasFilters';
import PolizasTable from '@/components/contabilidad/polizasTable';
import PolizasPagination from '@/components/contabilidad/polizasPagination';

export default function ContabilidadPage() {
  const { user } = useAuth();
  const [polizas, setPolizas] = useState<Poliza[]>([]);
  const [filtros, setFiltros] = useState<PolizaFilters>({
    mes: 'Enero',
    anio: '2025',
    tipo: 'Todos',
    busqueda: ''
  });
  const [paginaActual, setPaginaActual] = useState(1);

  // Datos de ejemplo
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

  const handleViewPoliza = (id: number) => {
    console.log('Ver póliza:', id);
  };

  const handleExportExcel = () => {
    console.log('Exportar a Excel');
  };

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
        <Button 
          className="flex items-center gap-2" 
          disabled={user?.role_id === 3}
        >
          <Plus className="h-4 w-4" />
          Nueva Póliza
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Generar Reporte
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleExportExcel}
        >
          <Download className="h-4 w-4" />
          Exportar Excel
        </Button>
      </div>

      {/* Filtros */}
      <PolizasFiltersComponent 
        filtros={filtros}
        onFiltrosChange={setFiltros}
      />

      {/* ✅ ESTADÍSTICAS - Props correctas */}<PolizasStats 
        totalCargos={totalCargos}
        totalAbonos={totalAbonos}
        totalPolizas={polizas.length}
      />

      {/* Tabla */}
      <PolizasTable 
        polizas={polizas}
        onViewPoliza={handleViewPoliza}
      />

      {/* ✅ PAGINACIÓN - Props correctas */}
      <PolizasPagination 
        totalRegistros={polizas.length}
        paginaActual={paginaActual}
        totalPaginas={3}
        onPageChange={setPaginaActual}
      />
    </div>
  );
}
