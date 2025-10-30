// components/almacenes/ProductosTable.tsx (Completo)
"use client";
import { Edit, Trash2 } from 'lucide-react';
import type { Producto } from '@/lib/data'; // Importa el tipo Producto

interface ProductosTableProps {
  inventario: Producto[];
  onEdit: (producto: Producto) => void;
  onDelete: (producto: Producto) => void;
}

export default function ProductosTable({ inventario, onEdit, onDelete }: ProductosTableProps) {

  if (inventario.length === 0) {
    return (
        <div className="text-center py-8 text-gray-500">
            <p>No hay productos con stock en esta categoría.</p>
            <p className="text-sm">Usa el botón "Registrar Entrada de Stock" para añadir el primero.</p>
        </div>
    );
  }

  return (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead>
                <tr className="bg-gray-50 dark:bg-slate-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Stock Actual</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Precio Unitario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:bg-slate-800">
                {inventario.map((producto) => (
                    <tr key={producto.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {producto.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                            {/* Esto ahora mostrará "Unidad", "Caja", etc. */}
                            {producto.cantidad} {producto.unidadPeso} 
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                            ${producto.precioUnitario.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                            {producto.description || 'N/A'}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                                onClick={() => onEdit(producto)} 
                                className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600"
                            >
                                <Edit className="h-4 w-4" />
                            </button>
                            <button 
                                onClick={() => onDelete(producto)} 
                                className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 dark:hover:bg-slate-600"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}