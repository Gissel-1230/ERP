"use client";

import { Button } from '@/components/ui/button';

interface PolizasPaginationProps {
  totalRegistros: number;
  paginaActual: number;
  totalPaginas: number;
  onPageChange: (page: number) => void;
}

export default function PolizasPagination({ 
  totalRegistros, 
  paginaActual, 
  totalPaginas,
  onPageChange 
}: PolizasPaginationProps) {
  return (
    <div className="flex justify-between items-center p-5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <span className="text-sm text-slate-600 dark:text-slate-400">
        {totalRegistros} registros totales
      </span>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onPageChange(paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          ← Anterior
        </Button>
        
        {Array.from({ length: Math.min(totalPaginas, 3) }, (_, i) => i + 1).map(page => (
          <Button 
            key={page}
            variant="outline" 
            size="sm"
            onClick={() => onPageChange(page)}
            className={paginaActual === page ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""}
          >
            {page}
          </Button>
        ))}
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onPageChange(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
        >
          Siguiente →
        </Button>
      </div>
    </div>
  );
}
