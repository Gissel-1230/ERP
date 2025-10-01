// app/dashboard/almacenes/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getAlmacenById, addInventarioToAlmacen } from '@/lib/almacen-store';
import { type Almacen, type Inventario } from '@/lib/data';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import InventarioCard from '@/components/almacenes/InventarioCard'; // Nuevo componente
import AddInventarioModal from '@/components/almacenes/AddInventarioModal'; // Nuevo modal

export default function AlmacenDetailPage() {
  const params = useParams();
  const almacenId = params.id as string;

  const [almacen, setAlmacen] = useState<Almacen | null | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setAlmacen(getAlmacenById(almacenId));
  }, [almacenId]);

  const refreshAlmacen = () => {
    setAlmacen({ ...getAlmacenById(almacenId)! });
  };

  const handleAddInventario = (data: Omit<Inventario, 'id' | 'productos'>) => {
    addInventarioToAlmacen(almacenId, data);
    refreshAlmacen();
  };

  if (almacen === undefined) return <div>Cargando...</div>;
  if (almacen === null) notFound();

  const canAddMore = almacen.inventarios.length < 10;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/dashboard/almacenes" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600">
          <ArrowLeft className="h-4 w-4" /> Volver a Almacenes
        </Link>
        <h1 className="text-4xl font-bold">{almacen.nombre}</h1>
        <p className="mt-2 text-lg text-slate-600">{almacen.ubicacion}</p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Inventarios</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!canAddMore}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <Plus className="h-5 w-5" />
          <span>Crear Inventario</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {almacen.inventarios.map(inventario => (
          <InventarioCard key={inventario.id} almacenId={almacen.id} inventario={inventario} />
        ))}
      </div>
      
      <AddInventarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddInventario}
      />
    </div>
  );
}