// components/almacenes/AlmacenesTable.tsx

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import type { Almacen } from '@/lib/data'; // Importa el tipo desde el nuevo archivo

interface AlmacenesTableProps {
  almacenes: Almacen[];
  onEdit: (almacen: Almacen) => void;
  onDelete: (id: string) => void;
}

// highlight-start
export default function AlmacenesTable({ almacenes, onEdit, onDelete }: AlmacenesTableProps) {
// highlight-end
  return (
    <div className="overflow-x-auto rounded-lg border bg-white dark:bg-slate-800">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 text-xs uppercase text-slate-700 dark:bg-slate-700 dark:text-slate-400">
          <tr>
            <th scope="col" className="px-6 py-3">ID</th>
            <th scope="col" className="px-6 py-3">Nombre</th>
            <th scope="col" className="px-6 py-3">Ubicación</th>
            <th scope="col" className="px-6 py-3">Descripción</th>
            <th scope="col" className="px-6 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {almacenes.map((almacen) => (
            <tr key={almacen.id} className="border-b hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50">
              <td className="px-6 py-4 font-mono text-xs font-medium text-slate-800 dark:text-slate-200">{almacen.id}</td>
              <td className="px-6 py-4 font-semibold">
                <Link href={`/dashboard/almacenes/${almacen.id}`} className="text-indigo-600 hover:underline">
                  {almacen.nombre}
                </Link>
              </td>
              <td className="px-6 py-4">{almacen.ubicacion}</td>
              <td className="px-6 py-4 max-w-sm truncate">{almacen.descripcion}</td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-4">
                  <button onClick={() => onEdit(almacen)} className="text-blue-500 hover:text-blue-700"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => onDelete(almacen.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}