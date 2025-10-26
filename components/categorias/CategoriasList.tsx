// components/categorias/CategoriasList.tsx
"use client";
import { Edit, Trash2, Loader2 } from 'lucide-react'; // <-- Importamos Loader2 para el spinner
import { type CategoryItem } from '@/lib/data'; // Ajusta la ruta si es necesario

// --- 1. DEFINIMOS LA INTERFAZ DE PROPS ---
interface CategoriasListProps {
  categories: CategoryItem[];
  onEdit?: (category: CategoryItem) => void; // Función para editar (opcional)
  onDelete: (id: string | number) => void; // Función para eliminar (obligatoria)
  isDeletingId: number | null; // ID de la categoría que se está eliminando
}

// --- 2. EL COMPONENTE (RECIBE Y MAPEA LAS PROPS) ---
export default function CategoriasList({ categories, onEdit, onDelete, isDeletingId }: CategoriasListProps) {
    
    // Función helper para obtener el ID numérico del formato 'INV-X'
    const getNumericId = (id: string | number): number | null => {
        if (typeof id === 'string' && id.startsWith('INV-')) {
            const numericPart = id.split('-')[1];
            return parseInt(numericPart, 10);
        }
        return typeof id === 'number' ? id : null;
    };

    return (
        <div className="bg-white p-4 shadow rounded-lg dark:bg-slate-800">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Listado de Categorías Globales</h2>

            {categories.length === 0 ? (
                // Mensaje si la lista está vacía
                <p className="text-center py-8 text-gray-500">Aún no hay categorías registradas. Usa el botón "Nueva Categoría" para empezar.</p>
            ) : (
                // --- TABLA ---
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-700">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Descripción</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider"># Productos</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:bg-slate-800">
                            {categories.map((cat) => {
                                const numericId = getNumericId(cat.id);
                                const isDeleting = isDeletingId === numericId;

                                return (
                                    <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                        {/* Columna Nombre */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{cat.nombre}</td>
                                        {/* Columna Descripción */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{cat.descripcion}</td>
                                        {/* Columna # Productos */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{cat.product_count || 0}</td>
                                        
                                        {/* Columna Acciones */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {/* Botón Editar */}
                                            <button 
                                                onClick={() => onEdit && onEdit(cat)}
                                                disabled={isDeleting}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                                            >
                                                <Edit className="h-4 w-4 inline-block" />
                                            </button>
                                            
                                            {/* Botón Eliminar */}
                                            <button 
                                                onClick={() => onDelete(cat.id)}
                                                disabled={isDeleting}
                                                className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                                            >
                                                {/* Spinner o Ícono de Basura */}
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
                </div>
            )}
        </div>
    );
}