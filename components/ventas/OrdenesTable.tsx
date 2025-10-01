import type { OrdenDeCompra } from '@/lib/data';
import { FileEdit } from 'lucide-react';

interface OrdenesTableProps {
  ordenes: OrdenDeCompra[];
  onUpdateStatusClick: (orden: OrdenDeCompra) => void;
}

export default function OrdenesTable({ ordenes, onUpdateStatusClick }: OrdenesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-700 dark:bg-slate-700 dark:text-slate-400">
          <tr>
            <th scope="col" className="px-6 py-3">Código</th>
            <th scope="col" className="px-6 py-3">Producto</th>
            <th scope="col" className="px-6 py-3">Cliente</th>
            <th scope="col" className="px-6 py-3">Cantidad</th>
            <th scope="col" className="px-6 py-3">Estado</th>
            <th scope="col" className="px-6 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden) => (
            <tr key={orden.codigo} className="border-b hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50">
              <td className="px-6 py-4 font-mono text-xs">{orden.codigo}</td>
              <td className="px-6 py-4 font-medium">{orden.producto}</td>
              <td className="px-6 py-4">{orden.cliente}</td>
              <td className="px-6 py-4">{orden.cantidad} pzs</td>
              <td className="px-6 py-4">{orden.status}</td>
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  <button
                    onClick={() => onUpdateStatusClick(orden)}
                    className="text-slate-500 hover:text-indigo-600"
                    title="Actualizar estado"
                  >
                    <FileEdit className="h-4 w-4" />
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