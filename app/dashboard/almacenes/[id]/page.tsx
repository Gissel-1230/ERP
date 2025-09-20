// app/dashboard/almacenes/[id]/page.tsx

"use client";

import { notFound } from 'next/navigation';
// highlight-start
import { getAlmacenById } from '@/lib/almacen-store'; // Importa desde el store
import { type Item } from '@/lib/data';
// highlight-end
import { Package, Beaker, Wrench, Plus } from 'lucide-react';

const ItemSection = ({ title, items, icon: Icon }: { title: string; items: Item[]; icon: React.ElementType }) => {
  return (
    <div className="rounded-lg border bg-white p-6 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-indigo-500" />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="flex items-center gap-2 rounded-md bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-200 dark:bg-slate-700 dark:text-indigo-400">
          <Plus className="h-4 w-4" /> Agregar
        </button>
      </div>
      <div className="mt-4">
        {items.length > 0 ? (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between rounded-md bg-slate-50 p-3 dark:bg-slate-700/50">
                <span className="font-medium text-slate-700 dark:text-slate-200">{item.nombre}</span>
                <span className="font-mono text-sm text-slate-500 dark:text-slate-400">${item.precio.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-sm text-slate-500">No hay items en esta categoría.</p>
        )}
      </div>
    </div>
  );
};

export default function AlmacenDetailPage({ params }: { params: { id: string } }) {
// highlight-start
  // Ahora busca el almacén en nuestro store en memoria
  const almacen = getAlmacenById(params.id);
  // highlight-end

  if (!almacen) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-mono text-sm text-indigo-600">{almacen.id}</p>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{almacen.nombre}</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">{almacen.ubicacion}</p>
        <p className="mt-4 max-w-2xl text-slate-500">{almacen.descripcion}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ItemSection title="Materia Prima" items={almacen.materiaPrima} icon={Beaker} />
        <ItemSection title="Productos Terminados" items={almacen.productos} icon={Package} />
        <ItemSection title="Insumos" items={almacen.insumos} icon={Wrench} />
      </div>
    </div>
  );
}