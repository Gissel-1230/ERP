"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface MonthlyKardexModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (year: number, month: number) => Promise<void>;
}

export default function MonthlyKardexModal({ 
  isOpen, 
  onClose,
  onDownload 
}: MonthlyKardexModalProps) {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generar años (últimos 5 años + año actual + próximo año)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);

  // Meses del año
  const months = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  const handleDownload = async () => {
    setError(null);
    setIsDownloading(true);
    
    try {
      await onDownload(parseInt(selectedYear), parseInt(selectedMonth));
      // onClose(); // Puedes descomentar esto si quieres cerrar el modal automáticamente
    } catch (err: any) {
      setError(err.message || 'Error al descargar el reporte');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  const selectedMonthLabel = months.find(m => m.value === selectedMonth)?.label || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Descargar Kardex Mensual
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Reporte general de todos los traspasos
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Selector de Año */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Año
            </label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              disabled={isDownloading}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Selector de Mes */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Mes
            </label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              disabled={isDownloading}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* Vista previa del período seleccionado */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Período seleccionado:
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {selectedMonthLabel} {selectedYear}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isDownloading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Descargando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Descargar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}