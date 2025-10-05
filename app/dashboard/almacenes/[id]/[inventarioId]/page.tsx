// app/dashboard/almacenes/[id]/[inventarioId]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getInventarioById, addProductoToInventario, updateProductoInInventario, deleteProductoFromInventario } from '@/lib/almacen-store';
import { type Inventario, type Producto } from '@/lib/data';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductosTable from '@/components/almacenes/ProductosTable';
import AddEditProductoModal from '@/components/almacenes/AddEditProductoModal'; // Renombrado

export default function InventarioDetailPage() {
  const params = useParams();
  const almacenId = params.id as string;
  const inventarioId = params.inventarioId as string;

  const [inventario, setInventario] = useState<Inventario | null | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoToEdit, setProductoToEdit] = useState<Producto | null>(null);

  useEffect(() => {
    setInventario(getInventarioById(almacenId, inventarioId));
  }, [almacenId, inventarioId]);
  
  const refreshProductos = () => {
    setInventario({ ...getInventarioById(almacenId, inventarioId)! });
  };
  
  const handleSaveProducto = (productoData: Omit<Producto, 'id'>, id?: string) => {
    if (id) {
      updateProductoInInventario(almacenId, inventarioId, id, productoData);
    } else {
      addProductoToInventario(almacenId, inventarioId, productoData);
    }
    refreshProductos();
  };

  const handleDeleteProducto = (productoId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteProductoFromInventario(almacenId, inventarioId, productoId);
      refreshProductos();
    }
  };

  const handleOpenEditModal = (producto: Producto) => {
    setProductoToEdit(producto);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setProductoToEdit(null);
    setIsModalOpen(true);
  };

  if (inventario === undefined) return <div>Cargando...</div>;
  if (inventario === null) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href={`/dashboard/almacenes/${almacenId}`} className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600">
          <ArrowLeft className="h-4 w-4" /> Volver al Almacén
        </Link>
        <h1 className="text-4xl font-bold">{inventario.nombre}</h1>
        <p className="mt-2 text-lg text-slate-600">{inventario.descripcion}</p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Productos en Inventario</h3>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />
            <span>Agregar Producto</span>
          </button>
        </div>
        <div className="mt-4">
          <ProductosTable 
            inventario={inventario.productos}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteProducto}
          />
        </div>
      </div>
      
      <AddEditProductoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProducto}
        productoToEdit={productoToEdit}
      />
    </div>
  );
}