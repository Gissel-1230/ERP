// components/almacenes/ProductosTable.tsx
import type { Producto } from '@/lib/data';

export default function ProductosTable({ inventario }: { inventario: Producto[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-700 dark:bg-slate-700 dark:text-slate-400">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Nombre del Producto</th>
            <th className="px-6 py-3">Cantidad</th>
            <th className="px-6 py-3">Precio Unitario</th>
            <th className="px-6 py-3">Peso</th>
          </tr>
        </thead>
        <tbody>
          {inventario.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-slate-500">No hay productos en este inventario.</td>
            </tr>
          ) : (
            inventario.map((producto) => (
              <tr key={producto.id} className="border-b dark:border-slate-700">
                <td className="px-6 py-4 font-mono text-xs">{producto.id}</td>
                <td className="px-6 py-4 font-medium">{producto.nombre}</td>
                <td className="px-6 py-4">{producto.cantidad}</td>
                <td className="px-6 py-4">${producto.precioUnitario.toFixed(2)}</td>
                <td className="px-6 py-4">{producto.peso} {producto.unidadPeso}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}