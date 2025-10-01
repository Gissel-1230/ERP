// components/almacenes/InventarioCard.tsx
import Link from 'next/link';
import { Layers } from 'lucide-react';
import type { Inventario } from '@/lib/data';

interface InventarioCardProps {
  almacenId: string;
  inventario: Inventario;
}

export default function InventarioCard({ almacenId, inventario }: InventarioCardProps) {
  return (
    <Link href={`/dashboard/almacenes/${almacenId}/${inventario.id}`} legacyBehavior>
      <a className="group block rounded-xl border bg-white p-6 shadow-sm transition-all hover:border-indigo-500 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <Layers className="h-6 w-6 text-indigo-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{inventario.nombre}</h3>
        </div>
        <p className="mt-2 text-sm text-slate-500">{inventario.descripcion}</p>
        <p className="mt-4 text-right text-sm font-semibold text-indigo-600">
          {inventario.productos.length} Productos
        </p>
      </a>
    </Link>
  );
}