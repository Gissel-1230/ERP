// components/traspasos/TraspasosTable.tsx
"use client";

import { type Traspaso, type TraspasoStatus } from '@/lib/data';
import { Check, X, FileClock, Download } from 'lucide-react';

/**
 * Componente de Icono para el Estatus
 */
const EstatusIcon = ({ estatus }: { estatus: TraspasoStatus }) => {
  if (estatus === 'aceptado') return <Check className="h-4 w-4 text-green-500" />;
  if (estatus === 'rechazado') return <X className="h-4 w-4 text-red-500" />;
  // 'pendiente'
  return <FileClock className="h-4 w-4 text-amber-500" />; 
};

/**
 * Interfaz de Props para la Tabla
 */
interface TraspasosTableProps {
  traspasos: Traspaso[];
  onUpdateStatus: (id: string, status: TraspasoStatus) => void;
  onDownloadKardex: (id: string | number, folio: string) => void; // <-- NUEVA PROP
  currentUserRole?: number; // Rol del usuario actual (para permisos)
}

export default function TraspasosTable({ 
    traspasos, 
    onUpdateStatus,
    onDownloadKardex, // <-- Aceptar la nueva prop
    currentUserRole 
}: TraspasosTableProps) {
  
  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 uppercase dark:bg-slate-700">
          <tr>
            <th className="px-6 py-3">Folio</th>
            <th className="px-6 py-3">Producto</th>
            <th className="px-6 py-3">Cant.</th>
            <th className="px-6 py-3">Alm. Salida</th>
            <th className="px-6 py-3">Alm. Entrada</th>
            <th className="px-6 py-3">Fecha Solicitud</th>
            <th className="px-6 py-3">Estatus</th>
            <th className="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
          {traspasos.length === 0 && (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                No se encontraron solicitudes de traspaso.
              </td>
            </tr>
          )}
          {traspasos.map((tr) => (
            <tr key={tr.id} className="border-b dark:border-slate-700">
              <td className="px-6 py-4 font-mono text-xs">{tr.folio}</td>
              <td className="px-6 py-4 font-medium">{tr.producto_nombre}</td>
              <td className="px-6 py-4">{tr.cantidad}</td>
              <td className="px-6 py-4 text-xs">{tr.almacen_salida_nombre}</td>
              <td className="px-6 py-4 text-xs">{tr.almacen_entrada_nombre}</td>
              <td className="px-6 py-4 text-xs">{tr.fecha}</td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1.5">
                  <EstatusIcon estatus={tr.estatus} />
                  <span className="capitalize">{tr.estatus}</span>
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  
                  {/* Lógica de Aprobación/Rechazo (Solo para Role 1 y Estatus Pending) */}
                  {String(tr.estatus).toLowerCase() === 'pending' && currentUserRole === 1 && (
                    <>
                      <button onClick={() => onUpdateStatus(String(tr.id), 'aceptado')} className="text-green-500" title="Aceptar"><Check className="h-4 w-4" /></button>
                      <button onClick={() => onUpdateStatus(String(tr.id), 'rechazado')} className="text-red-500" title="Rechazar"><X className="h-4 w-4" /></button>
                    </>
                  )}
                  
                  {/* --- BOTÓN VER KARDEX (AUDITORÍA) --- */}
                  <button 
                    onClick={() => onDownloadKardex(tr.id, tr.folio)} // <-- Usar la nueva prop
                    className="text-slate-500 hover:text-slate-700" 
                    title="Ver Kardex"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}