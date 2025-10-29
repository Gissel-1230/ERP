// components/traspasos/TraspasosTable.tsx
import { type Traspaso, type TraspasoStatus } from '@/lib/data';
import { Check, X, FileClock, Download } from 'lucide-react';
import { getAlmacenById } from '@/lib/almacen-store';

const EstatusIcon = ({ estatus }: { estatus: TraspasoStatus }) => {
  if (estatus === 'aceptado') return <Check className="h-4 w-4 text-green-500" />;
  if (estatus === 'rechazado') return <X className="h-4 w-4 text-red-500" />;
  return <FileClock className="h-4 w-4 text-amber-500" />;
};

export default function TraspasosTable({ traspasos, onUpdateStatus }: { traspasos: Traspaso[], onUpdateStatus: (id: string, status: TraspasoStatus) => void }) {
  
  const getNombreAlmacen = (id: string) => getAlmacenById(id)?.nombre || 'N/A';
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 uppercase dark:bg-slate-700">
          <tr>
            <th className="px-6 py-3">Folio</th>
            <th className="px-6 py-3">Producto</th>
            <th className="px-6 py-3">Cant.</th>
            <th className="px-6 py-3">Alm. Salida</th>
            <th className="px-6 py-3">Alm. Entrada</th>
            <th className="px-6 py-3">Fecha</th>
            <th className="px-6 py-3">Estatus</th>
            <th className="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {traspasos.map((tr) => (
            <tr key={tr.id} className="border-b dark:border-slate-700">
              <td className="px-6 py-4 font-mono text-xs">{tr.folio}</td>
              <td className="px-6 py-4 font-medium">{tr.producto_nombre}</td>
              <td className="px-6 py-4">{tr.cantidad}</td>
              <td className="px-6 py-4 text-xs">{getNombreAlmacen(tr.almacen_salida_id)}</td>
              <td className="px-6 py-4 text-xs">{getNombreAlmacen(tr.almacen_entrada_id)}</td>
              <td className="px-6 py-4 text-xs">{tr.fecha}</td>
              <td className="px-6 py-4"><EstatusIcon estatus={tr.estatus} /></td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  {tr.estatus === 'pendiente' && (
                    <>
                      <button onClick={() => onUpdateStatus(tr.id, 'aceptado')} className="text-green-500" title="Aceptar"><Check className="h-4 w-4" /></button>
                      <button onClick={() => onUpdateStatus(tr.id, 'rechazado')} className="text-red-500" title="Rechazar"><X className="h-4 w-4" /></button>
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