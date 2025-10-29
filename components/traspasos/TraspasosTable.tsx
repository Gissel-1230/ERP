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
  currentUserRole?: number; // Rol del usuario actual (para permisos)
}

export default function TraspasosTable({ 
    traspasos, 
    onUpdateStatus,
    currentUserRole 
}: TraspasosTableProps) {
  
  // Puedes dejar el console.log aquí si sigues debuggeando
  // console.log("Rol actual en TraspasosTable:", currentUserRole);
  
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
                  
                  {/* --- LÓGICA DE PERMISOS: BUSCA 'pending' (el valor real en minúsculas) --- */}
                  {String(tr.estatus).toLowerCase() === 'pending' && currentUserRole === 1 && (
                    <>
                      <button onClick={() => onUpdateStatus(String(tr.id), 'aceptado')} className="text-green-500" title="Aceptar"><Check className="h-4 w-4" /></button>
                      <button onClick={() => onUpdateStatus(String(tr.id), 'rechazado')} className="text-red-500" title="Rechazar"><X className="h-4 w-4" /></button>
                    </>
                  )}
                  <button className="text-slate-500" title="Descargar PDF"><Download className="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}