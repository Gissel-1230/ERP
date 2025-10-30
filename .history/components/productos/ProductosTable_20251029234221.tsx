// components/productos/ProductosTable.tsx
"use client";

import { Edit, Trash2, Loader2 } from 'lucide-react';
import type { GlobalProduct } from '@/lib/data'; // Importa el tipo de producto global
import { showAlert } from '../common/sweetAlert';
// --- 1. INTERFAZ DE PROPS ---
interface ProductosTableProps {
  products: GlobalProduct[]; // La lista de productos globales
  onEdit: (product: GlobalProduct) => void; // Función para editar
  onDelete: (id: string | number) => void; // Función para eliminar
  isDeletingId: string | number | null; // ID del producto que se está eliminando
}

export default function ProductosTable({ products, onEdit, onDelete, isDeletingId }: ProductosTableProps) {

  const result = await showAlert({
    title: '¿?',
    text: 'Esta acción no se puede deshacer.',
  });

  return (
    <div className="bg-white p-4 shadow rounded-lg dark:bg-slate-800 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Catálogo de Productos Globales</h2>

      {/* --- Contenido Condicional --- */}
      {products.length === 0 ? (
        <p className="text-center py-8 text-gray-500">Aún no hay productos en el catálogo.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Precio U.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Stock Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Mínimo</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:bg-slate-800">
            {products.map((product) => {
              const isDeleting = isDeletingId === product.product_id;

              return (
                <tr key={product.product_id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  
                  {/* Nombre */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{product.product_name}</td>
                  
                  {/* Categoría */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{product.categoria_nombre}</td>
                  
                  {/* Precio U. */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">${product.unit_price.toFixed(2)}</td>
                  
                  {/* Stock Total */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold"
                      style={{ color: product.current_stock_total <= product.minimum_stock ? '#dc2626' : '#16a34a' }} 
                  >
                    {product.current_stock_total} {product.unit_of_measure}
                  </td>

                  {/* Stock Mínimo */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                    {product.minimum_stock}
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* Botón Editar */}
                    <button 
                        onClick={() => onEdit(product)}
                        disabled={isDeleting}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                    >
                        <Edit className="h-4 w-4 inline-block" />
                    </button>
                    
                    {/* Botón Eliminar */}
                    <button 
                        onClick={() => onDelete(product.product_id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin inline-block" />
                        ) : (
                            <Trash2 className="h-4 w-4 inline-block" />
                        )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}