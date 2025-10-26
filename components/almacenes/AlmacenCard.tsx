// components/almacenes/AlmacenCard.tsx
import Link from 'next/link';
import { Warehouse, Edit, Trash2 } from 'lucide-react'; // <-- Importa íconos para botones
import type { Almacen } from '@/lib/data';

// --- 1. DEFINE LAS NUEVAS PROPS ---
interface AlmacenCardProps {
  almacen: Almacen;
  onEdit: () => void;    // <-- Función para editar
  onDelete: () => void;  // <-- Función para eliminar
}

// --- 2. RECIBE LAS PROPS ---
export default function AlmacenCard({ almacen, onEdit, onDelete }: AlmacenCardProps) {
  const inventoryCount = almacen.inventarios.length;
  // Ajuste para evitar NaN si el inventario está vacío
  const capacityPercentage = inventoryCount > 0 ? (inventoryCount / 10) * 100 : 0; 

  // --- 3. MANEJADORES PARA EVITAR PROPAGACIÓN DEL LINK ---
  //    Necesitamos esto para que al hacer clic en los botones,
  //    no se active también el Link que rodea toda la tarjeta.
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Detiene la navegación del Link
    e.stopPropagation(); // Detiene cualquier otro evento
    onEdit(); // Llama a la función de editar
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Detiene la navegación del Link
    e.stopPropagation(); // Detiene cualquier otro evento
    onDelete(); // Llama a la función de eliminar
  };


  return (
    // El Link ahora envuelve el contenido principal, pero no los botones de acción
    <div className="group relative rounded-xl border bg-white shadow-sm transition-all hover:border-indigo-500 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <Link href={`/dashboard/almacenes/${almacen.id}`} legacyBehavior>
        <a className="block p-6 cursor-pointer"> {/* Contenido clickeable */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-slate-700 dark:text-indigo-400">
              <Warehouse className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{almacen.nombre}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{almacen.ubicacion}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-300">
              <span>Capacidad Inventario</span> {/* Cambiado para claridad */}
              <span>{inventoryCount} / 10</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${capacityPercentage}%` }}
              ></div>
            </div>
            {/* Mostrar descripción si existe */}
            {almacen.descripcion && (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 truncate"> 
                {almacen.descripcion}
              </p>
            )}
          </div>
        </a>
      </Link>
      
      {/* --- 4. AÑADE LOS BOTONES DE ACCIÓN --- */}
      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button 
          onClick={handleEditClick} 
          className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 dark:bg-slate-600 dark:text-blue-300 dark:hover:bg-slate-500"
          aria-label="Editar almacén"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button 
          onClick={handleDeleteClick} 
          className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200 dark:bg-slate-600 dark:text-red-400 dark:hover:bg-slate-500"
          aria-label="Eliminar almacén"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}