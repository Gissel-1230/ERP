// components/almacenes/AlmacenCard.tsx
import Link from 'next/link';
import { Warehouse } from 'lucide-react';
import type { Almacen } from '@/lib/data';

export default function AlmacenCard({ almacen }: { almacen: Almacen }) {
  const inventoryCount = almacen.inventarios.length;
  const capacityPercentage = (inventoryCount / 10) * 100;

  return (
    <Link href={`/dashboard/almacenes/${almacen.id}`} legacyBehavior>
      <a className="group block rounded-xl border bg-white shadow-sm transition-all hover:border-indigo-500 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <div className="p-6">
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
              <span>Inventario</span>
              <span>{inventoryCount} / 10</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${capacityPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}