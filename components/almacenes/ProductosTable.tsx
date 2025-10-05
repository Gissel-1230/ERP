// components/almacenes/ProductosTable.tsx
import type { Producto } from '@/lib/data';
import { Pencil, Trash2 } from 'lucide-react';

interface ProductosTableProps {
  inventario: Producto[];
  onEdit: (producto: Producto) => void;
  onDelete: (productoId: string) => void;
}

export default function ProductosTable({ inventario, onEdit, onDelete }: ProductosTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-700 dark:bg-slate-700 dark:text-slate-400">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Nombre</th>
            <th className="px-6 py-3">Cantidad</th>
            <th className="px-6 py-3">Precio Unit.</th>
            <th className="px-6 py-3">Peso</th>
            <th className="px-6 py-3">Observaciones</th>
            <th className="px-6 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventario.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-slate-500">No hay productos en este inventario.</td>
            </tr>
          ) : (
            inventario.map((producto) => (
              <tr key={producto.id} className="border-b dark:border-slate-700">
                <td className="px-6 py-4 font-mono text-xs">{producto.id}</td>
                <td className="px-6 py-4 font-medium">{producto.nombre}</td>
                <td className="px-6 py-4">{producto.cantidad}</td>
                <td className="px-6 py-4">${producto.precioUnitario.toFixed(2)}</td>
                <td className="px-6 py-4">{producto.peso} {producto.unidadPeso}</td>
                <td className="px-6 py-4 max-w-xs truncate" title={producto.observaciones}>{producto.observaciones}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-4">
                    <button onClick={() => onEdit(producto)} className="text-blue-500 hover:text-blue-700"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => onDelete(producto.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}